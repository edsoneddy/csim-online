"""One-at-a-time background group jobs, each in its own process, with progress and cancel."""
import multiprocessing
import threading
import time
import uuid

CONTEXT = multiprocessing.get_context("spawn")  # safe next to threads; the child imports csimx once
TICK_SECONDS = 0.25


class Busy(Exception):
    def __init__(self, job):
        super().__init__("another analysis is running")
        self.job = job


class Job:
    def __init__(self, estimate):
        self.id = uuid.uuid4().hex
        self.state = "running"
        self.phase = None
        self.done = 0
        self.total = 0
        self.started = time.monotonic()
        self.phase_started = self.started
        self.finished = None
        self.heartbeat = self.started
        self.estimate = estimate
        self.result = None
        self.error = None
        self.process = None
        self.conn = None


class JobManager:
    def __init__(self, worker, heartbeat_seconds=30.0, keep_seconds=600.0):
        self.worker = worker
        self.heartbeat_seconds = heartbeat_seconds
        self.keep_seconds = keep_seconds
        self.jobs = {}
        self.active = None
        self.lock = threading.RLock()
        self.stop_event = threading.Event()
        self.thread = None

    # -- public API ---------------------------------------------------------------------------
    def start(self, payload, estimate):
        """Start a job or raise Busy(running_job)."""
        with self.lock:
            self.tick()
            if self.active is not None:
                raise Busy(self.active)
            job = Job(estimate)
            parent, child = CONTEXT.Pipe(duplex=False)
            job.conn = parent
            job.process = CONTEXT.Process(target=self.worker, args=(child, payload), daemon=True)
            job.process.start()
            child.close()  # the parent only reads
            self.jobs[job.id] = job
            self.active = job
            self._ensure_thread()
            return job

    def get(self, job_id):
        """The job, counting as a heartbeat; None if unknown or already dropped."""
        with self.lock:
            self.tick()
            job = self.jobs.get(job_id)
            if job is not None and job.state == "running":
                job.heartbeat = time.monotonic()
            return job

    def cancel(self, job_id):
        """Terminate a running job (idempotent). Returns the job or None if unknown."""
        with self.lock:
            self.tick()
            job = self.jobs.get(job_id)
            if job is not None and job.state == "running":
                self._terminate(job)
                self._finish(job, "cancelled")
            return job

    def shutdown(self):
        self.stop_event.set()
        with self.lock:
            if self.active is not None:
                self._terminate(self.active)
                self._finish(self.active, "cancelled")

    def snapshot(self, job):
        now = job.finished if job.finished is not None else time.monotonic()
        elapsed = now - job.started
        eta = None
        if job.state == "running":
            if job.phase == "structural" and job.done > 0:
                eta = (now - job.phase_started) * (job.total - job.done) / job.done
            elif job.estimate:
                eta = max(0.0, job.estimate.get("estimated_seconds", 0.0) - elapsed)
        elif job.state == "done":
            eta = 0.0
        return {
            "job_id": job.id,
            "state": job.state,
            "phase": job.phase,
            "done": job.done,
            "total": job.total,
            "elapsed_seconds": round(elapsed, 2),
            "eta_seconds": None if eta is None else round(eta, 2),
            "estimate": job.estimate,
            "result": job.result if job.state == "done" else None,
            "error": job.error,
        }

    # -- internals ----------------------------------------------------------------------------
    def tick(self):
        """Read the child's messages and apply the heartbeat, crash and retention rules."""
        with self.lock:
            job = self.active
            if job is not None:
                self._drain(job)
                if job.state == "running":
                    if not job.process.is_alive():
                        self._drain(job)
                        if job.state == "running":
                            job.error = f"worker exited unexpectedly (code {job.process.exitcode})"
                            self._finish(job, "error")
                    elif time.monotonic() - job.heartbeat > self.heartbeat_seconds:
                        self._terminate(job)
                        job.error = "no heartbeat from the client"
                        self._finish(job, "cancelled")
            now = time.monotonic()
            for job_id in [
                key
                for key, j in self.jobs.items()
                if j.finished is not None and now - j.finished > self.keep_seconds
            ]:
                del self.jobs[job_id]

    def _drain(self, job):
        try:
            while job.state == "running" and job.conn.poll():
                message = job.conn.recv()
                if message[0] == "progress":
                    _, phase, done, total = message
                    if phase != job.phase:
                        job.phase, job.phase_started = phase, time.monotonic()
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
        job.finished = time.monotonic()
        if job.process is not None:
            job.process.join(2)
        try:
            job.conn.close()
        except OSError:
            pass
        if self.active is job:
            self.active = None

    def _ensure_thread(self):
        if self.thread is None or not self.thread.is_alive():
            self.stop_event.clear()
            self.thread = threading.Thread(target=self._loop, daemon=True)
            self.thread.start()

    def _loop(self):
        while not self.stop_event.wait(TICK_SECONDS):
            self.tick()
