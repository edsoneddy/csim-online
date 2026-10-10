import { Box, Button, CircularProgress, LinearProgress, Stack, Typography } from '@mui/material';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TooltipIconButton from '../../Common/TooltipIconButton';
import { formatDuration } from '../../../utils/time';

// In-progress state of the results box (shown inside AnalysisResultsState while a job runs):
// spinner, phase, progress bar with done/total, remaining time and a cancel button.
const ANIMATION_MS = 250;

// Progress shown between two polls (which can be 10 s apart): advance the last reported `done`
// at the rate implied by the last ETA and count the ETA down. It never goes backwards within a
// phase and never reaches `total` before the job reports it is done.
const useSmoothProgress = (job) => {
  const [now, setNow] = useState(Date.now());
  const shown = useRef({ phase: null, done: 0 });
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), ANIMATION_MS);
    return () => clearInterval(timer);
  }, []);

  const elapsed = Math.max(0, (now - (job.receivedAt ?? now)) / 1000);
  const eta = job.etaSeconds != null ? Math.max(0, job.etaSeconds - elapsed) : null;
  const rate =
    job.etaSeconds > 0 && job.total > job.done ? (job.total - job.done) / job.etaSeconds : 0;
  let done = Math.min(job.done + rate * elapsed, Math.max(job.total - 1, 0));
  done = Math.max(Math.floor(done), job.done);
  if (shown.current.phase !== job.phase) shown.current = { phase: job.phase, done: 0 };
  done = Math.max(done, shown.current.done);
  shown.current.done = done;
  return { done, eta };
};

const AnalysisProgress = ({ job, onCancel }) => {
  const { t } = useTranslation();
  const { done, eta } = useSmoothProgress(job);
  const hasTotal = job.total > 0;
  const percent = hasTotal ? Math.min(99, Math.floor((done / job.total) * 100)) : 0;
  const phaseLabel = job.phase
    ? t(`bulkEditor.progress.phase.${job.phase}`)
    : t('bulkEditor.progress.starting');

  return (
    <Stack
      alignItems="center"
      spacing={2}
      role="status"
      aria-live="polite"
      sx={{ width: '100%', maxWidth: 360, px: { xs: 1.5, sm: 2 }, boxSizing: 'border-box' }}
    >
      <CircularProgress aria-label={phaseLabel} />
      <Typography
        variant="h6"
        sx={{ color: 'text.primary', textAlign: 'center', overflowWrap: 'anywhere' }}
      >
        {phaseLabel}
      </Typography>
      <Box sx={{ width: '100%' }}>
        <LinearProgress
          variant={hasTotal ? 'determinate' : 'indeterminate'}
          value={percent}
          aria-label={phaseLabel}
        />
        <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            {hasTotal ? `${done}/${job.total}` : ''}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {hasTotal ? `${percent}%` : ''}
          </Typography>
        </Stack>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        {eta != null
          ? t('bulkEditor.progress.remaining', { time: formatDuration(eta, t) })
          : t('bulkEditor.progress.calculating')}
      </Typography>
      <TooltipIconButton props={{ title: t('bulkEditor.progress.cancelHint') }} asChild>
        <Button
          variant="outlined"
          color="error"
          startIcon={<StopCircleIcon />}
          onClick={onCancel}
          aria-label={t('bulkEditor.progress.cancel')}
          sx={{ textTransform: 'none', fontWeight: 600 }}
        >
          {t('bulkEditor.progress.cancel')}
        </Button>
      </TooltipIconButton>
    </Stack>
  );
};

export default AnalysisProgress;
