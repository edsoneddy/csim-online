import { Paper } from '@mui/material';

const InfoSection = ({ children }) => {
  return <Paper sx={{ p: 2.5, bgcolor: 'action.hover' }}>{children}</Paper>;
};

export default InfoSection;
