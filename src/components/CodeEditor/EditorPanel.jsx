import { Box, Paper, Chip, Typography, Stack } from '@mui/material';
import Editor from '@monaco-editor/react';
import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';

const EditorPanel = ({ 
  value, 
  onChange, 
  language, 
  fileName = null,
  fileSize = null,
  editorOptions,
  onClear,
}) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const lineCount = value ? value.split('\n').length : 0;
  const charCount = value ? value.length : 0;

  return (
    <Paper
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
      }}
    >
      {fileName && (
        <Box
          sx={{
            p: 1.5,
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#fff' }}>
              {fileName}
            </Typography>
            {fileSize && (
              <Chip
                label={formatFileSize(fileSize)}
                size="small"
                variant="outlined"
                sx={{ height: 24 }}
              />
            )}
            <Chip
              label={`${lineCount} lines`}
              size="small"
              variant="outlined"
              sx={{ height: 24 }}
            />
            <Chip
              label={`${charCount} chars`}
              size="small"
              variant="outlined"
              sx={{ height: 24 }}
            />
          </Stack>
          {onClear && (
            <DeleteIcon
              onClick={onClear}
              sx={{
                cursor: 'pointer',
                fontSize: 18,
                color: '#ff6b6b',
                '&:hover': { opacity: 0.7 },
              }}
            />
          )}
        </Box>
      )}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={value}
          options={editorOptions}
          onChange={(newValue) => onChange(newValue || '')}
        />
      </Box>
    </Paper>
  );
};

export default EditorPanel;
