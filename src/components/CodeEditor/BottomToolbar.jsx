import { Stack, Button, useMediaQuery, useTheme, Box } from '@mui/material';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DownloadIcon from '@mui/icons-material/Download';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';

const BottomToolbar = ({ onAnalyze, onClear, canAnalyze = true, isAnalyzing = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack
      spacing={1}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          size={isMobile ? 'small' : 'medium'}
          startIcon={<CompareArrowsIcon />}
          onClick={onAnalyze}
          disabled={!canAnalyze || isAnalyzing}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            backgroundColor: '#1976d2',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
            '&:disabled': {
              backgroundColor: '#666',
              color: '#999',
            },
          }}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze'}
        </Button>
        <Button
          variant="outlined"
          size={isMobile ? 'small' : 'medium'}
          startIcon={<DeleteSweepIcon />}
          onClick={onClear}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#999',
            color: '#999',
            '&:hover': {
              backgroundColor: 'rgba(155, 155, 155, 0.08)',
              borderColor: '#bbb',
            },
          }}
        >
          Clear All
        </Button>
      </Box>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Button
          variant="outlined"
          size={isMobile ? 'small' : 'medium'}
          startIcon={<DownloadIcon />}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#666',
            color: '#999',
            '&:hover': {
              backgroundColor: 'rgba(102, 102, 102, 0.08)',
              borderColor: '#888',
            },
          }}
        >
          Export
        </Button>
      </Box>
    </Stack>
  );
};

export default BottomToolbar;
