import { Box, Typography } from '@mui/material';

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 2 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
          {subtitle}
        </Typography>
      )}
      {children}
    </Box>
  );
};

export default PageHeader;
