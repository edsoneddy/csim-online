import { CircularProgress, Paper, Stack, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';
import AnalysisProgress from '../AnalysisProgress';
import { RESULTS_STATUS } from '../../../../utils/results';

const AnalysisResultsState = ({
  status = RESULTS_STATUS.ERROR,
  isAnalyzing = false,
  job = null,
  onCancelJob = () => {},
}) => {
  const { t } = useTranslation();
  if (isAnalyzing) {
    return (
      <Paper
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto',
          py: 2,
          minHeight: { xs: 340, md: 0 }, // room for the progress and its cancel button when stacked
          bgcolor: 'background.default',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        {job ? (
          <AnalysisProgress job={job} onCancel={onCancelJob} />
        ) : (
          <Stack alignItems="center" spacing={2}>
            <CircularProgress aria-label={t('bulkEditor.multiResults.analyzing')} />

            <Typography variant="h6" sx={{ color: 'text.primary' }}>
              {t('bulkEditor.multiResults.analyzing')}
            </Typography>
          </Stack>
        )}
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack alignItems="center" spacing={2}>
        {status === RESULTS_STATUS.EMPTY ? (
          <SearchIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
        ) : (
          <ErrorOutlineIcon sx={{ fontSize: 48, color: 'error.main' }} />
        )}
        <Typography variant="h6" sx={{ color: 'text.primary' }}>
          {status === RESULTS_STATUS.EMPTY
            ? t('bulkEditor.multiResults.noResults')
            : t('bulkEditor.multiResults.analysisFailed')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {status === RESULTS_STATUS.EMPTY
            ? t('bulkEditor.multiResults.selectFilesPrompt')
            : t('bulkEditor.multiResults.errorProcessing')}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default AnalysisResultsState;
