"""Background group jobs: one runs at a time (each in its own process), the rest wait in a FIFO
queue, with a wall-clock deadline per job and a compute budget per client."""
import collections
import math
import multiprocessing
import threading
import time
import uuid

CONTEXT = multiprocessing.get_context("spawn")  # safe next to threads; the child imports csimx once
TICK_SECONDS = 0.25
FINAL_STATES = ("done", "cancelled", "error", "timeout")


class Rejected(Exception):
    """The job cannot be accepted: `code` is client_busy, queue_full or budget_exceeded."""

    def __init__(self, code, message, retry_after=None, job=None):
        super().__init__(message)
        self.code, self.message, self.retry_after, self.job = code, message, retry_after, job


class Job:
    def __init__(self, client, payload, estimate, now):
        self.id = uuid.uuid4().hex
        self.client = client
        self.payload = payload
        self.estimate = estimate or {}
        self.state = "queued"
        self.phase = None
        self.done = 0
        self.total = 0
        self.created = now
        self.started = None  # when it began to run
        self.phase_started = None
        self.finished = None
        self.heartbeat = now
        self.deadline = 0.0
        self.result = None
        self.error = None
        self.process = None
        self.conn = None

    @property
    def estimated_seconds(self):
        return float(self.estimate.get("estimated_seconds", 0.0))


def job_deadline(estimate, max_job_seconds, min_job_seconds=60.0):
    """Wall-clock limit of a job: max(min_job_seconds (60), min(max_job_seconds, 2 x the high end
    of its range))."""
    high = (estimate.get("range_seconds") or [0, 0])[1]
    return max(float(min_job_seconds), min(float(max_job_seconds), 2.0 * float(high)))


class JobManager:
    def __init__(
        self,
        worker,
        heartbeat_seconds=60.0,
        keep_seconds=600.0,
        max_queue=5,
        max_job_seconds=900.0,
        min_job_seconds=60.0,
        client_budget_seconds=900.0,
        budget_window_seconds=3600.0,
        clock=time.monotonic,
    ):
        self.worker = worker
        self.heartbeat_seconds = heartbeat_seconds
        self.keep_seconds = keep_seconds
        self.max_queue = max_queue
        self.max_job_seconds = max_job_seconds
        self.min_job_seconds = min_job_seconds
        self.client_budget_seconds = client_budget_seconds
        self.budget_window_seconds = budget_window_seconds
        self.clock = clock
        self.jobs = {}
        self.active = None
        self.queue = []
        self.client_jobs = {}  # client -> its queued or running job
        self.usage = collections.OrderedDict()  # client -> deque of (end time, seconds), in memory
        self.lock = threading.RLock()
        self.stop_event = threading.Event()
        self.thread = None

    MAX_CLIENTS = 5000

    # -- public API ---------------------------------------------------------------------------
    def start(self, client, payload, estimate):
        """Queue (or start) a job, or raise Rejected."""
        with self.lock:
            self.tick()
            existing = self.client_jobs.get(client)
            if existing is not None:
                raise Rejected(
                    "client_busy", "You already have an analysis running or waiting.", job=existing
                )
            now = self.clock()
            wait = self._budget_wait(client, float(estimate.get("estimated_seconds", 0.0)), now)
            if wait is not None:
                raise Rejected(
                    "budget_exceeded",
                    "You used your compute budget for this hour.",
                    retry_after=wait,
                )
            if self.active is not None and len(self.queue) >= self.max_queue:
                raise Rejected(
                    "queue_full",
                    "The queue is full.",
                    retry_after=max(1.0, self._remaining(self.active, now)),
                )
            job = Job(client, payload, estimate, now)
            self.jobs[job.id] = job
            self.client_jobs[client] = job
            self.queue.append(job)
            self._promote()
            self._ensure_thread()
            return job

    def get(self, job_id):
        """The job, counting as a heartbeat; None if unknown or already dropped."""
        with self.lock:
            self.tick()
            job = self.jobs.get(job_id)
            if job is not None and job.state not in FINAL_STATES:
                job.heartbeat = self.clock()
            return job

    def cancel(self, job_id):
        """Cancel a queued or running job (idempotent). Returns the job or None if unknown."""
        with self.lock:
            self.tick()
            job = self.jobs.get(job_id)
            if job is not None and job.state == "queued":
                self.queue.remove(job)
                self._finish(job, "cancelled")
            elif job is not None and job.state == "running":
                self._terminate(job)
                self._finish(job, "cancelled")
            return job

    def shutdown(self):
        self.stop_event.set()
        with self.lock:
            for job in list(self.queue):
                self.queue.remove(job)
                self._finish(job, "cancelled")
            if self.active is not None:
                self._terminate(self.active)
                self._finish(self.active, "cancelled")

    def queue_info(self):
        """What a new job would wait: used by /api/estimate."""
        with self.lock:
            now = self.clock()
            wait = self._remaining(self.active, now) if self.active else 0.0
            wait += sum(j.estimated_seconds for j in self.queue)
            return {
                "length": len(self.queue),
                "running": self.active is not None,
                "wait_seconds": round(wait, 1),
            }

    def snapshot(self, job, full=False):
        """Job state for the client; `estimate` (big, constant) only with full=True."""
        with self.lock:
            now = self.clock()
            end = job.finished if job.finished is not None else now
            elapsed = end - job.started if job.started is not None else 0.0
            eta = None
            position = None
            wait = None
            if job.state == "running":
                eta = self._remaining(job, now)
            elif job.state == "done":
                eta = 0.0
            elif job.state == "queued":
                position = self.queue.index(job) + 1
                wait = (self._remaining(self.active, now) if self.active else 0.0) + sum(
                    j.estimated_seconds for j in self.queue[: position - 1]
                )
            snapshot = {
                "job_id": job.id,
                "state": job.state,
                "phase": job.phase,
                "done": job.done,
                "total": job.total,
                "elapsed_seconds": round(elapsed, 2),
                "eta_seconds": None if eta is None else round(eta, 2),
                "queue_position": position,
                "queue_wait_seconds": None if wait is None else round(wait, 1),
                "result": job.result if job.state == "done" else None,
                "error": job.error,
            }
            if full:
                snapshot["estimate"] = job.estimate
            return snapshot

    # -- internals ----------------------------------------------------------------------------
    def _remaining(self, job, now):
        """Best guess of the seconds a running job still needs."""
        elapsed = now - job.started
        if job.phase == "structural" and job.done > 0:
            return (now - job.phase_started) * (job.total - job.done) / job.done
        return max(0.0, job.estimated_seconds - elapsed)

    def tick(self):
        """Read the child's messages and apply deadline, heartbeat, crash and retention rules."""
        with self.lock:
            now = self.clock()
            job = self.active
            if job is not None:
                self._drain(job)
                if job.state == "running":
                    if not job.process.is_alive():
                        self._drain(job)
                        if job.state == "running":
                            job.error = f"worker exited unexpectedly (code {job.process.exitcode})"
                            self._finish(job, "error")
                    elif now - job.started > job.deadline:
                        self._terminate(job)
                        job.error = f"stopped: it exceeded the time limit of {job.deadline:.0f} s"
                        self._finish(job, "timeout")
                    elif now - job.heartbeat > self.heartbeat_seconds:
                        self._terminate(job)
                        job.error = "no heartbeat from the client"
                        self._finish(job, "cancelled")
            for queued in list(self.queue):  # an abandoned queued job leaves the queue
                if now - queued.heartbeat > self.heartbeat_seconds:
                    self.queue.remove(queued)
                    queued.error = "no heartbeat from the client"
                    self._finish(queued, "cancelled")
            for job_id in [
                key
                for key, j in self.jobs.items()
                if j.finished is not None and now - j.finished > self.keep_seconds
            ]:
                del self.jobs[job_id]
            self._prune_usage(now)
            self._promote()

    def _promote(self):
        """Start the next queued job when the slot is free."""
        with self.lock:
            while self.active is None and self.queue:
                job = self.queue.pop(0)
                try:
                    self._launch(job)
                except Exception as error:  # could not even start the process
                    job.error = f"could not start the analysis: {error}"
                    self._finish(job, "error")

    def _launch(self, job):
        now = self.clock()
        parent, child = CONTEXT.Pipe(duplex=False)
        job.conn = parent
        job.process = CONTEXT.Process(target=self.worker, args=(child, job.payload), daemon=True)
        job.process.start()
        child.close()  # the parent only reads
        job.state = "running"
        job.started = job.phase_started = now
        job.heartbeat = now
        job.deadline = job_deadline(job.estimate, self.max_job_seconds, self.min_job_seconds)
        self.active = job

    def _drain(self, job):
        try:
            while job.state == "running" and job.conn.poll():
                message = job.conn.recv()
                if message[0] == "progress":
                    _, phase, done, total = message
                    if phase != job.phase:
                        job.phase, job.phase_started = phase, self.clock()
                    job.done, job.total = done, total
                elif message[0] == "result":
                    job.result = message[1]
                    self._finish(job, "done")
                elif message[0] == "error":
                    job.error = message[1]
                    self._finish(job, "error")
        except (EOFError, OSError):
            pass  # the child closed the pipe; is_alive() decides what happened

    def _terminate(self, job):
        process = job.process
        if process.is_alive():
            process.terminate()
            process.join(2)
            if process.is_alive():
                process.kill()
                process.join(2)

    def _finish(self, job, state):
        job.state = state
        job.finished = self.clock()
        if job.process is not None:
            job.process.join(2)
        if job.conn is not None:
            try:
                job.conn.close()
            except OSError:
                pass
        if self.client_jobs.get(job.client) is job:
            del self.client_jobs[job.client]
        if job.started is not None:  # charge what it really used to the client's budget
            self._charge(job.client, job.finished - job.started, job.finished)
        if self.active is job:
            self.active = None
            self._promote()

    # -- per-client compute budget (in memory: it resets when the API restarts) -------------------
    def _charge(self, client, seconds, now):
        entries = self.usage.pop(client, None) or collections.deque()
        entries.append((now, seconds))
        self.usage[client] = entries
        while len(self.usage) > self.MAX_CLIENTS:
            self.usage.popitem(last=False)

    def _prune_usage(self, now):
        for client in list(self.usage):
            entries = self.usage[client]
            while entries and now - entries[0][0] >= self.budget_window_seconds:
                entries.popleft()
            if not entries:
                del self.usage[client]

    def _budget_wait(self, client, estimated, now):
        """None if `estimated` more seconds fit in the client's budget, else the seconds until
        enough of the used budget leaves the sliding window."""
        entries = self.usage.get(client)
        used = 0.0
        if entries:
            used = sum(s for t, s in entries if now - t < self.budget_window_seconds)
        need = used + estimated - self.client_budget_seconds
        if need <= 0:
            return None
        freed = 0.0
        for t, s in entries or ():
            if now - t >= self.budget_window_seconds:
                continue
            freed += s
            if freed >= need:
                return max(1.0, t + self.budget_window_seconds - now)
        return self.budget_window_seconds  # even an empty budget could not take this job

    def _ensure_thread(self):
        if self.thread is None or not self.thread.is_alive():
            self.stop_event.clear()
            self.thread = threading.Thread(target=self._loop, daemon=True)
            self.thread.start()

    def _loop(self):
        while not self.stop_event.wait(TICK_SECONDS):
            self.tick()
