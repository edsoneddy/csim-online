import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

const ContactInfoCard = ({ info }) => {
  return (
    <Card
      sx={{
        transition: 'all 0.3s ease',
        cursor: info.link !== '#' ? 'pointer' : 'default',
        '&:hover': {
          transform: 'translateX(4px)',
          boxShadow: 2,
        },
      }}
      onClick={() => {
        if (info.link !== '#') {
          window.location.href = info.link;
        }
      }}
    >
      <CardContent sx={{ display: 'flex', gap: 2, p: 2 }}>
        <Box
          sx={{
            color: 'primary.main',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          {info.icon}
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
            {info.title}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {info.content}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ContactInfoCard;
