import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { formatDuration } from '../../../utils/time';

// Asks for confirmation with the time estimate before a long bulk analysis, or explains why the
// analysis is not allowed (too many files / too slow).
const EstimateDialog = ({ estimate, hasPrefilter, onContinue, onClose }) => {
  const { t } = useTranslation();
  const open = Boolean(estimate);
  const allowed = estimate?.allowed;
  // analyses ahead of a new one: the queue plus the one running
  const ahead = estimate?.queue ? estimate.queue.length + (estimate.queue.running ? 1 : 0) : 0;

  const renderBody = () => {
    if (!estimate) return null;
    if (!allowed) {
      return (
        <Stack spacing={1}>
          <DialogContentText>
            {estimate.reason === 'too_many_files'
              ? t('estimateDialog.tooManyFiles', { files: estimate.files, max: estimate.max_files })
              : t('estimateDialog.tooSlow', {
                  time: formatDuration(estimate.estimated_seconds, t),
                  max: formatDuration(estimate.max_seconds, t),
                })}
          </DialogContentText>
          <DialogContentText>{t('estimateDialog.hint')}</DialogContentText>
        </Stack>
      );
    }
    return (
      <Stack spacing={1}>
        <DialogContentText>
          {t('estimateDialog.about', {
            time: formatDuration(estimate.estimated_seconds, t),
            low: formatDuration(estimate.range_seconds[0], t),
            high: formatDuration(estimate.range_seconds[1], t),
          })}
        </DialogContentText>
        <Typography variant="body2" color="text.secondary">
          {t('estimateDialog.details', { files: estimate.files, pairs: estimate.structural_pairs })}
        </Typography>
        {ahead > 0 && (
          <Typography variant="body2" color="text.secondary">
            {t('estimateDialog.queueAhead', {
              count: ahead,
              time: formatDuration(estimate.queue.wait_seconds, t),
            })}
          </Typography>
        )}
        {hasPrefilter &&
          estimate.exact &&
          estimate.upper_bound_seconds > estimate.estimated_seconds && (
            <Typography variant="body2" color="text.secondary">
              {t('estimateDialog.withoutPrefilter', {
                time: formatDuration(estimate.upper_bound_seconds, t),
              })}
            </Typography>
          )}
        {hasPrefilter && !estimate.exact && (
          <Typography variant="body2" color="text.secondary">
            {t('estimateDialog.prefilterNote')}
          </Typography>
        )}
      </Stack>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      scroll="paper"
      aria-labelledby="estimate-dialog-title"
    >
      <DialogTitle id="estimate-dialog-title">
        {allowed ? t('estimateDialog.title') : t('estimateDialog.blockedTitle')}
      </DialogTitle>
      <DialogContent sx={{ overflowWrap: 'anywhere' }}>{renderBody()}</DialogContent>
      <DialogActions sx={{ flexWrap: 'wrap', gap: 1, px: { xs: 2, sm: 3 }, pb: 2 }}>
        <Button
          onClick={onClose}
          color={allowed ? 'error' : 'primary'}
          variant={allowed ? 'outlined' : 'text'}
        >
          {allowed ? t('estimateDialog.cancel') : t('infoDialog.close')}
        </Button>
        {allowed && (
          <Button onClick={onContinue} color="primary" variant="contained">
            {t('estimateDialog.continue')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EstimateDialog;
