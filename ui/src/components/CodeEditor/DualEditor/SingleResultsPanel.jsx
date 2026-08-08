import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  Stack,
  Chip,
  CircularProgress,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { getSimilarityIcon, getSimilarityColor, getSimilarityLabel } from '../../../utils/results';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import TooltipIconButton from '../../Common/TooltipIconButton';
import DifferenceIcon from '@mui/icons-material/Difference';
import FileDiffViewerDialog from '../FileDiffViewerDialog';
import { useState } from 'react';
import { blurActiveElement } from '../../../utils/editor';

const SingleResultsPanel = ({ isAnalyzing = false, files = [] }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [isDiffViewerOpen, setIsDiffViewerOpen] = useState(false);
  const results = useSelector((state) => state.fileManager.dualEditorFiles.results);

  const handleOpenDiffViewer = () => {
    blurActiveElement();
    setIsDiffViewerOpen(true);
  };

  const basePaperStyles = {
    p: 2,
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    width: '100%',
    minWidth: 'fit-content',
    minHeight: '90px',
    height: 'auto',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  };

  if (!results && !isAnalyzing) {
    return (
      <Paper
        sx={{
          ...basePaperStyles,
          border: '1px dashed',
          borderColor: 'divider',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          {t('dualResults.empty')}
        </Typography>
      </Paper>
    );
  }

  if (isAnalyzing) {
    return (
      <Paper
        sx={{
          ...basePaperStyles,
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
          <CircularProgress size={28} sx={{ color: 'primary.main' }} />
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            {t('dualResults.loading')}
          </Typography>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        ...basePaperStyles,
        gap: 3,
        justifyContent: 'space-between',
      }}
    >
      <Box sx={{ width: { xs: '100%', md: '50%' }, flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
          {getSimilarityIcon(results.similarity)}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}
            >
              {t('dualResults.overallSimilarity')}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, mt: 0.5 }}>
              {results.similarity !== null
                ? `${results.similarity.toFixed(1)}%`
                : t('dualResults.notAvailable')}
            </Typography>
          </Box>
          <TooltipIconButton
            props={{ title: t('dualResults.viewDifferences'), onClick: handleOpenDiffViewer }}
          >
            <DifferenceIcon fontSize="small" />
          </TooltipIconButton>
          <Chip
            size="small"
            label={getSimilarityLabel(results.similarity)}
            sx={{
              backgroundColor: getSimilarityColor(results.similarity),
              color: theme.palette.common.white,
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
        </Stack>
        <LinearProgress
          variant="determinate"
          value={results.similarity ?? 0}
          sx={{
            height: 6,
            borderRadius: 1,
            backgroundColor: alpha(theme.palette.text.primary, 0.08),
            '& .MuiLinearProgress-bar': {
              backgroundColor: getSimilarityColor(results.similarity),
              borderRadius: 1,
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          width: '50%',
          flex: 1,
          borderLeft: '1px solid',
          borderColor: 'divider',
          pl: 3,
        }}
      >
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
          {t('dualResults.details')}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            fontWeight: 500,
            wordBreak: 'break-word',
          }}
        >
          {results.details}
        </Typography>
      </Box>

      <FileDiffViewerDialog
        open={isDiffViewerOpen}
        onClose={() => {
          blurActiveElement();
          setIsDiffViewerOpen(false);
        }}
        files={files}
      />
    </Paper>
  );
};

export default SingleResultsPanel;
