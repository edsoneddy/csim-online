import { Box, Button, Stack, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';

const ResultsHeader = ({ threshold }) => {
  return (
    <Box
      sx={{
        p: 1.5,
        px: 2,
        backgroundColor: '#1A1F2E',
        borderBottom: '1px solid #2D3748',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        minHeight: '4em',
      }}
    >
      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
        <DescriptionIcon sx={{ color: '#4da8da' }} />
        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 600, color: '#F0F4F8', lineHeight: 1.2 }}
          >
            Analysis Results
          </Typography>
          <Typography variant="caption" sx={{ color: '#8892B0' }}>
            Overview of code similarity analysis (Threshold: {threshold})
          </Typography>
        </Box>
      </Stack>
      <Button
        variant="outlined"
        size="small"
        disabled
        startIcon={<DownloadIcon />}
        sx={{ textTransform: 'none', borderColor: '#2D3748' }}
      >
        Export Report
      </Button>
    </Box>
  );
};

export default ResultsHeader;
