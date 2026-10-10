from fastapi import FastAPI, HTTPException, Response, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager
from csimx import Compare, calibrate
from csimx.utils import MAX_PREFILTER_MARGIN
from importlib.metadata import version as get_package_version
import hashlib
import json
import multiprocessing
import os
import threading
import time
import uvicorn

from .jobs import Busy, JobManager
from .worker import estimate_worker, group_worker, run_group

CSIMX_VERSION = get_package_version("csimx")

# Limits, all overridable from the environment.
MAX_ESTIMATED_SECONDS = float(os.environ.get("MAX_ESTIMATED_SECONDS", "600"))
MAX_FILES = int(os.environ.get("MAX_FILES", "100"))
ESTIMATE_TIMEOUT_SECONDS = float(os.environ.get("ESTIMATE_TIMEOUT_SECONDS", "60"))
# With a prefilter the estimate starts as the cheap upper bound; from this many seconds it is
# refined with the exact (lexical) pass, which gets EXACT_ESTIMATE_TIMEOUT_SECONDS before the bound
# is kept instead.
EXACT_PREFILTER_MIN_SECONDS = float(os.environ.get("EXACT_PREFILTER_MIN_SECONDS", "10"))
EXACT_ESTIMATE_TIMEOUT_SECONDS = float(os.environ.get("EXACT_ESTIMATE_TIMEOUT_SECONDS", "20"))
HEARTBEAT_SECONDS = float(os.environ.get("HEARTBEAT_SECONDS", "60"))
JOB_KEEP_SECONDS = float(os.environ.get("JOB_KEEP_SECONDS", "600"))

# Speed of this machine against the csimx reference (1.0 until the background calibration ends).
ESTIMATE_WORKER = estimate_worker  # replaced by the tests
speed_state = {"factor": 1.0, "calibrated": False}
manager = JobManager(group_worker, HEARTBEAT_SECONDS, JOB_KEEP_SECONDS)


def _calibrate_in_background():
    try:
        speed_state["factor"] = calibrate()
        speed_state["calibrated"] = True
    except Exception:  # keep the 1.0 fallback
        pass


@asynccontextmanager
async def lifespan(_app):
    threading.Thread(target=_calibrate_in_background, daemon=True).start()
    yield
    manager.shutdown()


class FileItem(BaseModel):
    name: str = Field(..., min_length=1, description="The name of the file")
    content: str = Field(
        ..., min_length=1, description="The source code or content of the file"
    )


class AnalysisRequest(BaseModel):
    lang: str = Field(
        ..., min_length=1, description="Programming language of the files"
    )
    prefilter_margin: float | None = Field(
        default=None,
        ge=0.0,
        le=MAX_PREFILTER_MARGIN,
        description="analyze-all / estimate / jobs: lexical prefilter margin (null = off)",
    )
    threshold: float | None = Field(
        default=0.0,
        ge=0.0,
        le=1.0,
        description="Optional similarity threshold between 0.0 and 1.0",
    )
    files: list[FileItem] = Field(..., description="List of files to compare")


app = FastAPI(title="CSIM Online API", lifespan=lifespan)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://edsoneddy.github.io"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "API is running smoothly"}


@app.get("/api/version")
def read_version():
    return {
        "csimx_version": CSIMX_VERSION,
        "speed_factor": round(speed_state["factor"], 3),
        "max_estimated_seconds": MAX_ESTIMATED_SECONDS,
        "max_files": MAX_FILES,
    }


@app.post("/api/analyze")
def analyze_similarity(data: AnalysisRequest):
    if len(data.files) != 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must provide exactly two files to compare similarity.",
        )

    file1 = data.files[0]
    file2 = data.files[1]

    similarity_index = Compare(
        name_a=file1.name,
        content_a=file1.content,
        name_b=file2.name,
        content_b=file2.content,
        lang=data.lang,
        ted_algorithm="apted",
    )

    return {
        "result": similarity_index,
    }

def _payload(data: AnalysisRequest):
    return {
        "names": [file.name for file in data.files],
        "contents": [file.content for file in data.files],
        "lang": data.lang,
        "threshold": data.threshold or 0.0,
        "prefilter_margin": data.prefilter_margin,
    }


def _require_two_files(data: AnalysisRequest):
    if len(data.files) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must provide at least two files to compare similarity.",
        )


@app.post("/api/analyze-all")
def analyze_similarity_all(data: AnalysisRequest):
    """Synchronous grouping. Deprecated: use POST /api/estimate and POST /api/jobs, which show
    the expected time, report progress and can be cancelled. Kept for the already deployed UI."""
    _require_two_files(data)
    return run_group(_payload(data))


def _run_estimate(payload):
    """Estimate in a short-lived child process, so a slow parse can neither block the API nor
    outlive the timeout. With a prefilter the child first sends the cheap upper bound and, when
    that is worth refining (EXACT_PREFILTER_MIN_SECONDS), the exact estimate; if the exact one
    is not there within EXACT_ESTIMATE_TIMEOUT_SECONDS the bound is returned (`exact: false`,
    `exact_reason: "timeout"`)."""
    context = multiprocessing.get_context("spawn")
    parent, child = context.Pipe(duplex=False)
    process = context.Process(
        target=ESTIMATE_WORKER,
        args=(
            child,
            {
                **payload,
                "speed_factor": speed_state["factor"],
                "exact_min_seconds": EXACT_PREFILTER_MIN_SECONDS,
            },
        ),
        daemon=True,
    )
    process.start()
    child.close()
    partial = None
    try:
        wait = ESTIMATE_TIMEOUT_SECONDS
        while True:
            if not parent.poll(wait):
                if partial is not None:
                    return partial  # the exact pass is too slow: keep the upper bound
                raise HTTPException(
                    status_code=status.HTTP_504_GATEWAY_TIMEOUT,
                    detail="The estimate took too long; try fewer files.",
                )
            kind, value = parent.recv()
            if kind == "partial":
                partial = value
                wait = EXACT_ESTIMATE_TIMEOUT_SECONDS
            elif kind == "error":
                if partial is not None:
                    return partial
                raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=value)
            else:
                return value
    except EOFError:
        if partial is not None:
            return partial
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The estimate process stopped unexpectedly.",
        )
    finally:
        if process.is_alive():
            process.terminate()
        process.join(2)
        parent.close()


# Server-side memo of the estimates this API computed itself (never supplied by a client), so that
# POST /api/jobs right after POST /api/estimate does not pay for the lexical pass twice.
ESTIMATE_CACHE_SECONDS = 120.0
_estimate_cache = {}


def _cached_estimate(payload):
    key = hashlib.sha256(
        json.dumps(
            [payload["names"], payload["contents"], payload["lang"], payload["threshold"],
             payload["prefilter_margin"], round(speed_state["factor"], 3)]
        ).encode()
    ).hexdigest()
    now = time.monotonic()
    for old in [k for k, (t, _) in _estimate_cache.items() if now - t > ESTIMATE_CACHE_SECONDS]:
        del _estimate_cache[old]
    if key in _estimate_cache:
        return _estimate_cache[key][1]
    estimate = _run_estimate(payload)
    _estimate_cache[key] = (now, estimate)
    while len(_estimate_cache) > 8:
        del _estimate_cache[next(iter(_estimate_cache))]
    return estimate


def _estimate_response(data: AnalysisRequest):
    """The estimate plus `allowed`; the files cap is checked before anything is parsed."""
    base = {"language": data.lang, "max_seconds": MAX_ESTIMATED_SECONDS, "max_files": MAX_FILES}
    if len(data.files) > MAX_FILES:
        return {
            **base,
            "files": len(data.files),
            "allowed": False,
            "reason": "too_many_files",
        }
    estimate = _cached_estimate(_payload(data))
    too_slow = estimate["estimated_seconds"] > MAX_ESTIMATED_SECONDS
    return {
        **estimate,
        **base,
        "allowed": not too_slow,
        "reason": "too_slow" if too_slow else None,
    }


@app.post("/api/estimate")
def estimate_time(data: AnalysisRequest):
    _require_two_files(data)
    return _estimate_response(data)


def _busy_response(job):
    return JSONResponse(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        content={"detail": "Another analysis is running.", **manager.snapshot(job)},
        headers={"Cache-Control": "no-store"},
    )


@app.post("/api/jobs", status_code=status.HTTP_202_ACCEPTED)
def start_job(data: AnalysisRequest):
    _require_two_files(data)
    if manager.active is not None:  # cheap check before paying for an estimate
        manager.tick()
        if manager.active is not None:
            return _busy_response(manager.active)
    estimate = _estimate_response(data)  # always recomputed here, never trusted from the client
    if not estimate["allowed"]:
        raise HTTPException(
            status_code=(
                status.HTTP_413_REQUEST_ENTITY_TOO_LARGE
                if estimate["reason"] == "too_many_files"
                else status.HTTP_422_UNPROCESSABLE_ENTITY
            ),
            detail=estimate,
        )
    try:
        job = manager.start(_payload(data), estimate)
    except Busy as busy:
        return _busy_response(busy.job)
    return {"job_id": job.id, "estimate": estimate}


def _job_or_404(job, full=False):
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Unknown job.")
    return manager.snapshot(job, full)


@app.get("/api/jobs/{job_id}")
def read_job(job_id: str, response: Response, full: bool = False):
    """Light by default (the estimate comes with POST /api/jobs; `?full=1` adds it again)."""
    response.headers["Cache-Control"] = "no-store"
    return _job_or_404(manager.get(job_id), full)


@app.delete("/api/jobs/{job_id}")
def cancel_job(job_id: str):
    return _job_or_404(manager.cancel(job_id))


@app.post("/api/jobs/{job_id}/cancel", status_code=status.HTTP_204_NO_CONTENT)
def cancel_job_post(job_id: str):
    """Same as DELETE but for navigator.sendBeacon (POST only, a CORS simple request: no body, no
    custom headers, so no preflight). Idempotent: 204 even if the job is finished or unknown."""
    manager.cancel(job_id)
