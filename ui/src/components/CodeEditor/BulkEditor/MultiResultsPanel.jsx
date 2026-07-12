import { Box, Paper, Stack, Typography } from '@mui/material';
import GroupRow from './MultiResultsPanelParts/GroupRow';
import ResultsHeader from './MultiResultsPanelParts/ResultsHeader';
import ResultsStats from './MultiResultsPanelParts/ResultsStats';
import AnalysisErrorState from './MultiResultsPanelParts/AnalysisErrorState';
import { useSelector } from 'react-redux';

const mockResults = {
  similarity_groups: [
    ['a.py', 'b.py'],
    ['c.py', 'd.py'],
  ],
  similarity_groups_avg: [0.96, 0.86],
  unique_groups: ['e.py'],
  details: `Analysis successfully completed`,
  threshold: 0.8,
  files: [
    { id: 'a.py_1', date: 1715450000000, name: 'a.py', size: 3210, type: 'text/x-python-script' },
    { id: 'b.py_2', date: 1715446000000, name: 'b.py', size: 3180, type: 'text/x-python-script' },
    { id: 'c.py_3', date: 1715430000000, name: 'c.py', size: 5120, type: 'text/x-python-script' },
    { id: 'd.py_4', date: 1715420000000, name: 'd.py', size: 5090, type: 'text/x-python-script' },
    { id: 'e.py_5', date: 1715410000000, name: 'e.py', size: 2150, type: 'text/x-python-script' },
  ],
  success: true,
};

const MultiResultsPanel = () => {
  const results = useSelector((state) => state.fileManager.dualEditorFiles.results) || mockResults;

  if (!results?.success || !results) {
    return <AnalysisErrorState status={results == null ? 'empty' : 'error'} />;
  }

  const totalSuspicious = results.similarity_groups?.length || 0;
  const totalUnique = results.unique_groups?.length || 0;
  const totalGroups = totalSuspicious + totalUnique;

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
            />
          ))}

          {results.unique_groups?.map((fileName, index) => (
            <GroupRow
              key={`uni-${index}`}
              fileNames={[fileName]}
              avg={0}
              isUnique={true}
              allFiles={results.files}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default MultiResultsPanel;
