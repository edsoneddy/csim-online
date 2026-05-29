import React from 'react';
import { Card, CardContent, Grid, Typography, Box } from '@mui/material';

const QuickLinksGrid = ({ title, links }) => {
  return (
    <Box sx={{ mb: 6 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
        {title}
      </Typography>
      <Grid container spacing={2}>
        {links.map((link, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
              onClick={link.onClick}
            >
              <Box sx={{ color: 'primary.main', mb: 1 }}>{link.icon}</Box>
              <CardContent sx={{ textAlign: 'center', p: 0 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                  {link.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {link.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default QuickLinksGrid;
