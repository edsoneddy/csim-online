import Box from '@mui/material/Box';
import { useDispatch } from 'react-redux';
import { openHistoryMenu } from '../../hooks/redux/menuActions';

const HistoryDrawer = () => {
  const dispatch = useDispatch();
  return (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={() => {
        dispatch(openHistoryMenu());
      }}
    ></Box>
  );
};

export default HistoryDrawer;
