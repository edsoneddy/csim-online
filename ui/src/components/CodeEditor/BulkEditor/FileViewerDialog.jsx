import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
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
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import Editor from '@monaco-editor/react';
import { useTranslation } from 'react-i18next';
import { handleMonacoBeforeMount, monacoThemeNameFor } from '../../../styles/monacoTheme';
import { useThemeMode } from '../../../theme/ThemeModeContext';
import {
  blurActiveElement,
  getLanguageFromFileName,
  formatFileSize,
  getLineCount,
  normalizeContent,
} from '../../../utils/editor';

const FileViewerDialog = ({ open, onClose, files = [] }) => {
  const { t } = useTranslation();
  const { resolvedMode } = useThemeMode();
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const currentFile = files[currentFileIndex] ?? null;
  const currentContent = useMemo(() => normalizeContent(currentFile?.content), [currentFile]);
  const currentLanguage = useMemo(
    () => getLanguageFromFileName(currentFile?.name || ''),
    [currentFile]
  );

  useEffect(() => {
    if (!open) {
      setCurrentFileIndex(0);
      return;
    }

    if (currentFileIndex >= files.length) {
      setCurrentFileIndex(0);
    }
  }, [currentFileIndex, files.length, open]);

  const handleEditorDidMount = (editor) => {
    editor.updateOptions({ readOnly: true });
  };

  const handleClose = () => {
    blurActiveElement();
    onClose();
  };

  const handleTabChange = (_event, newValue) => {
    setCurrentFileIndex(newValue);
  };

  const handlePreviousFile = () => {
    setCurrentFileIndex((previousIndex) => Math.max(previousIndex - 1, 0));
  };

  const handleNextFile = () => {
    setCurrentFileIndex((previousIndex) => Math.min(previousIndex + 1, files.length - 1));
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
              {t('fileViewer.title')}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {files.length > 0
                ? t('fileViewer.filesLoaded', { count: files.length })
                : t('fileViewer.noFilesAvailable')}
            </Typography>
          </Box>

          {files.length > 1 && (
            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                size="small"
                variant="outlined"
                startIcon={<KeyboardArrowLeftIcon />}
                onClick={handlePreviousFile}
                disabled={currentFileIndex === 0}
              >
                {t('fileViewer.prev')}
              </Button>
              <Button
                size="small"
                variant="outlined"
                endIcon={<KeyboardArrowRightIcon />}
                onClick={handleNextFile}
                disabled={currentFileIndex >= files.length - 1}
              >
                {t('fileViewer.next')}
              </Button>
            </Stack>
          )}

          <IconButton onClick={handleClose} size="small" aria-label={t('fileViewer.closeViewer')}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Box sx={{ px: 2, pt: 1.5, pb: 0.5 }}>
        <Tabs
          value={files.length > 0 ? currentFileIndex : false}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ minHeight: 40 }}
        >
          {files.map((file, index) => (
            <Tab
              key={file.id ?? `${file.name}-${index}`}
              label={file.name || t('common.fileLabel', { number: index + 1 })}
              value={index}
              sx={{ minHeight: 40, textTransform: 'none', fontWeight: 600 }}
            />
          ))}
        </Tabs>
      </Box>

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
        {currentFile ? (
          <>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'flex-start', sm: 'center' }}
              justifyContent="space-between"
              spacing={1}
            >
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Chip label={currentFile.name || t('common.untitledFile')} variant="outlined" />
                <Chip label={currentLanguage} variant="outlined" />
                <Chip
                  label={t('editor.panel.lines', { count: getLineCount(currentContent) })}
                  variant="outlined"
                />
                <Chip label={formatFileSize(currentFile.size)} variant="outlined" />
              </Stack>

              <Typography variant="body2" color="text.secondary">
                {currentFileIndex + 1} / {files.length}
              </Typography>
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
              <Editor
                height="100%"
                language={currentLanguage}
                theme={monacoThemeNameFor(resolvedMode)}
                value={currentContent}
                options={{
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 14,
                  fontFamily: 'Fira Code, monospace',
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  automaticLayout: true,
                  contextmenu: false,
                  renderWhitespace: 'selection',
                  selectOnLineNumbers: false,
                }}
                beforeMount={handleMonacoBeforeMount}
                onMount={handleEditorDidMount}
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
                {t('fileViewer.noFileSelected')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('fileViewer.addFilesToPreview')}
              </Typography>
            </Stack>
          </Box>
        )}
      </DialogContent>
      <Divider />
    </Dialog>
  );
};

export default FileViewerDialog;
