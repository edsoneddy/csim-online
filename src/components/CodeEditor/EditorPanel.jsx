import React from 'react';
import { Box, Paper, Chip, Typography, Stack } from '@mui/material';
import Editor from '@monaco-editor/react';
import DeleteIcon from '@mui/icons-material/Delete';
import { defineCSIMTheme, CSIM_THEME_NAME } from '../../styles/monacoTheme';
import TooltipIconButton from '../Common/TooltipIconButton';

const EditorPanel = ({
  value,
  onChange,
  language,
  fileName = null,
  fileSize = null,
  editorOptions,
  onClear,
  isModified = false,
}) => {
  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleEditorDidMount = (editor, monaco) => {
    defineCSIMTheme(monaco);
    monaco.editor.setTheme(CSIM_THEME_NAME);

    if (editorOptions?.onMount) {
      editorOptions.onMount(editor, monaco);
    }
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
        backgroundColor: '#0F1419',
        border: '1px solid #2D3748',
      }}
    >
      <Box
        sx={{
          p: 1.5,
          backgroundColor: '#1A1F2E', // Paper surface
          borderBottom: '1px solid #2D3748', // Border divider
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
          {fileName && (
            <Typography variant="caption" sx={{ fontWeight: 600, color: '#F0F4F8' }}>
              {fileName}
            </Typography>
          )}

          {fileName && isModified && (
            <Chip
              label={'Modified'}
              size="small"
              variant="outlined"
              sx={{ height: 24, borderColor: '#2D3748', color: '#A0AEC0' }}
            />
          )}

          {fileSize && !isModified && (
            <Chip
              label={formatFileSize(fileSize)}
              size="small"
              variant="outlined"
              sx={{ height: 24, borderColor: '#2D3748', color: '#A0AEC0' }}
            />
          )}

          <Chip
            label={`${lineCount} lines`}
            size="small"
            variant="outlined"
            sx={{ height: 24, borderColor: '#2D3748', color: '#A0AEC0' }}
          />

          <Chip
            label={`${charCount} chars`}
            size="small"
            variant="outlined"
            sx={{ height: 24, borderColor: '#2D3748', color: '#A0AEC0' }}
          />
        </Stack>
        <TooltipIconButton props={{ title: 'Delete' }}>
          <DeleteIcon
            onClick={onClear}
            sx={{
              cursor: 'pointer',
              fontSize: 18,
              color: '#EF5350', // Red (Critical status color)
              transition: 'opacity 0.2s',
              '&:hover': { opacity: 0.7 },
            }}
          />
        </TooltipIconButton>
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Editor
          height="100%"
          language={language}
          theme={CSIM_THEME_NAME}
          value={value}
          options={editorOptions}
          onMount={handleEditorDidMount}
          onChange={(newValue) => onChange(newValue || '')}
        />
      </Box>
    </Paper>
  );
};

export default EditorPanel;
