import { Box, Paper, Chip, Typography, Stack } from '@mui/material';
import Editor from '@monaco-editor/react';
import ClearIcon from '@mui/icons-material/Clear';
import { defineCSIMTheme, CSIM_THEME_NAME } from '../../../styles/monacoTheme';
import TooltipIconButton from '../../Common/TooltipIconButton';
import FileUploadButton from '../../Common/FileUploadButton';

const EditorPanel = ({
  value = '',
  onChange,
  language,
  fileName = null,
  fileSize = null,
  editorOptions,
  onClear,
  isModified = false,
  onFileUploaded,
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
        backgroundColor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          p: 1.5,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          rowGap: 1,
          gap: 1,
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          useFlexGap
          flexWrap="wrap"
          sx={{ flex: '1 1 auto', minWidth: 0 }}
        >
          {fileName && (
            <Typography
              variant="caption"
              sx={{
                fontWeight: 600,
                color: 'text.primary',
                maxWidth: { xs: 140, sm: 220 },
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {fileName}
            </Typography>
          )}

          {fileName && isModified && (
            <Chip
              label={'Modified'}
              size="small"
              variant="outlined"
              sx={{ height: 24, borderColor: 'divider', color: 'text.secondary' }}
            />
          )}

          {fileSize && !isModified && (
            <Chip
              label={formatFileSize(fileSize)}
              size="small"
              variant="outlined"
              sx={{ height: 24, borderColor: 'divider', color: 'text.secondary' }}
            />
          )}

          <Chip
            label={`${lineCount} lines`}
            size="small"
            variant="outlined"
            sx={{ height: 24, borderColor: 'divider', color: 'text.secondary' }}
          />

          <Chip
            label={`${charCount} chars`}
            size="small"
            variant="outlined"
            sx={{ height: 24, borderColor: 'divider', color: 'text.secondary' }}
          />
        </Stack>
        <Stack direction="row" sx={{ flexShrink: 0 }}>
          <TooltipIconButton props={{ title: 'Upload' }} asChild>
            <FileUploadButton onFilesSelected={onFileUploaded} />
          </TooltipIconButton>
          <TooltipIconButton props={{ title: 'Clear', onClick: onClear }}>
            <ClearIcon />
          </TooltipIconButton>
        </Stack>
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
