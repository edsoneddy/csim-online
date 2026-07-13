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
          bgcolor: '#0F1419',
          border: '1px solid #2D3748',
        }}
      >
        <Stack alignItems="center" spacing={2}>
          <CircularProgress aria-label="Loading" />

          <Typography variant="h6" color="#F0F4F8">
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
        bgcolor: '#0F1419',
        border: '1px solid #2D3748',
      }}
    >
      <Stack alignItems="center" spacing={2}>
        {status === RESULTS_STATUS.EMPTY ? (
          <SearchIcon sx={{ fontSize: 48, color: '#8892B0' }} />
        ) : (
          <ErrorOutlineIcon sx={{ fontSize: 48, color: '#f44336' }} />
        )}
        <Typography variant="h6" color="#F0F4F8">
          {status === RESULTS_STATUS.EMPTY ? 'No Results' : 'Analysis Failed'}
        </Typography>
        <Typography variant="body2" color="#8892B0">
          {status === RESULTS_STATUS.EMPTY
            ? 'Select files and click "Analyze" to see results'
            : 'Error processing files.'}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default AnalysisResultsState;
