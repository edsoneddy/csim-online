import { Stack, Button, useMediaQuery, useTheme } from '@mui/material';
import React from 'react';

const BottomToolbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack
      spacing={1}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{
        width: '100%',
      }}
    >
      <Button
        variant="contained"
        size={isMobile ? 'small' : 'medium'}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          backgroundColor: '#1976d2',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#1565c0',
          },
        }}
      >
        Analyze
      </Button>
      <Button
        variant="outlined"
        size={isMobile ? 'small' : 'medium'}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          borderColor: '#1976d2',
          color: '#1976d2',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            borderColor: '#1565c0',
          },
        }}
      >
        Clean Up
      </Button>
    </Stack>
  );
};

export default BottomToolbar;
