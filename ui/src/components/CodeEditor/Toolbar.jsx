import { Stack, Button, useMediaQuery, useTheme } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import VerifiedIcon from '@mui/icons-material/Verified';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
const Toolbar = ({ onAnalyze, onClear, canAnalyze = true, isAnalyzing = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Stack
      spacing={1.5}
      direction={{ xs: 'row', md: 'column' }}
      sx={{
        marginBottom: 'auto',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        '& .MuiButton-root': { whiteSpace: 'nowrap' },
      }}
    >
      <Button
        variant="contained"
        size={isMobile ? 'small' : 'medium'}
        endIcon={<VerifiedIcon />}
        onClick={() => {}}
        disabled={!canAnalyze || isAnalyzing}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          width: { xs: 'auto', md: '100%' },
        }}
      >
        {'Verify'}
      </Button>
      <Button
        variant="contained"
        size={isMobile ? 'small' : 'medium'}
        endIcon={<CompareArrowsIcon />}
        onClick={onAnalyze}
        disabled={!canAnalyze || isAnalyzing}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          width: { xs: 'auto', md: '100%' },
        }}
      >
        {'Analyze'}
      </Button>
      <Button
        variant="outlined"
        size={isMobile ? 'small' : 'medium'}
        endIcon={<PlagiarismIcon />}
        onClick={onClear}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          width: { xs: 'auto', md: '100%' },
        }}
      >
        Clear All
      </Button>
    </Stack>
  );
};

export default Toolbar;
