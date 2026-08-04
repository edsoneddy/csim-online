import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { updateInfoDialog } from '../../hooks/redux/appActions';
import { blurActiveElement } from '../../utils/editor';

const InfoDialog = ({ open, errorMessage, header }) => {
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
      <DialogTitle>{header || 'Information'}</DialogTitle>
      <DialogContent>
        <DialogContentText>{errorMessage}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialog;
