"""Worker functions for the job tests (importable by the spawned child processes)."""
import os
import time


def slow_worker(conn, payload):
    """Reports progress forever until it is terminated; sends its pid first."""
    conn.send(("progress", "structural", 0, 1000))
    done = 0
    while True:
        time.sleep(0.05)
        done += 1
        conn.send(("progress", "structural", done, 1000))


def crash_worker(conn, payload):
    conn.send(("progress", "parse", 0, 2))
    os._exit(3)


def failing_worker(conn, payload):
    conn.send(("error", "ValueError: boom"))
    conn.close()


def slow_exact_estimate_worker(conn, payload):
    """Sends the upper bound at once, then never finishes the exact pass."""
    conn.send(("partial", {"estimated_seconds": 12.0, "exact": False, "exact_reason": "timeout",
                           "upper_bound_seconds": 12.0, "range_seconds": [8.4, 18.0], "files": 3}))
    time.sleep(60)


def hanging_estimate_worker(conn, payload):
    time.sleep(60)
