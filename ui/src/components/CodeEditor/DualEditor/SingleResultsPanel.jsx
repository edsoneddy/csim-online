import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import { colorPalette } from '../../../styles/colorPalette';
import { getSimilarityIcon, getSimilarityColor, getSimilarityLabel } from '../../../utils/results';
import { useSelector } from 'react-redux';
import TooltipIconButton from '../../Common/TooltipIconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDiffViewerDialog from '../FileDiffViewerDialog';
import { useState } from 'react';

const SingleResultsPanel = ({ isAnalyzing = false, files = [] }) => {
  const [isDiffViewerOpen, setIsDiffViewerOpen] = useState(false);
  const results = useSelector((state) => state.fileManager.dualEditorFiles.results);

  const handleOpenDiffViewer = () => {
    setIsDiffViewerOpen(true);
  };

  if (!results && !isAnalyzing) {
    return (
      <Paper
        sx={{
          p: 3,
          textAlign: 'center',
          backgroundColor: colorPalette.alpha.light,
          border: `1px dashed ${colorPalette.darkMode.border}`,
          minWidth: 'fit-content',
        }}
      >
        <Typography variant="body2" sx={{ color: colorPalette.darkMode.textSecondary }}>
          Load two files and click "Analyze" to see results
        </Typography>
      </Paper>
    );
  }

  if (isAnalyzing) {
    return (
      <Paper
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2,
          backgroundColor: colorPalette.alpha.light,
          minWidth: 'fit-content',
          height: { xs: '190px', md: '110px' },
          boxSizing: 'border-box',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
          <CircularProgress size={32} sx={{ color: colorPalette.primary.main }} />
          <Typography
            variant="body2"
            sx={{ color: colorPalette.darkMode.textSecondary, fontWeight: 500 }}
          >
            Loading results...
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        backgroundColor: colorPalette.alpha.light,
        minWidth: 'fit-content',
        height: { xs: '190px', md: '110px' },
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ width: { xs: '100%', md: '50%' } }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          {getSimilarityIcon(results.similarity)}
          <Box sx={{ flex: 1 }}>
            <Typography variant="body2" sx={{ color: colorPalette.darkMode.textSecondary }}>
              Overall Similarity
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {results.similarity !== null ? `${results.similarity.toFixed(1)}%` : 'N/A'}
            </Typography>
          </Box>
          <TooltipIconButton props={{ title: 'View Differences', onClick: handleOpenDiffViewer }}>
            <VisibilityIcon />
          </TooltipIconButton>
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
          value={results.similarity ?? 0}
          sx={{
            backgroundColor: colorPalette.alpha.light,
            '& .MuiLinearProgress-bar': {
              backgroundColor: getSimilarityColor(results.similarity),
            },
          }}
        />
      </Box>

      <Box sx={{ width: { xs: '100%', md: '50%' } }}>
        <Typography variant="body2" sx={{ color: colorPalette.darkMode.textSecondary }}>
          Details
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: colorPalette.darkMode.textPrimary }}>
          {results.details}
        </Typography>
      </Box>
      <FileDiffViewerDialog
        open={isDiffViewerOpen}
        onClose={() => setIsDiffViewerOpen(false)}
        files={files}
      />
    </Paper>
  );
};

export default SingleResultsPanel;
