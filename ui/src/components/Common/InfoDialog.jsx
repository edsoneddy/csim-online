import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateInfoDialog } from '../../hooks/redux/appActions';
import { blurActiveElement } from '../../utils/editor';

const InfoDialog = ({ open, errorMessage, header }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const handleClose = () => {
    blurActiveElement();
    dispatch(updateInfoDialog(false, '', ''));
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="error-dialog-title"
      aria-describedby="error-dialog-description"
    >
      <DialogTitle>{header || t('infoDialog.defaultTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{errorMessage}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {t('infoDialog.close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialog;
