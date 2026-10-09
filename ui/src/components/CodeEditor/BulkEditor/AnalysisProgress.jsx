import { Box, Button, CircularProgress, LinearProgress, Stack, Typography } from '@mui/material';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { useTranslation } from 'react-i18next';
import TooltipIconButton from '../../Common/TooltipIconButton';
import { formatDuration } from '../../../utils/time';

// In-progress state of the results box (shown inside AnalysisResultsState while a job runs):
// spinner, phase, progress bar with done/total, remaining time and a cancel button.
const AnalysisProgress = ({ job, onCancel }) => {
  const { t } = useTranslation();
  const hasTotal = job.total > 0;
  const percent = hasTotal ? Math.min(100, Math.round((job.done / job.total) * 100)) : 0;
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
            {hasTotal ? `${job.done}/${job.total}` : ''}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {hasTotal ? `${percent}%` : ''}
          </Typography>
        </Stack>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
        {job.etaSeconds != null
          ? t('bulkEditor.progress.remaining', { time: formatDuration(job.etaSeconds, t) })
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
