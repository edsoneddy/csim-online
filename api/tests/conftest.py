import pytest

from app import main
from app.clients import RateLimiter
from app.jobs import JobManager


@pytest.fixture(autouse=True)
def isolated_state(monkeypatch):
    """Every test gets its own manager, rate limiter and estimate cache."""
    monkeypatch.setattr(main, "estimate_limiter", RateLimiter(10_000, 60.0))
    manager = JobManager(main.group_worker, main.HEARTBEAT_SECONDS, main.JOB_KEEP_SECONDS)
    monkeypatch.setattr(main, "manager", manager)
    main._estimate_cache.clear()
    yield
    manager.shutdown()
    main._estimate_cache.clear()
