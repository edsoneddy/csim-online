import { CircularProgress, Paper, Stack, Typography } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import SearchIcon from '@mui/icons-material/Search';
import { RESULTS_STATUS } from '../../../../utils/results';

const AnalysisResultsState = ({ status = RESULTS_STATUS.ERROR, isAnalyzing = false }) => {
  if (isAnalyzing) {
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
          <CircularProgress aria-label="Loading" />

          <Typography variant="h6" sx={{ color: 'text.primary' }}>
            Analyzing...
          </Typography>
        </Stack>
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
          {status === RESULTS_STATUS.EMPTY ? 'No Results' : 'Analysis Failed'}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {status === RESULTS_STATUS.EMPTY
            ? 'Select files and click "Analyze" to see results'
            : 'Error processing files.'}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default AnalysisResultsState;
