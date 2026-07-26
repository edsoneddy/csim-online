import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { DiffEditor } from '@monaco-editor/react';
import { defineCSIMTheme, CSIM_THEME_NAME } from '../../styles/monacoTheme';
import {
  getLanguageFromFileName,
  formatFileSize,
  getLineCount,
  normalizeContent,
  getFileLabel,
} from '../../utils/editor';

const FileDiffViewerDialog = ({ open, onClose, files = [] }) => {
  const [originalFileIndex, setOriginalFileIndex] = useState(0);
  const [modifiedFileIndex, setModifiedFileIndex] = useState(1);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (!open) {
      setOriginalFileIndex(0);
      setModifiedFileIndex(1);
      return;
    }

    setOriginalFileIndex(0);
    setModifiedFileIndex(files.length > 1 ? 1 : 0);
  }, [files.length, open]);

  const originalFile = files[originalFileIndex] ?? null;
  const modifiedFile = files[modifiedFileIndex] ?? null;

  const originalContent = useMemo(
    () => normalizeContent(originalFile?.content),
    [originalFile?.content]
  );
  const modifiedContent = useMemo(
    () => normalizeContent(modifiedFile?.content),
    [modifiedFile?.content]
  );

  const originalLanguage = useMemo(
    () => getLanguageFromFileName(originalFile?.name || ''),
    [originalFile?.name]
  );
  const modifiedLanguage = useMemo(
    () => getLanguageFromFileName(modifiedFile?.name || ''),
    [modifiedFile?.name]
  );

  const handleEditorDidMount = (editor, monaco) => {
    defineCSIMTheme(monaco);
    monaco.editor.setTheme(CSIM_THEME_NAME);
    editor.updateOptions({ readOnly: true });
  };

  // Funciones simplificadas: simplemente actualizan el índice seleccionado
  const handleOriginalTabChange = (_event, newValue) => {
    setOriginalFileIndex(newValue);
  };

  const handleModifiedTabChange = (_event, newValue) => {
    setModifiedFileIndex(newValue);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="xl"
      PaperProps={{
        sx: {
          height: fullScreen ? '100%' : 'min(92vh, 960px)',
          backgroundImage: 'none',
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          py: 1.5,
          px: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }} noWrap>
              File Diff Viewer
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {files.length > 0
                ? `${files.length} file${files.length === 1 ? '' : 's'} loaded`
                : 'No files available to compare'}
            </Typography>
          </Box>

          <IconButton onClick={onClose} size="small" aria-label="close diff viewer">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent
        sx={{
          px: 2,
          py: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          minHeight: 0,
          background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
        }}
      >
        {originalFile && modifiedFile ? (
          <>
            <Stack spacing={1.5}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ minWidth: 0 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
                    Original
                  </Typography>
                  <Tabs
                    value={originalFileIndex}
                    onChange={handleOriginalTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{ minHeight: 40 }}
                  >
                    {files.map((file, index) => (
                      <Tab
                        key={file.id ?? `${file.name}-${index}`}
                        label={getFileLabel(file, index)}
                        value={index}
                        sx={{ minHeight: 40, textTransform: 'none', fontWeight: 600 }}
                      />
                    ))}
                  </Tabs>
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="caption" color="text.secondary" sx={{ px: 0.5 }}>
                    Modified
                  </Typography>
                  <Tabs
                    value={modifiedFileIndex}
                    onChange={handleModifiedTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{ minHeight: 40 }}
                  >
                    {files.map((file, index) => (
                      <Tab
                        key={file.id ?? `${file.name}-${index}`}
                        label={getFileLabel(file, index)}
                        value={index}
                        sx={{ minHeight: 40, textTransform: 'none', fontWeight: 600 }}
                      />
                    ))}
                  </Tabs>
                </Box>
              </Stack>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                justifyContent="space-between"
                spacing={1}
              >
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label={`Original: ${originalFile.name || 'Untitled file'}`}
                    variant="outlined"
                  />
                  <Chip label={originalLanguage} variant="outlined" />
                  <Chip label={`${getLineCount(originalContent)} lines`} variant="outlined" />
                  <Chip label={formatFileSize(originalFile.size)} variant="outlined" />
                </Stack>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip
                    label={`Modified: ${modifiedFile.name || 'Untitled file'}`}
                    variant="outlined"
                  />
                  <Chip label={modifiedLanguage} variant="outlined" />
                  <Chip label={`${getLineCount(modifiedContent)} lines`} variant="outlined" />
                  <Chip label={formatFileSize(modifiedFile.size)} variant="outlined" />
                </Stack>
              </Stack>
            </Stack>

            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 1,
                overflow: 'hidden',
                boxShadow: 3,
                backgroundColor: theme.palette.background.paper,
              }}
            >
              <DiffEditor
                height="100%"
                language={originalLanguage}
                originalLanguage={originalLanguage}
                modifiedLanguage={modifiedLanguage}
                theme={CSIM_THEME_NAME}
                original={originalContent}
                modified={modifiedContent}
                options={{
                  renderSideBySide: !fullScreen,
                  readOnly: true,
                  minimap: { enabled: !fullScreen },
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  contextmenu: false,
                  wordWrap: 'on',
                }}
                onMount={handleEditorDidMount}
                keepCurrentOriginalModel={true}
                keepCurrentModifiedModel={true}
              />
            </Box>
          </>
        ) : (
          <Box
            sx={{
              flex: 1,
              minHeight: 320,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px dashed ${theme.palette.divider}`,
              borderRadius: 1,
              backgroundColor: theme.palette.background.default,
            }}
          >
            <Stack spacing={1} alignItems="center">
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                No files selected
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Add two files to bulk editor to compare them here.
              </Typography>
            </Stack>
          </Box>
        )}
      </DialogContent>
      <Divider />
    </Dialog>
  );
};

export default FileDiffViewerDialog;
