import { JOB_POLL_DIVISOR, JOB_POLL_MAX_MS, JOB_POLL_MIN_MS } from '../constants/ui';

/**
 * Milliseconds between two polls of a running job: clamp(estimate / 30 s, 2 s, 10 s), and 2 s
 * when there is no estimate. Light polling matters: the API shares a tiny CPU with the job.
 */
export const getPollIntervalMs = (estimatedSeconds) => {
  if (!Number.isFinite(estimatedSeconds) || estimatedSeconds <= 0) return JOB_POLL_MIN_MS;
  const ms = (estimatedSeconds / JOB_POLL_DIVISOR) * 1000;
  return Math.min(JOB_POLL_MAX_MS, Math.max(JOB_POLL_MIN_MS, ms));
};
