import { Box, Paper, Stack, Typography } from '@mui/material';
import GroupRow from './MultiResultsPanelParts/GroupRow';
import ResultsHeader from './MultiResultsPanelParts/ResultsHeader';
import ResultsStats from './MultiResultsPanelParts/ResultsStats';
import AnalysisResultsState from './MultiResultsPanelParts/AnalysisResultsState';
import { useSelector } from 'react-redux';
import { RESULTS_STATUS } from '../../../utils/results';

const MultiResultsPanel = ({ isAnalyzing, onViewSelected }) => {
  const results = useSelector((state) => state.fileManager.bulkEditorFiles.results);

  if (!results?.success || !results) {
    return (
      <AnalysisResultsState
        status={results == null ? RESULTS_STATUS.EMPTY : RESULTS_STATUS.ERROR}
        isAnalyzing={isAnalyzing}
      />
    );
  }

  const totalSuspicious = results.similarity_groups?.length || 0;
  const totalUnique = results.unique_groups?.length || 0;
  const totalGroups = totalSuspicious + (totalUnique > 0 ? 1 : 0);

  return (
    <Paper
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        backgroundColor: '#0F1419',
        border: '1px solid #2D3748',
      }}
    >
      <ResultsHeader threshold={results.threshold} />

      <Box
        sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}
      >
        <ResultsStats
          totalGroups={totalGroups}
          totalSuspicious={totalSuspicious}
          totalUnique={totalUnique}
        />

        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ color: '#F0F4F8', fontWeight: 600 }}>
                Similarity Groups
              </Typography>
            </Box>
          </Stack>

          {results.similarity_groups?.map((group, index) => (
            <GroupRow
              key={`sus-${index}`}
              fileNames={group}
              avg={results.similarity_groups_avg[index]}
              isUnique={false}
              allFiles={results.files}
              onViewSelected={onViewSelected}
            />
          ))}

          <GroupRow
            key={`unique-group`}
            fileNames={results.unique_groups}
            avg={0}
            isUnique={true}
            allFiles={results.files}
            onViewSelected={onViewSelected}
          />
        </Box>
      </Box>
    </Paper>
  );
};

export default MultiResultsPanel;
