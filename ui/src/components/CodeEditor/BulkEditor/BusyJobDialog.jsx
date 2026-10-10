import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

// Shown when the server says this client already has an analysis running or queued (it may come
// from another tab): the user can cancel it to start a new one.
const BusyJobDialog = ({ busyJob, onCancelJob, onClose }) => {
  const { t } = useTranslation();
  return (
    <Dialog
      open={Boolean(busyJob)}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="busy-job-dialog-title"
    >
      <DialogTitle id="busy-job-dialog-title">{t('busyJobDialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('busyJobDialog.text')}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ flexWrap: 'wrap', gap: 1, px: { xs: 2, sm: 3 }, pb: 2 }}>
        <Button onClick={onClose} color="primary">
          {t('infoDialog.close')}
        </Button>
        <Button onClick={onCancelJob} color="error" variant="contained">
          {t('busyJobDialog.cancelJob')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BusyJobDialog;
