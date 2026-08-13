import { AppBar, Box, Tab, Tabs, useMediaQuery, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import EditorToolbar from '../EditorToolbar';
import EditorPanel from './EditorPanel';
import SingleResultsPanel from './SingleResultsPanel';
import { defaultLanguage, FILE_1_KEY, FILE_2_KEY } from '../../../constants/ui';
import { createAnalyzePayload } from '../../../utils/analysisPayload';
import { sendPostRequest } from '../../../utils/requestHandler';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateDualEditorFileByKey,
  updateDualEditorFileContentByKey,
  updateFileManagerResultsByEditorKey,
  updateHistory,
} from '../../../hooks/redux/appActions';
import { debounce } from 'lodash';
import { DUAL_EDITOR_FILES_KEY, EDITOR_TYPES } from '../../../utils/toolbar';

// Below this breakpoint the two editors no longer fit side by side (see the
// grid's `md` column below) and stacking them vertically wastes too much
// space, so we switch to a single tabbed editor instead.
const EDITORS_STACK_BREAKPOINT = 'md';

const DualEditor = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(defaultLanguage);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeEditorTab, setActiveEditorTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isEditorsStacked = useMediaQuery(theme.breakpoints.down(EDITORS_STACK_BREAKPOINT));
  const history = useSelector((state) => state.history);
  const dispatch = useDispatch();

  // Load files from Redux store if they exist
  const file1 = useSelector((state) => state.fileManager.dualEditorFiles[FILE_1_KEY]);
  const file2 = useSelector((state) => state.fileManager.dualEditorFiles[FILE_2_KEY]);

  const editorOptions = {
    selectOnLineNumbers: true,
    minimap: { enabled: false },
    fontSize: isMobile ? 12 : 14,
    fontFamily: 'Fira Code, monospace',
    formatOnPaste: true,
    formatOnType: true,
    scrollBeyondLastLine: false,
    contextmenu: true,
    automaticLayout: true,
  };

  const debouncedUpdateFileContent = useMemo(
    () =>
      debounce((fileKey, newContent) => {
        dispatch(updateDualEditorFileContentByKey(fileKey, newContent));
      }, 250),
    [dispatch]
  );

  const handleCode1Change = (newValue) => {
    debouncedUpdateFileContent(FILE_1_KEY, newValue);
  };

  const handleCode2Change = (newValue) => {
    debouncedUpdateFileContent(FILE_2_KEY, newValue);
  };

  const handleFile1Upload = (files) => {
    const fileData = files[0];
    dispatch(updateDualEditorFileByKey(FILE_1_KEY, fileData));
  };

  const handleFile2Upload = (files) => {
    const fileData = files[0];
    dispatch(updateDualEditorFileByKey(FILE_2_KEY, fileData));
  };

  const handleClearEditor1 = () => {
    dispatch(updateDualEditorFileByKey(FILE_1_KEY, {}));
  };

  const handleClearEditor2 = () => {
    dispatch(updateDualEditorFileByKey(FILE_2_KEY, {}));
  };

  const handleClearAll = () => {
    dispatch(updateFileManagerResultsByEditorKey(DUAL_EDITOR_FILES_KEY, null));
    dispatch(updateDualEditorFileByKey(FILE_1_KEY, {}));
    dispatch(updateDualEditorFileByKey(FILE_2_KEY, {}));
  };

  const handleAnalyze = async () => {
    if (!file1?.content || !file2?.content) return;

    setIsAnalyzing(true);
    const payload = createAnalyzePayload(language, file1, file2);
    let apiResults = null;
    let historyItem = null;
    try {
      const data = await sendPostRequest('/api/analyze', payload);
      const rawSimilarity = data.result;
      const similarityPercentage = rawSimilarity <= 1 ? rawSimilarity * 100 : rawSimilarity;

      apiResults = {
        similarity: similarityPercentage,
        matchingLines: 0,
        totalLines: Math.max(file1?.content.split('\n').length, file2?.content.split('\n').length),
        uniqueBlocks: 0,
        matchedBlocks: 0,
        details: t('dualResults.analysisComplete'),
      };

      historyItem = {
        id: Date.now(),
        timestamp: new Date(),
        file1Name: payload.files[0].name,
        file2Name: payload.files[1].name,
        similarity: apiResults.similarity,
        totalLines: apiResults.totalLines,
      };
    } catch (error) {
      console.info('Error running csim analysis:', error);
      apiResults = {
        similarity: null,
        matchingLines: 0,
        totalLines: 0,
        uniqueBlocks: 0,
        matchedBlocks: 0,
        details: t('dualResults.analysisError'),
      };
      historyItem = {
        id: Date.now(),
        timestamp: new Date(),
        file1Name: payload.files[0].name,
        file2Name: payload.files[1].name,
        similarity: null,
        totalLines: 0,
      };
    } finally {
      setIsAnalyzing(false);
    }
    dispatch(updateFileManagerResultsByEditorKey(DUAL_EDITOR_FILES_KEY, apiResults));
    const newHistory = [historyItem, ...history];
    dispatch(updateHistory(newHistory));
  };

  const canAnalyze = file1?.content?.trim().length > 0 && file2?.content?.trim().length > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        gap: 1.5,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          gap: 2,
        }}
      >
        <EditorToolbar
          onAnalyze={handleAnalyze}
          onClear={handleClearAll}
          canAnalyze={canAnalyze}
          isAnalyzing={isAnalyzing}
          language={language}
          onLanguageChange={setLanguage}
          editorType={EDITOR_TYPES.DUAL_EDITOR}
        />
      </Box>

      {isEditorsStacked ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            minHeight: 0,
            width: '100%',
          }}
        >
          <Box sx={{ flex: 1, minHeight: 320, display: activeEditorTab === 0 ? 'flex' : 'none' }}>
            <EditorPanel
              value={file1?.content}
              onChange={handleCode1Change}
              language={language}
              fileName={file1?.name}
              fileSize={file1?.size}
              editorOptions={editorOptions}
              onClear={handleClearEditor1}
              onFileUploaded={handleFile1Upload}
            />
          </Box>

          <Box sx={{ flex: 1, minHeight: 320, display: activeEditorTab === 1 ? 'flex' : 'none' }}>
            <EditorPanel
              value={file2?.content}
              onChange={handleCode2Change}
              language={language}
              fileName={file2?.name}
              fileSize={file2?.size}
              editorOptions={editorOptions}
              onClear={handleClearEditor2}
              onFileUploaded={handleFile2Upload}
            />
          </Box>

          {/* Sheet-style tab strip, Excel-like: compact, left-aligned, flush
              against the bottom edge of the editor panel above it. */}
          <AppBar
            position="static"
            elevation={0}
            sx={{
              mt: 0,
              borderRadius: '0 0 4px 4px',
              borderTop: 0,
              borderBottom: 0,
              boxShadow: 'none',
              background: 'none',
              backgroundColor: (t) => alpha(t.palette.primary.main, t.palette.mode === 'dark' ? 0.16 : 0.08),
            }}
          >
            <Tabs
              value={activeEditorTab}
              onChange={(_event, newValue) => setActiveEditorTab(newValue)}
              variant="standard"
              indicatorColor="primary"
              textColor="primary"
              sx={{
                minHeight: 32,
                '& .MuiTabs-flexContainer': { gap: 0.5, px: 1 },
                '& .MuiTab-root': {
                  minHeight: 32,
                  minWidth: 0,
                  py: 0.25,
                  px: 1.5,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'text.secondary',
                  borderRadius: '0 0 6px 6px',
                  '&.Mui-selected': {
                    backgroundColor: (t) => alpha(t.palette.primary.main, 0.2),
                  },
                },
              }}
            >
              <Tab label={t('editor.tabs.editorIndex', { index: 1 })} />
              <Tab label={t('editor.tabs.editorIndex', { index: 2 })} />
            </Tabs>
          </AppBar>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 2,
            flex: 1,
            minHeight: 0,
            width: '100%',
          }}
        >
          <EditorPanel
            value={file1?.content}
            onChange={handleCode1Change}
            language={language}
            fileName={file1?.name}
            fileSize={file1?.size}
            editorOptions={editorOptions}
            onClear={handleClearEditor1}
            onFileUploaded={handleFile1Upload}
          />

          <EditorPanel
            value={file2?.content}
            onChange={handleCode2Change}
            language={language}
            fileName={file2?.name}
            fileSize={file2?.size}
            editorOptions={editorOptions}
            onClear={handleClearEditor2}
            onFileUploaded={handleFile2Upload}
          />
        </Box>
      )}

      <SingleResultsPanel isAnalyzing={isAnalyzing} files={[file1, file2]} />
    </Box>
  );
};

export default DualEditor;
