import json
import os
import time

import pytest
from fastapi.testclient import TestClient

from app import main
from app.jobs import JobManager
from app.worker import run_group
from tests import workers
from tests.test_api import files

client = TestClient(main.app)

OTHER = "def main():\n    print(input())\n    print('x' * 3)\n"


@pytest.fixture(autouse=True)
def fresh_estimate_cache():
    main._estimate_cache.clear()
    yield
    main._estimate_cache.clear()


def body(**extra):
    return {"lang": "python_3", "threshold": 0.8, "files": files("python_3", OTHER), **extra}


def wait_for(job_id, states, timeout=30):
    deadline = time.time() + timeout
    while time.time() < deadline:
        snap = client.get(f"/api/jobs/{job_id}").json()
        if snap["state"] in states:
            return snap
        time.sleep(0.1)
    raise AssertionError(f"job stuck: {snap}")


def pid_alive(pid):
    try:
        os.kill(pid, 0)
    except OSError:
        return False
    return True


@pytest.fixture
def fake_manager(monkeypatch):
    """Swap in a manager whose child process is a test worker; clean up afterwards."""
    created = []

    def make(worker, heartbeat=30.0, **options):
        manager = JobManager(worker, heartbeat_seconds=heartbeat, **options)
        monkeypatch.setattr(main, "manager", manager)
        created.append(manager)
        return manager

    yield make
    for manager in created:
        manager.shutdown()


def test_estimate_shape():
    r = client.post("/api/estimate", json=body())
    assert r.status_code == 200
    est = r.json()
    for key in ("files", "pairs", "structural_pairs", "nodes", "estimated_seconds", "range_seconds"):
        assert key in est
    assert est["files"] == 3 and est["pairs"] == 3
    assert est["allowed"] is True and est["reason"] is None
    assert est["language"] == "python_3" and est["max_seconds"] == main.MAX_ESTIMATED_SECONDS
    assert est["range_seconds"][0] <= est["estimated_seconds"] <= est["range_seconds"][1]


def test_estimate_without_prefilter_is_exact():
    est = client.post("/api/estimate", json=body()).json()
    assert est["exact"] is True and est["exact_reason"] is None


def test_estimate_prefilter_below_the_gate_is_the_upper_bound():
    est = client.post("/api/estimate", json=body(prefilter_margin=0.05)).json()
    assert main.EXACT_PREFILTER_MIN_SECONDS == 10  # tiny inputs are far below it
    assert est["exact"] is False and est["exact_reason"] == "below_threshold"
    # the lower bounds of csimx already drop pairs that cannot reach the threshold
    assert est["structural_pairs"] + est["bound_skipped"] == est["pairs"]
    assert est["prefilter_evaluated"] is False


def test_estimate_prefilter_above_the_gate_is_exact(monkeypatch):
    monkeypatch.setattr(main, "EXACT_PREFILTER_MIN_SECONDS", 0.0)
    est = client.post("/api/estimate", json=body(prefilter_margin=0.05)).json()
    assert est["exact"] is True and est["exact_reason"] is None
    assert est["prefilter_evaluated"] is True
    assert est["estimated_seconds"] <= est["upper_bound_seconds"]
    assert est["structural_pairs"] + est["skipped"] + est["bound_skipped"] == est["pairs"]


def test_gate_value_is_respected(monkeypatch):
    monkeypatch.setattr(main, "EXACT_PREFILTER_MIN_SECONDS", 1e9)
    est = client.post("/api/estimate", json=body(prefilter_margin=0.05)).json()
    assert est["exact"] is False and est["exact_reason"] == "below_threshold"


def test_exact_timeout_falls_back_to_the_bound(monkeypatch):
    monkeypatch.setattr(main, "ESTIMATE_WORKER", workers.slow_exact_estimate_worker)
    monkeypatch.setattr(main, "EXACT_ESTIMATE_TIMEOUT_SECONDS", 0.3)
    est = client.post("/api/estimate", json=body(prefilter_margin=0.05)).json()
    assert est["exact"] is False and est["exact_reason"] == "timeout"
    assert est["estimated_seconds"] == 12.0 and est["allowed"] is True


def test_estimate_timeout_without_any_result_is_504(monkeypatch):
    monkeypatch.setattr(main, "ESTIMATE_WORKER", workers.hanging_estimate_worker)
    monkeypatch.setattr(main, "ESTIMATE_TIMEOUT_SECONDS", 0.3)
    assert client.post("/api/estimate", json=body(prefilter_margin=0.05)).status_code == 504


def test_estimates_are_cached_server_side(monkeypatch):
    first = client.post("/api/estimate", json=body()).json()
    monkeypatch.setattr(main, "ESTIMATE_WORKER", workers.hanging_estimate_worker)  # would time out
    assert client.post("/api/estimate", json=body()).json() == first


def test_estimate_too_expensive(monkeypatch):
    monkeypatch.setattr(main, "MAX_ESTIMATED_SECONDS", 0.0)
    est = client.post("/api/estimate", json=body()).json()
    assert est["allowed"] is False and est["reason"] == "too_slow"


def test_estimate_too_many_files(monkeypatch):
    monkeypatch.setattr(main, "MAX_FILES", 2)
    est = client.post("/api/estimate", json=body()).json()
    assert est["allowed"] is False and est["reason"] == "too_many_files"


def test_estimate_unknown_language_and_one_file():
    r = client.post("/api/estimate", json={**body(), "lang": "cobol"})
    assert r.status_code == 422
    r = client.post("/api/estimate", json={**body(), "files": files("python_3")[:1]})
    assert r.status_code == 400


def test_jobs_rejected_when_not_allowed(monkeypatch):
    monkeypatch.setattr(main, "MAX_ESTIMATED_SECONDS", 0.0)
    r = client.post("/api/jobs", json=body())
    assert r.status_code == 422 and r.json()["detail"]["reason"] == "too_slow"
    monkeypatch.setattr(main, "MAX_FILES", 2)
    r = client.post("/api/jobs", json=body())
    assert r.status_code == 413


def test_job_lifecycle_matches_analyze_all(fake_manager):
    fake_manager(main.group_worker)
    for extra in ({}, {"prefilter_margin": 0.05}):
        started = client.post("/api/jobs", json=body(**extra))
        assert started.status_code == 202
        assert started.json()["estimate"]["files"] == 3  # the estimate comes with the start response
        snap = wait_for(started.json()["job_id"], {"done", "error"})
        assert snap["state"] == "done", snap
        assert snap["eta_seconds"] == 0.0 and "estimate" not in snap
        expected = run_group(main._payload(main.AnalysisRequest(**body(**extra))))
        assert snap["result"] == json.loads(json.dumps(expected))
        assert snap["phase"] in ("parse", "lexical", "structural") and snap["done"] == snap["total"]


def test_unknown_job():
    assert client.get("/api/jobs/nope").status_code == 404
    assert client.delete("/api/jobs/nope").status_code == 404


def test_cancel_kills_the_child(fake_manager):
    manager = fake_manager(workers.slow_worker)
    job_id = client.post("/api/jobs", json=body()).json()["job_id"]
    snap = wait_for(job_id, {"running"})
    time.sleep(0.5)
    snap = client.get(f"/api/jobs/{job_id}").json()
    assert snap["phase"] == "structural" and snap["done"] > 0 and snap["eta_seconds"] is not None
    pid = manager.jobs[job_id].process.pid
    assert pid_alive(pid)
    cancelled = client.delete(f"/api/jobs/{job_id}")
    assert cancelled.json()["state"] == "cancelled"
    assert not pid_alive(pid)
    assert client.delete(f"/api/jobs/{job_id}").json()["state"] == "cancelled"  # idempotent
    assert manager.active is None


def test_second_job_gets_429(fake_manager):
    fake_manager(workers.slow_worker)
    job_id = client.post("/api/jobs", json=body()).json()["job_id"]
    busy = client.post("/api/jobs", json=body())
    assert busy.status_code == 429
    assert busy.json()["job_id"] == job_id and busy.json()["state"] == "running"
    client.delete(f"/api/jobs/{job_id}")
    again = client.post("/api/jobs", json=body())  # free again
    assert again.status_code == 202
    client.delete(f"/api/jobs/{again.json()['job_id']}")


def test_heartbeat_timeout_cancels(fake_manager):
    manager = fake_manager(workers.slow_worker, heartbeat=0.5)
    job_id = client.post("/api/jobs", json=body()).json()["job_id"]
    pid = manager.jobs[job_id].process.pid
    time.sleep(1.5)  # no GET: the background tick must cancel it
    assert manager.jobs[job_id].state == "cancelled"
    assert not pid_alive(pid)


def test_polling_keeps_the_job_alive(fake_manager):
    fake_manager(workers.slow_worker, heartbeat=0.6)
    job_id = client.post("/api/jobs", json=body()).json()["job_id"]
    for _ in range(8):
        time.sleep(0.2)
        assert client.get(f"/api/jobs/{job_id}").json()["state"] == "running"
    client.delete(f"/api/jobs/{job_id}")


def test_child_crash_is_an_error(fake_manager):
    fake_manager(workers.crash_worker)
    job_id = client.post("/api/jobs", json=body()).json()["job_id"]
    snap = wait_for(job_id, {"error"})
    assert "exited unexpectedly" in snap["error"]


def test_worker_error_is_reported(fake_manager):
    fake_manager(workers.failing_worker)
    job_id = client.post("/api/jobs", json=body()).json()["job_id"]
    snap = wait_for(job_id, {"error"})
    assert snap["error"] == "ValueError: boom"


def test_finished_jobs_are_dropped(fake_manager):
    manager = fake_manager(workers.failing_worker)
    manager.keep_seconds = 0.1
    job_id = client.post("/api/jobs", json=body()).json()["job_id"]
    wait_for(job_id, {"error"})
    time.sleep(0.5)
    assert client.get(f"/api/jobs/{job_id}").status_code == 404


def test_polled_payload_is_light(fake_manager):
    fake_manager(workers.slow_worker)
    job_id = client.post("/api/jobs", json=body()).json()["job_id"]
    light = client.get(f"/api/jobs/{job_id}")
    assert light.headers["cache-control"] == "no-store"
    assert "estimate" not in light.json()
    assert set(light.json()) == {
        "job_id", "state", "phase", "done", "total", "elapsed_seconds", "eta_seconds",
        "queue_position", "queue_wait_seconds", "result", "error",
    }
    assert client.get(f"/api/jobs/{job_id}?full=1").json()["estimate"]["files"] == 3
    client.delete(f"/api/jobs/{job_id}")


def test_post_cancel_kills_the_child(fake_manager):
    manager = fake_manager(workers.slow_worker)
    job_id = client.post("/api/jobs", json=body()).json()["job_id"]
    pid = manager.jobs[job_id].process.pid
    assert pid_alive(pid)
    r = client.post(f"/api/jobs/{job_id}/cancel")  # what navigator.sendBeacon sends: no body
    assert r.status_code == 204 and r.content == b""
    assert manager.jobs[job_id].state == "cancelled" and not pid_alive(pid)
    assert manager.active is None
    assert client.post(f"/api/jobs/{job_id}/cancel").status_code == 204  # idempotent
    assert client.post("/api/jobs/does-not-exist/cancel").status_code == 204  # unknown id


def test_post_cancel_after_done_keeps_the_result(fake_manager):
    fake_manager(main.group_worker)
    job_id = client.post("/api/jobs", json=body()).json()["job_id"]
    wait_for(job_id, {"done"})
    assert client.post(f"/api/jobs/{job_id}/cancel").status_code == 204
    assert client.get(f"/api/jobs/{job_id}").json()["state"] == "done"


def test_cancel_beacon_is_a_cors_simple_request():
    # sendBeacon from the deployed UI: POST without body or custom headers, so no preflight, and
    # the response must carry the allowed origin.
    r = client.post("/api/jobs/x/cancel", headers={"Origin": "https://edsoneddy.github.io"})
    assert r.status_code == 204
    assert r.headers["access-control-allow-origin"] == "https://edsoneddy.github.io"


def test_heartbeat_default_is_60_seconds():
    assert main.HEARTBEAT_SECONDS == 60.0
