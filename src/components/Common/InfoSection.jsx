import React from 'react';
import { Paper, Typography, Box } from '@mui/material';

const InfoSection = ({ children }) => {
  return <Paper sx={{ p: 2.5, bgcolor: 'action.hover' }}>{children}</Paper>;
};

export default InfoSection;
