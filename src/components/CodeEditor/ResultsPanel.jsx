import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Stack,
  Chip,
  Divider,
  Button,
  Grid,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import { useState } from 'react';
import MatchNavigation from './MatchNavigation';
import { ResultsLoadingSkeleton } from './LoadingSkeletons';
import { colorPalette } from '../../styles/colorPalette';

const ResultsPanel = ({ results = null, isAnalyzing = false }) => {
  const [currentMatch, setCurrentMatch] = useState(0);

  if (!results && !isAnalyzing) {
    return (
      <Paper
        sx={{
          p: 3,
          textAlign: 'center',
          backgroundColor: colorPalette.alpha.light,
          border: `1px dashed ${colorPalette.darkMode.border}`,
        }}
      >
        <Typography variant="body2" sx={{ color: colorPalette.darkMode.textSecondary }}>
          Load two files and click "Analyze" to see results
        </Typography>
      </Paper>
    );
  }

  if (isAnalyzing) {
    return <ResultsLoadingSkeleton />;
  }

  const getSimilarityColor = (similarity) => {
    if (similarity >= 75) return colorPalette.status.error; // Red - Critical
    if (similarity >= 50) return colorPalette.status.alert; // Orange - High
    if (similarity >= 25) return colorPalette.status.warning; // Amber - Medium
    return colorPalette.status.success; // Green - Low
  };

  const getSimilarityIcon = (similarity) => {
    if (similarity >= 75) return <ErrorIcon sx={{ color: colorPalette.status.error }} />;
    if (similarity >= 50) return <WarningIcon sx={{ color: colorPalette.status.alert }} />;
    return <CheckCircleIcon sx={{ color: colorPalette.status.success }} />;
  };

  const getSimilarityLabel = (similarity) => {
    if (similarity >= 75) return 'Critical Match';
    if (similarity >= 50) return 'High Match';
    if (similarity >= 25) return 'Medium Match';
    return 'Low Match';
  };

  return (
    <Paper sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Main Similarity Score */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          {getSimilarityIcon(results.similarity)}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ color: colorPalette.darkMode.textSecondary }}>
              Overall Similarity
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {results.similarity.toFixed(1)}%
            </Typography>
          </Box>
          <Chip
            label={getSimilarityLabel(results.similarity)}
            sx={{
              backgroundColor: getSimilarityColor(results.similarity),
              color: colorPalette.neutral.white,
              fontWeight: 600,
            }}
          />
        </Stack>
        <LinearProgress
          variant="determinate"
          value={results.similarity}
          sx={{
            backgroundColor: colorPalette.alpha.light,
            '& .MuiLinearProgress-bar': {
              backgroundColor: getSimilarityColor(results.similarity),
            },
          }}
        />
      </Box>

      <Divider />

      {/* Statistics Grid */}
      <Grid container spacing={2}>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: colorPalette.darkMode.textSecondary }}>
              Matching Lines
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: colorPalette.status.warning }}>
              {results.matchingLines || 0}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: colorPalette.darkMode.textSecondary }}>
              Total Lines
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: colorPalette.primary.main }}>
              {results.totalLines || 0}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: colorPalette.darkMode.textSecondary }}>
              Unique Blocks
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: colorPalette.status.success }}>
              {results.uniqueBlocks || 0}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: colorPalette.darkMode.textSecondary }}>
              Matched Blocks
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: colorPalette.status.error }}>
              {results.matchedBlocks || 0}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider />

      {/* Details */}
      {results.details && (
        <Box>
          <Typography
            variant="caption"
            sx={{ color: colorPalette.darkMode.textSecondary, fontWeight: 600 }}
          >
            Details
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: colorPalette.darkMode.textPrimary }}>
            {results.details}
          </Typography>
        </Box>
      )}

      {/* Action Buttons */}
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
          Download Report
        </Button>
        <Button variant="outlined" size="small" sx={{ textTransform: 'none' }}>
          Copy Results
        </Button>
      </Stack>

      <Divider />

      {/* Match Navigation */}
      <MatchNavigation
        currentMatch={currentMatch}
        totalMatches={results.matchedBlocks || 0}
        onPrevious={() => {
          if (currentMatch > 0) {
            setCurrentMatch(currentMatch - 1);
          }
        }}
        onNext={() => {
          if (currentMatch < (results.matchedBlocks || 0) - 1) {
            setCurrentMatch(currentMatch + 1);
          }
        }}
      />
    </Paper>
  );
};

export default ResultsPanel;
