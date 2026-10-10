# CSIM Online

A modern web interface for [csimx](https://pypi.org/project/csimx/) (successor of csim) - a code similarity detection and plagiarism analysis tool. Compare two files side-by-side or analyze multiple files in bulk to identify similar code patterns.

![CSIM Online](https://img.shields.io/badge/csimx-0.2.0-blue)
![Python](https://img.shields.io/badge/Python-3.13+-green)
![React](https://img.shields.io/badge/React-19+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Dual Editor Mode**: Compare two files side-by-side with syntax highlighting and similarity scoring
- **Bulk Analysis**: Analyze multiple files at once with configurable similarity thresholds
- **Multi-Language Support**: Python 3, Python 3.13, Java 24, C++ 14, Kotlin, C
- **Theme Support**: Light, dark, and system-preference themes
- **Internationalization**: English and Spanish locales
- **Diff Viewer**: Visual side-by-side comparison of matching code
- **File Viewer**: Preview and navigate through uploaded files
- **Session History**: Track and review previous analyses
- **Version Display**: The UI shows the csimx version reported live by the API, plus its own release version

## Tech Stack

### Backend
- **Framework**: FastAPI 0.111.0
- **Server**: Uvicorn 0.23.2
- **Validation**: Pydantic 2.7.1
- **Analysis**: csimx 0.2.0

### Frontend
- **Framework**: React 19
- **Build**: Vite
- **UI Library**: Material-UI 5
- **Editor**: Monaco Editor
- **Styling**: Emotion (CSS-in-JS)
- **State**: Redux (vanilla)
- **i18n**: react-i18next

## Quick Start

### Prerequisites
- Python 3.13+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd api
pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

API endpoints:
- `GET /` - Health check
- `GET /api/version` - Returns the installed csimx version (`{"csimx_version": "0.2.0"}`), read live via `importlib.metadata`. The UI fetches this on load and shows it next to the app title — bump `csimx` in `api/requirements.txt` and it propagates automatically.
- `POST /api/analyze` - Compare two files
- `POST /api/analyze-all` - Analyze multiple files with threshold

### Time estimate and background jobs

`POST /api/analyze-all` is gone (410: an old page is asked to reload). The Bulk Editor uses:

- `POST /api/estimate` (same body): fast estimate from the real size of the pruned trees (`estimate_group`, upper bound when the prefilter is on), computed in a short-lived child process. Returns the csimx estimate (`estimated_seconds`, `range_seconds`, `pairs`, `structural_pairs`, ...) plus `allowed`, `reason` (`too_slow` / `too_many_files`), `max_seconds` and `max_files`.
- `POST /api/jobs` (same body): recomputes the estimate server side, refuses (413 too many files, 422 too slow) when not allowed, and runs the grouping in its own process. One job at a time: a second request gets 429 with the running job's progress. Returns `{"job_id"}`.
- `GET /api/jobs/{id}`: `state` (`queued`/`running`/`done`/`cancelled`/`error`/`timeout`), `phase` (`parse`/`lexical`/`structural`), `done`, `total`, `elapsed_seconds`, `eta_seconds`, `estimate`, and `result` (the analyze-all payload) when done. `GET` is light (the `estimate` comes with `POST /api/jobs`, or `?full=1`; `Cache-Control: no-store`) and every GET is a heartbeat, polled by the UI every clamp(estimate / 30 s, 2 s, 10 s): a running job with no GET for `HEARTBEAT_SECONDS` is cancelled.
- `DELETE /api/jobs/{id}`: terminates the job process (idempotent). `POST /api/jobs/{id}/cancel` does the same (204 even if the job is finished or unknown; no body, no custom headers, so `navigator.sendBeacon` can call it cross-origin without a preflight): the UI sends it on `pagehide` and when the Bulk Editor is left, so a refresh or a closed tab stops the job at once instead of waiting for the heartbeat. csimx cannot be interrupted, so cancelling kills the process.

With the prefilter on, the estimate is first the cheap upper bound (every pair compared); when that reaches `EXACT_PREFILTER_MIN_SECONDS` (10) the child process also runs the lexical pass for an exact estimate (`exact: true`, with `upper_bound_seconds` for comparison). If that does not finish within `EXACT_ESTIMATE_TIMEOUT_SECONDS` (20) the bound is returned (`exact: false`, `exact_reason: "timeout"`). `POST /api/jobs` decides `allowed` with the same estimate (the exact one when available, the bound otherwise); estimates are memoized for 2 minutes server side so jobs right after an estimate do not repeat the lexical pass.

### Limits and fair use (environment variables)

One analysis runs at a time (each in its own process); others wait in a FIFO queue. Everything below is overridable from the environment; the defaults are meant for Render's free tier.

| Variable | Default | What it does |
|---|---|---|
| `MAX_FILES` | 100 | Files per analysis (the UI reads it from `/api/version`). |
| `MAX_FILE_BYTES` | 200000 | Bytes (utf-8) per file; 413 `file_too_large` naming the file. |
| `MAX_TOTAL_BYTES` | 3000000 | Bytes in all the files of a request; 413 `total_too_large`. |
| `MAX_BODY_BYTES` | 2 x total + 64 KB | Request body cap, checked from `Content-Length` before parsing (413 `body_too_large`; chunked bodies get 411). |
| `MAX_ESTIMATED_SECONDS` | 600 | An analysis whose estimate is longer is refused (422 `too_slow`). |
| `MAX_JOB_SECONDS` | 900 | Cap of a job's wall-clock deadline: `max(60, min(MAX_JOB_SECONDS, 2 x range_high of its estimate))`. When it expires the process is killed and the state is `timeout`. |
| `MIN_JOB_SECONDS` | 60 | Floor of that deadline (lower it only to test). |
| `MAX_QUEUE` | 5 | Jobs waiting behind the running one; beyond that 429 `queue_full` with `Retry-After`. |
| `CLIENT_BUDGET_SECONDS` | 900 | Compute seconds a client may use per window. Checked when a job is queued (with its estimate) and charged with the real running time of finished, cancelled and timed-out jobs. In memory only: it resets when the API restarts. Old entries are dropped. 429 `budget_exceeded` with `Retry-After`. |
| `CLIENT_BUDGET_WINDOW_SECONDS` | 3600 | Length of the sliding budget window. |
| `HEARTBEAT_SECONDS` | 60 | A running or queued job nobody polls for this long is cancelled. |
| `JOB_KEEP_SECONDS` | 600 | Finished jobs stay readable this long. |
| `ESTIMATE_CONCURRENCY` | 2 | Estimate / pair-comparison child processes at once; extra requests wait `CHILD_SLOT_WAIT_SECONDS` (5) then get 429 `busy` with `Retry-After`. |
| `ESTIMATE_RATE_PER_MINUTE` | 12 | Per client, shared by `POST /api/estimate` and `POST /api/jobs`; 429 `rate_limited` with `Retry-After`. |
| `ESTIMATE_TIMEOUT_SECONDS` | 60 | Estimate child timeout (504). |
| `ANALYZE_TIMEOUT_SECONDS` | 30 | Timeout of `POST /api/analyze` (two files, run in a short-lived child; 504). |
| `EXACT_PREFILTER_MIN_SECONDS` / `EXACT_ESTIMATE_TIMEOUT_SECONDS` | 10 / 20 | When the exact prefilter estimate is attempted and how long it may take. |
| `TRUSTED_PROXY_HOPS` | 1 | How many trailing `X-Forwarded-For` entries were added by proxies we trust (see below). |
| `CLIENT_IP_HEADER` | unset | Optional header (e.g. `CF-Connecting-IP`) to take the client address from instead of `X-Forwarded-For`. |

A job is one per client: while it is queued or running, a second request gets 429 `client_busy` with the existing job (the UI offers to cancel it). `POST /api/jobs` answers 202 with `state` `queued` and `queue_position` / `queue_wait_seconds` (best effort: the remaining time of the running job plus the estimates of the ones ahead); `GET /api/jobs/{id}` returns the same fields while queued. `POST /api/estimate` also returns `queue` (`length`, `running`, `wait_seconds`). `POST /api/analyze-all` is gone: it answers 410 asking to reload the page.

**Client key.** Fairness limits are per client, identified by a short hash of its address (never logged or stored in the clear). Behind a proxy the address comes from `X-Forwarded-For`; proxies append, so the entries on the left can be forged by the client and only the last `TRUSTED_PROXY_HOPS` can be believed: the default of 1 takes the last entry, the one added by the proxy in front of the API. Render's own documentation does not state how many hops sit in front of a service (community threads say it appends to the header instead of resetting it, with Cloudflare in front), so check on a deployed instance that the last entry is the visitor and not a shared edge address (if every visitor looked the same, everybody would share one budget): then change `TRUSTED_PROXY_HOPS` or set `CLIENT_IP_HEADER`. Without the header (local runs) the socket address is used. `GET /api/client` helps with that check: it returns the short hash used for the caller, how many entries `X-Forwarded-For` has and which edge headers (`CF-Connecting-IP`, `True-Client-IP`, ...) arrived, never an address; call it from two different networks and the `key` must differ.

`GET /api/version` also reports `speed_factor` (this machine against the csimx reference, calibrated in the background at start) and the limits.
