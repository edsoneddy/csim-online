import { Box, Paper, Stack, Typography } from '@mui/material';
import { useState } from 'react';
import DescriptionIcon from '@mui/icons-material/Description';
const data = [
  { name: 'file1.py', content: '2048' },
  { name: 'file2.js', content: '4096' },
  { name: 'file3.java', content: '10240' },
];

const MultiResultsPanel = ({ onFileUploaded }) => {
  const [files, setFiles] = useState(data);

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
      <Box
        sx={{
          p: 1.5,
          backgroundColor: '#1A1F2E',
          borderBottom: '1px solid #2D3748',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          height: '4em',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
          <DescriptionIcon />
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#F0F4F8' }}>
            {'Results'}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: '100%' }} />
      </Box>
    </Paper>
  );
};

export default MultiResultsPanel;
