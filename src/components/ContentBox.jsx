import React from 'react';
import { Box, Typography } from '@mui/material';
import { DrawerHeader } from '../utils/menu';
import { useSelector } from 'react-redux';
import { CODE_SECTION, CONTACT_US_SECTION, HELP_CENTER_SECTION } from '../constants/menu';
import CodeSection from './CodeSection';

const ContentBox = () => {
  const actualContent = useSelector((state) => state.menu.actualContent);

  const getRenderContentBox = () => {
    switch (actualContent) {
      case CODE_SECTION:
        return <CodeSection />;
      case HELP_CENTER_SECTION:
        return (
          <Typography variant="body1" sx={{ p: 2 }}>
            {actualContent}
          </Typography>
        );
      case CONTACT_US_SECTION:
        return (
          <Typography variant="body1" sx={{ p: 2 }}>
            {actualContent}
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <DrawerHeader />
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: { xs: 1.5, sm: 2, md: 3 },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {getRenderContentBox()}
      </Box>
    </Box>
  );
};

export default ContentBox;
