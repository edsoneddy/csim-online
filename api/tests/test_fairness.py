"""Hard limits and fairness: deadlines, queue, per-client rules, budget, sizes, rate limits."""
import json
import threading
import time

import pytest
from fastapi.testclient import TestClient

from app import main
from app.clients import RateLimiter, client_key
from app.jobs import JobManager, Rejected, job_deadline
from tests import workers
from tests.test_api import files
from tests.test_jobs import body, pid_alive, wait_for

client = TestClient(main.app)
A = {"X-Forwarded-For": "10.0.0.1"}
B = {"X-Forwarded-For": "10.0.0.2"}
EST = {"estimated_seconds": 30.0, "range_seconds": [20.0, 40.0]}


class Clock:
    def __init__(self):
        self.t = 1000.0

    def __call__(self):
        return self.t

    def advance(self, seconds):
        self.t += seconds


@pytest.fixture
def clock():
    return Clock()


@pytest.fixture
def make_manager(monkeypatch):
    created = []

    def make(worker=workers.slow_worker, install=False, **options):
        options.setdefault("heartbeat_seconds", 3600.0)
        manager = JobManager(worker, **options)
        created.append(manager)
        if install:
            monkeypatch.setattr(main, "manager", manager)
        return manager

    yield make
    for manager in created:
        manager.shutdown()


# -- deadline --------------------------------------------------------------------------------
def test_job_deadline_formula():
    assert job_deadline({"range_seconds": [5, 10]}, 900) == 60  # never below 60 s
    assert job_deadline({"range_seconds": [50, 100]}, 900) == 200  # 2 x the high end
    assert job_deadline({"range_seconds": [500, 2000]}, 900) == 900  # capped by MAX_JOB_SECONDS
    assert job_deadline({}, 900) == 60


def test_deadline_kills_the_child_and_frees_the_slot(make_manager, clock):
    manager = make_manager(clock=clock)
    first = manager.start("a", {}, EST)
    second = manager.start("b", {}, EST)  # waits behind it
    pid = first.process.pid
    assert first.deadline == 80.0 and second.state == "queued"
    clock.advance(79)
    manager.tick()
    assert first.state == "running"
    clock.advance(2)
    manager.tick()
    assert first.state == "timeout" and "time limit" in first.error
    assert not pid_alive(pid)
    assert second.state == "running"  # the slot was handed over
    snap = manager.snapshot(first)
    assert snap["state"] == "timeout" and "time limit" in snap["error"]
    assert manager.usage["a"][0][1] == pytest.approx(81.0)  # charged with the real time


# -- queue -----------------------------------------------------------------------------------
def test_queue_order_positions_and_automatic_start(make_manager, clock):
    manager = make_manager(clock=clock)
    first = manager.start("a", {}, EST)
    second = manager.start("b", {}, EST)
    third = manager.start("c", {}, EST)
    assert [j.state for j in (first, second, third)] == ["running", "queued", "queued"]
    s2, s3 = manager.snapshot(second), manager.snapshot(third)
    assert (s2["queue_position"], s3["queue_position"]) == (1, 2)
    assert s2["queue_wait_seconds"] == pytest.approx(30.0)  # what the running one still needs
    assert s3["queue_wait_seconds"] == pytest.approx(60.0)  # plus the one ahead
    assert manager.queue_info() == {"length": 2, "running": True, "wait_seconds": 90.0}
    manager.cancel(first.id)  # frees the slot: FIFO, second starts
    assert (second.state, third.state) == ("running", "queued")
    assert manager.snapshot(third)["queue_position"] == 1
    manager.cancel(second.id)
    assert third.state == "running"
    manager.cancel(third.id)
    assert manager.active is None and manager.queue == []


def test_queued_job_can_be_cancelled_and_leaves_the_queue(make_manager, clock):
    manager = make_manager(clock=clock)
    manager.start("a", {}, EST)
    queued = manager.start("b", {}, EST)
    pid = queued.process
    assert pid is None
    manager.cancel(queued.id)
    assert queued.state == "cancelled" and manager.queue == [] and "b" not in manager.client_jobs
    manager.cancel(queued.id)  # idempotent


def test_queued_jobs_need_the_heartbeat_too(make_manager, clock):
    manager = make_manager(clock=clock, heartbeat_seconds=60.0)
    running = manager.start("a", {}, EST)
    queued = manager.start("b", {}, EST)
    clock.advance(40)
    manager.get(running.id)  # only the running one is polled
    clock.advance(30)
    manager.tick()
    assert queued.state == "cancelled" and "heartbeat" in queued.error
    assert running.state == "running" and manager.queue == []


def test_queue_full_and_one_job_per_client(make_manager, clock):
    manager = make_manager(clock=clock, max_queue=1)
    first = manager.start("a", {}, EST)
    manager.start("b", {}, EST)
    with pytest.raises(Rejected) as full:
        manager.start("c", {}, EST)
    assert full.value.code == "queue_full" and full.value.retry_after >= 1
    with pytest.raises(Rejected) as busy:
        manager.start("a", {}, EST)
    assert busy.value.code == "client_busy" and busy.value.job is first


# -- budget ----------------------------------------------------------------------------------
def test_budget_rejection_and_recovery(make_manager, clock):
    manager = make_manager(clock=clock, client_budget_seconds=100.0, budget_window_seconds=1000.0)
    job = manager.start("a", {}, EST)
    clock.advance(80)
    manager.cancel(job.id)  # used 80 s of 100
    with pytest.raises(Rejected) as over:
        manager.start("a", {}, EST)  # 80 + 30 > 100
    assert over.value.code == "budget_exceeded"
    assert over.value.retry_after == pytest.approx(1000 - 0, abs=1)  # the 80 s leave the window then
    other = manager.start("b", {}, EST)  # other clients are not affected
    manager.cancel(other.id)
    clock.advance(1000)
    manager.tick()
    assert "a" not in manager.usage  # old entries are dropped: no unbounded growth
    assert manager.start("a", {}, EST).state in ("queued", "running")


def test_budget_retry_after_is_when_enough_budget_frees_up(make_manager, clock):
    manager = make_manager(clock=clock, client_budget_seconds=100.0, budget_window_seconds=1000.0)
    for _ in range(2):  # two jobs of 50 s each, 100 s apart
        job = manager.start("a", {}, {"estimated_seconds": 10, "range_seconds": [5, 10]})
        clock.advance(50)
        manager.cancel(job.id)
        clock.advance(100)
    with pytest.raises(Rejected) as over:
        manager.start("a", {}, {"estimated_seconds": 60, "range_seconds": [5, 10]})
    # used 100, needs 60 more: the FIRST entry (50 s) is not enough, the second frees enough
    first_end, second_end = [t for t, _ in manager.usage["a"]]
    assert over.value.retry_after == pytest.approx(second_end + 1000 - clock.t, abs=0.5)


# -- API: clients, queue, sizes, limits ---------------------------------------------------------
def test_api_two_clients_second_is_queued_then_runs(make_manager):
    make_manager(workers.slow_worker, install=True)
    first = client.post("/api/jobs", json=body(), headers=A)
    assert first.status_code == 202 and first.json()["state"] == "running"
    second = client.post("/api/jobs", json=body(), headers=B)
    assert second.status_code == 202
    assert second.json()["state"] == "queued" and second.json()["queue_position"] == 1
    assert second.json()["queue_wait_seconds"] >= 0
    queued = client.get(f"/api/jobs/{second.json()['job_id']}").json()
    assert queued["state"] == "queued" and queued["queue_position"] == 1
    info = client.post("/api/estimate", json=body(), headers=B).json()["queue"]
    assert info["running"] is True and info["length"] == 1
    client.delete(f"/api/jobs/{first.json()['job_id']}")
    snap = wait_for(second.json()["job_id"], {"running"})
    assert snap["queue_position"] is None
    client.post(f"/api/jobs/{second.json()['job_id']}/cancel")


def test_api_client_busy_names_the_existing_job(make_manager):
    make_manager(workers.slow_worker, install=True)
    job_id = client.post("/api/jobs", json=body(), headers=A).json()["job_id"]
    again = client.post("/api/jobs", json=body(), headers=A)
    assert again.status_code == 429 and again.json()["code"] == "client_busy"
    assert again.json()["job_id"] == job_id
    client.delete(f"/api/jobs/{job_id}")


def test_api_queue_full_has_retry_after(make_manager):
    make_manager(workers.slow_worker, install=True, max_queue=1)
    client.post("/api/jobs", json=body(), headers=A)
    client.post("/api/jobs", json=body(), headers=B)
    full = client.post("/api/jobs", json=body(), headers={"X-Forwarded-For": "10.0.0.3"})
    assert full.status_code == 429 and full.json()["code"] == "queue_full"
    assert int(full.headers["retry-after"]) >= 1 and full.json()["retry_after"] >= 1


def test_api_budget_exceeded_has_retry_after(make_manager):
    make_manager(
        workers.slow_worker, install=True, client_budget_seconds=0.5, budget_window_seconds=3600.0
    )
    job_id = client.post("/api/jobs", json=body(), headers=A).json()["job_id"]
    time.sleep(0.6)
    client.delete(f"/api/jobs/{job_id}")  # ~0.6 s charged; the next estimate is larger than the rest
    r = client.post("/api/jobs", json=body(), headers=A)
    assert r.status_code == 429 and r.json()["code"] == "budget_exceeded"
    assert int(r.headers["retry-after"]) >= 1


def test_size_limits_are_413_everywhere(monkeypatch):
    monkeypatch.setattr(main, "MAX_FILE_BYTES", 60)
    two = {"lang": "python_3", "files": files("python_3")[:2]}
    big = {**two, "files": [{"name": "huge.py", "content": "x = 1\n" * 40}, two["files"][1]]}
    for path in ("/api/estimate", "/api/jobs", "/api/analyze"):
        r = client.post(path, json=big)
        assert r.status_code == 413 and r.json()["code"] == "file_too_large", path
        assert "huge.py" in r.json()["detail"]
    monkeypatch.setattr(main, "MAX_FILE_BYTES", 10_000)
    monkeypatch.setattr(main, "MAX_TOTAL_BYTES", 100)
    r = client.post("/api/estimate", json={**two, "files": [two["files"][0]] * 3})
    assert r.status_code == 413 and r.json()["code"] == "total_too_large"


def test_size_is_counted_in_utf8_bytes(monkeypatch):
    monkeypatch.setattr(main, "MAX_FILE_BYTES", 30)
    text = "é" * 20  # 20 characters, 40 bytes
    r = client.post(
        "/api/estimate",
        json={"lang": "python_3", "files": [{"name": "u.py", "content": text}] * 2},
    )
    assert r.status_code == 413


def test_body_is_rejected_by_content_length_before_parsing(monkeypatch):
    monkeypatch.setattr(main, "MAX_BODY_BYTES", 50)
    r = client.post("/api/estimate", content=b"x" * 200, headers={"Content-Type": "application/json"})
    assert r.status_code == 413 and r.json()["code"] == "body_too_large"
    r = client.post(
        "/api/estimate",
        content=b"x" * 200,
        headers={"Origin": "https://edsoneddy.github.io", "Content-Type": "application/json"},
    )
    assert r.headers["access-control-allow-origin"] == "https://edsoneddy.github.io"


def test_analyze_times_out_with_504(monkeypatch):
    monkeypatch.setattr(main, "COMPARE_WORKER", workers.hanging_estimate_worker)
    monkeypatch.setattr(main, "ANALYZE_TIMEOUT_SECONDS", 0.3)
    r = client.post("/api/analyze", json={"lang": "python_3", "files": files("python_3")[:2]})
    assert r.status_code == 504


def test_estimate_concurrency_limit_returns_429(monkeypatch):
    monkeypatch.setattr(main, "child_slots", threading.BoundedSemaphore(1))
    monkeypatch.setattr(main, "CHILD_SLOT_WAIT_SECONDS", 0.2)
    monkeypatch.setattr(main, "ESTIMATE_WORKER", workers.hanging_estimate_worker)
    monkeypatch.setattr(main, "ESTIMATE_TIMEOUT_SECONDS", 3.0)
    holder = threading.Thread(
        target=lambda: client.post("/api/estimate", json=body(prefilter_margin=0.05))
    )
    holder.start()
    time.sleep(0.5)  # the first request holds the only slot
    r = client.post("/api/estimate", json=body())
    assert r.status_code == 429 and r.json()["code"] == "busy" and "retry-after" in r.headers
    holder.join()


def test_estimate_rate_limit(monkeypatch):
    monkeypatch.setattr(main, "estimate_limiter", RateLimiter(2, 60.0))
    codes = [client.post("/api/estimate", json=body(), headers=A).status_code for _ in range(3)]
    assert codes == [200, 200, 429]
    r = client.post("/api/estimate", json=body(), headers=A)
    assert r.json()["code"] == "rate_limited" and int(r.headers["retry-after"]) >= 1
    assert client.post("/api/estimate", json=body(), headers=B).status_code == 200  # per client


def test_rate_limiter_window_with_a_fake_clock(clock):
    limiter = RateLimiter(2, 60.0, clock=clock)
    assert limiter.hit("k") is None and limiter.hit("k") is None
    wait = limiter.hit("k")
    assert wait == pytest.approx(60.0)
    clock.advance(61)
    assert limiter.hit("k") is None


# -- client key ------------------------------------------------------------------------------
def test_client_key_uses_the_address_the_trusted_proxy_appended():
    spoofed = {"x-forwarded-for": "6.6.6.6, 203.0.113.9"}  # client forged 6.6.6.6
    honest = {"x-forwarded-for": "203.0.113.9"}
    assert client_key(spoofed, "10.1.1.1") == client_key(honest, "10.1.1.1")
    other = {"x-forwarded-for": "7.7.7.7, 203.0.113.10"}
    assert client_key(other, "10.1.1.1") != client_key(spoofed, "10.1.1.1")


def test_client_key_hops_missing_header_and_privacy():
    chain = {"x-forwarded-for": "198.51.100.7, 172.70.0.1, 10.0.0.9"}
    assert client_key(chain, "p", trusted_hops=1) == client_key({"x-forwarded-for": "10.0.0.9"}, "p")
    assert client_key(chain, "p", trusted_hops=2) == client_key({"x-forwarded-for": "172.70.0.1"}, "p")
    assert client_key(chain, "p", trusted_hops=3) == client_key({"x-forwarded-for": "198.51.100.7"}, "p")
    assert client_key(chain, "p", trusted_hops=9) == client_key({"x-forwarded-for": "198.51.100.7"}, "p")
    assert client_key({}, "192.0.2.1") == client_key({}, "192.0.2.1")  # no header: the socket peer
    assert client_key({}, "192.0.2.1") != client_key({}, "192.0.2.2")
    assert client_key({}, None) == client_key({}, None)
    key = client_key(chain, "p")
    assert len(key) == 12 and "10.0.0.9" not in key
    assert client_key({"cf-connecting-ip": "9.9.9.9"}, "p", ip_header="cf-connecting-ip") == (
        client_key({"x-forwarded-for": "9.9.9.9"}, "p")
    )


def test_estimate_has_queue_info():
    assert client.post("/api/estimate", json=body()).json()["queue"] == {
        "length": 0, "running": False, "wait_seconds": 0.0,
    }
