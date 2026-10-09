"""Work that runs in child processes (never in the API process).

csimx cannot be interrupted, so the API runs every group job in its own process and cancels it by
terminating that process. The functions here must stay importable at module level (the children
are started with the "spawn" method).
"""
import time

from csimx import estimate_group
from csimx.utils import group_by_exhaustive_search

PROGRESS_INTERVAL = 0.2  # seconds between progress messages (phase changes are always sent)


def run_group(payload, progress=None):
    """Group the files of `payload` and build the payload that analyze-all returns."""
    stats = {}
    options = {}
    if payload["prefilter_margin"] is not None:
        options = {"prefilter_margin": payload["prefilter_margin"], "stats": stats}
    if progress is not None:
        options["progress"] = progress
    groups, groups_avg, unique, printable = group_by_exhaustive_search(
        file_names=payload["names"],
        file_contents=payload["contents"],
        lang=payload["lang"],
        threshold=payload["threshold"],
        ted_algorithm="apted",
        printable_output=False,
        **options,
    )
    return {
        "prefilter_stats": stats or None,
        "similarity_groups": groups,
        "similarity_groups_avg": groups_avg,
        "unique_groups": unique,
        "printable_output": printable,
    }


def group_worker(conn, payload):
    """Child process entry: send ("progress", phase, done, total), then ("result", dict) or
    ("error", text) through `conn`."""
    last = {"phase": None, "time": 0.0}

    def progress(phase, done, total):
        now = time.monotonic()
        if phase != last["phase"] or done >= total or now - last["time"] >= PROGRESS_INTERVAL:
            last["phase"], last["time"] = phase, now
            conn.send(("progress", phase, done, total))

    try:
        conn.send(("result", run_group(payload, progress)))
    except Exception as error:  # reported to the caller, which turns it into state "error"
        conn.send(("error", f"{type(error).__name__}: {error}"))
    finally:
        conn.close()


def estimate_worker(conn, payload):
    """Child process entry. Sends ("result", estimate dict) or ("error", text).

    Always computes the cheap estimate first (parse only: with a prefilter it is an upper bound,
    as if no pair were skipped). With a prefilter, when that bound reaches `exact_min_seconds`, it
    sends it as ("partial", dict) and then runs the exact estimate (the lexical pass over every
    pair, which costs time of its own) and sends that as the result; the parent keeps the partial
    one if the exact pass does not finish in time. Fields added: `exact` and `exact_reason`
    (None, "below_threshold" or, set by the parent, "timeout").
    """
    kwargs = dict(
        threshold=payload["threshold"],
        prefilter_margin=payload["prefilter_margin"],
        speed_factor=payload["speed_factor"],
    )
    names, contents, lang = payload["names"], payload["contents"], payload["lang"]
    try:
        cheap = estimate_group(names, contents, lang, exact_prefilter=False, **kwargs)
        if payload["prefilter_margin"] is None:
            conn.send(("result", {**cheap, "exact": True, "exact_reason": None}))
        elif cheap["estimated_seconds"] < payload["exact_min_seconds"]:
            conn.send(("result", {**cheap, "exact": False, "exact_reason": "below_threshold"}))
        else:
            conn.send(("partial", {**cheap, "exact": False, "exact_reason": "timeout"}))
            exact = estimate_group(names, contents, lang, exact_prefilter=True, **kwargs)
            conn.send(("result", {**exact, "exact": True, "exact_reason": None}))
    except Exception as error:
        conn.send(("error", f"{type(error).__name__}: {error}"))
    finally:
        conn.close()
