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
        }}
      >
        Clean Up
      </Button>
    </Stack>
  );
};

export default BottomToolbar;
