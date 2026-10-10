from fastapi import FastAPI, HTTPException, Request, Response, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from contextlib import asynccontextmanager, contextmanager
from csimx import calibrate
from csimx.utils import MAX_PREFILTER_MARGIN
from importlib.metadata import version as get_package_version
import hashlib
import json
import math
import multiprocessing
import os
import threading
import time
import uvicorn

from .clients import RateLimiter, client_key
from .jobs import JobManager, Rejected
from .worker import compare_worker, estimate_worker, group_worker

CSIMX_VERSION = get_package_version("csimx")

# Limits, all overridable from the environment (see the table in README.md).
MAX_ESTIMATED_SECONDS = float(os.environ.get("MAX_ESTIMATED_SECONDS", "600"))
MAX_FILES = int(os.environ.get("MAX_FILES", "100"))
MAX_FILE_BYTES = int(os.environ.get("MAX_FILE_BYTES", "200000"))
MAX_TOTAL_BYTES = int(os.environ.get("MAX_TOTAL_BYTES", "3000000"))
# Raw request body cap, checked from Content-Length before anything is parsed (JSON escapes
# can make the body somewhat larger than the sum of the file bytes).
MAX_BODY_BYTES = int(os.environ.get("MAX_BODY_BYTES", str(2 * MAX_TOTAL_BYTES + 65536)))
MAX_JOB_SECONDS = float(os.environ.get("MAX_JOB_SECONDS", "900"))
MIN_JOB_SECONDS = float(os.environ.get("MIN_JOB_SECONDS", "60"))  # floor of the deadline
ESTIMATE_TIMEOUT_SECONDS = float(os.environ.get("ESTIMATE_TIMEOUT_SECONDS", "60"))
ANALYZE_TIMEOUT_SECONDS = float(os.environ.get("ANALYZE_TIMEOUT_SECONDS", "30"))
# Child processes (estimates and pair comparisons) running at once, and how long a request waits
# for a free slot before it gets 429.
ESTIMATE_CONCURRENCY = int(os.environ.get("ESTIMATE_CONCURRENCY", "2"))
CHILD_SLOT_WAIT_SECONDS = float(os.environ.get("CHILD_SLOT_WAIT_SECONDS", "5"))
ESTIMATE_RATE_PER_MINUTE = int(os.environ.get("ESTIMATE_RATE_PER_MINUTE", "12"))
# With a prefilter the estimate starts as the cheap upper bound; from this many seconds it is
# refined with the exact (lexical) pass, which gets EXACT_ESTIMATE_TIMEOUT_SECONDS before the bound
# is kept instead.
EXACT_PREFILTER_MIN_SECONDS = float(os.environ.get("EXACT_PREFILTER_MIN_SECONDS", "10"))
EXACT_ESTIMATE_TIMEOUT_SECONDS = float(os.environ.get("EXACT_ESTIMATE_TIMEOUT_SECONDS", "20"))
HEARTBEAT_SECONDS = float(os.environ.get("HEARTBEAT_SECONDS", "60"))
JOB_KEEP_SECONDS = float(os.environ.get("JOB_KEEP_SECONDS", "600"))
MAX_QUEUE = int(os.environ.get("MAX_QUEUE", "5"))
CLIENT_BUDGET_SECONDS = float(os.environ.get("CLIENT_BUDGET_SECONDS", "900"))
CLIENT_BUDGET_WINDOW_SECONDS = float(os.environ.get("CLIENT_BUDGET_WINDOW_SECONDS", "3600"))
TRUSTED_PROXY_HOPS = int(os.environ.get("TRUSTED_PROXY_HOPS", "1"))
CLIENT_IP_HEADER = os.environ.get("CLIENT_IP_HEADER") or None

# Speed of this machine against the csimx reference (1.0 until the background calibration ends).
ESTIMATE_WORKER = estimate_worker  # replaced by the tests
COMPARE_WORKER = compare_worker
speed_state = {"factor": 1.0, "calibrated": False}
manager = JobManager(
    group_worker,
    HEARTBEAT_SECONDS,
    JOB_KEEP_SECONDS,
    max_queue=MAX_QUEUE,
    max_job_seconds=MAX_JOB_SECONDS,
    min_job_seconds=MIN_JOB_SECONDS,
    client_budget_seconds=CLIENT_BUDGET_SECONDS,
    budget_window_seconds=CLIENT_BUDGET_WINDOW_SECONDS,
)
child_slots = threading.BoundedSemaphore(ESTIMATE_CONCURRENCY)
estimate_limiter = RateLimiter(ESTIMATE_RATE_PER_MINUTE, 60.0)


class ApiError(Exception):
    """An error with a machine-readable `code` next to the message (the UI keys on it)."""

    def __init__(self, status_code, code, message, retry_after=None, **extra):
        super().__init__(message)
        self.status_code, self.code, self.message = status_code, code, message
        self.retry_after, self.extra = retry_after, extra


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


@app.exception_handler(ApiError)
async def api_error_handler(_request, error: ApiError):
    headers = {"Cache-Control": "no-store"}
    content = {"detail": error.message, "code": error.code, **error.extra}
    if error.retry_after is not None:
        seconds = max(1, math.ceil(error.retry_after))
        headers["Retry-After"] = str(seconds)
        content["retry_after"] = seconds  # also in the body: browsers hide Retry-After from scripts
    return JSONResponse(
        status_code=error.status_code,
        content=content,
        headers=headers,
    )


# Added before the CORS middleware, so CORS wraps it and the browser can read the 413.
@app.middleware("http")
async def limit_body_size(request: Request, call_next):
    length = request.headers.get("content-length")
    too_big = length is not None and length.isdigit() and int(length) > MAX_BODY_BYTES
    chunked = length is None and "chunked" in request.headers.get("transfer-encoding", "")
    if too_big or chunked:
        return JSONResponse(
            status_code=413 if too_big else 411,
            content={
                "detail": f"The request is too large (limit {MAX_BODY_BYTES // 1000} KB).",
                "code": "body_too_large",
            },
        )
    return await call_next(request)


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
    expose_headers=["Retry-After"],
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
        "max_file_bytes": MAX_FILE_BYTES,
        "max_total_bytes": MAX_TOTAL_BYTES,
    }


@app.get("/api/client")
def read_client(request: Request):
    """Diagnostic for the per-client limits: how this request is identified, without any address.

    `key` is the short hash used by the limits; `forwarded_entries` how many addresses the proxies
    chain put in X-Forwarded-For; `edge_headers` which client-address headers arrived (names only).
    Use it on a deployed instance to pick TRUSTED_PROXY_HOPS / CLIENT_IP_HEADER."""
    names = ("cf-connecting-ip", "true-client-ip", "x-real-ip", "forwarded")
    forwarded = [p for p in (request.headers.get("x-forwarded-for") or "").split(",") if p.strip()]
    return JSONResponse(
        {
            "key": _client(request),
            "forwarded_entries": len(forwarded),
            "trusted_proxy_hops": TRUSTED_PROXY_HOPS,
            "client_ip_header": CLIENT_IP_HEADER,
            "edge_headers": [n for n in names if request.headers.get(n)],
        },
        headers={"Cache-Control": "no-store"},
    )


def _client(request: Request):
    return client_key(
        request.headers,
        request.client.host if request.client else None,
        TRUSTED_PROXY_HOPS,
        CLIENT_IP_HEADER,
    )


def _check_sizes(data: "AnalysisRequest"):
    """413 when a file or the whole request is too big (utf-8 bytes of the content)."""
    total = 0
    for file in data.files:
        size = len(file.content.encode("utf-8"))
        total += size
        if size > MAX_FILE_BYTES:
            raise ApiError(
                status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                "file_too_large",
                f'File "{file.name}" is {size // 1000} KB; the limit is {MAX_FILE_BYTES // 1000} KB per file.',
                file=file.name,
                bytes=size,
                max_file_bytes=MAX_FILE_BYTES,
            )
    if total > MAX_TOTAL_BYTES:
        raise ApiError(
            status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            "total_too_large",
            f"The files add up to {total // 1000} KB; the limit is {MAX_TOTAL_BYTES // 1000} KB in total.",
            bytes=total,
            max_total_bytes=MAX_TOTAL_BYTES,
        )


def _rate_limit(request: Request):
    wait = estimate_limiter.hit(_client(request))
    if wait is not None:
        raise ApiError(
            status.HTTP_429_TOO_MANY_REQUESTS,
            "rate_limited",
            "Too many requests; wait a moment.",
            retry_after=wait,
        )


@contextmanager
def _child_slot():
    """One of ESTIMATE_CONCURRENCY child-process slots; waits a few seconds, then 429."""
    if not child_slots.acquire(timeout=CHILD_SLOT_WAIT_SECONDS):
        raise ApiError(
            status.HTTP_429_TOO_MANY_REQUESTS,
            "busy",
            "The service is busy; try again in a few seconds.",
            retry_after=5,
        )
    try:
        yield
    finally:
        child_slots.release()


@app.post("/api/analyze")
def analyze_similarity(data: AnalysisRequest):
    if len(data.files) != 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must provide exactly two files to compare similarity.",
        )
    _check_sizes(data)
    file1, file2 = data.files
    with _child_slot():
        # bounded: a short-lived child with a timeout, like the estimate
        similarity_index = _run_child(
            COMPARE_WORKER,
            {
                "name_a": file1.name,
                "content_a": file1.content,
                "name_b": file2.name,
                "content_b": file2.content,
                "lang": data.lang,
            },
            ANALYZE_TIMEOUT_SECONDS,
            "The comparison took too long; try smaller files.",
        )
    return {"result": similarity_index}


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
def analyze_similarity_all():
    """Gone. Grouping now runs as a background job (POST /api/estimate, then POST /api/jobs) so
    that it shows the expected time, reports progress, queues fairly and can be cancelled. The
    route stays so that an old page gets a clear message instead of a 404."""
    raise ApiError(
        status.HTTP_410_GONE,
        "gone",
        "This version of the page is out of date. Reload the page to analyze files.",
    )


def _run_child(target, payload, timeout, timeout_message):
    """Run `target(conn, payload)` in a spawned child and return its ("result", value); the
    child is always terminated. 504 on timeout, 422 when it reports an error."""
    context = multiprocessing.get_context("spawn")
    parent, child = context.Pipe(duplex=False)
    process = context.Process(target=target, args=(child, payload), daemon=True)
    process.start()
    child.close()
    try:
        if not parent.poll(timeout):
            raise HTTPException(status_code=status.HTTP_504_GATEWAY_TIMEOUT, detail=timeout_message)
        kind, value = parent.recv()
    except EOFError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="The worker process stopped unexpectedly.",
        )
    finally:
        if process.is_alive():
            process.terminate()
        process.join(2)
        parent.close()
    if kind == "error":
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=value)
    return value


def _run_estimate(payload):
    """Estimate in a short-lived child process, so a slow parse can neither block the API nor
    outlive the timeout. With a prefilter the child first sends the cheap upper bound and, when
    that is worth refining (EXACT_PREFILTER_MIN_SECONDS), the exact estimate; if the exact one
    is not there within EXACT_ESTIMATE_TIMEOUT_SECONDS the bound is returned (`exact: false`,
    `exact_reason: "timeout"`)."""
    with _child_slot():
        return _run_estimate_in_slot(payload)


def _run_estimate_in_slot(payload):
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
            "queue": manager.queue_info(),
            "files": len(data.files),
            "allowed": False,
            "reason": "too_many_files",
        }
    estimate = _cached_estimate(_payload(data))
    too_slow = estimate["estimated_seconds"] > MAX_ESTIMATED_SECONDS
    return {
        **estimate,
        **base,
        "queue": manager.queue_info(),
        "allowed": not too_slow,
        "reason": "too_slow" if too_slow else None,
    }


@app.post("/api/estimate")
def estimate_time(data: AnalysisRequest, request: Request):
    _require_two_files(data)
    _check_sizes(data)
    _rate_limit(request)
    return _estimate_response(data)


def _reject(error: Rejected):
    extra = {}
    if error.job is not None:  # client_busy: tell which job so the UI can cancel it
        extra = {k: v for k, v in manager.snapshot(error.job).items() if k != "result"}
    return ApiError(
        status.HTTP_429_TOO_MANY_REQUESTS, error.code, error.message, error.retry_after, **extra
    )


@app.post("/api/jobs", status_code=status.HTTP_202_ACCEPTED)
def start_job(data: AnalysisRequest, request: Request):
    _require_two_files(data)
    _check_sizes(data)
    _rate_limit(request)
    client = _client(request)
    manager.tick()
    existing = manager.client_jobs.get(client)
    if existing is not None:  # cheap check before paying for an estimate
        raise _reject(
            Rejected("client_busy", "You already have an analysis running or waiting.", job=existing)
        )
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
        job = manager.start(client, _payload(data), estimate)
    except Rejected as rejected:
        raise _reject(rejected)
    snapshot = manager.snapshot(job)
    return {
        "job_id": job.id,
        "state": snapshot["state"],
        "queue_position": snapshot["queue_position"],
        "queue_wait_seconds": snapshot["queue_wait_seconds"],
        "estimate": estimate,
    }


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
