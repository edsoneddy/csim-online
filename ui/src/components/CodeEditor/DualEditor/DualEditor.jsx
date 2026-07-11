import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import Toolbar from '../Toolbar';
import EditorPanel from './EditorPanel';
import SingleResultsPanel from './SingleResultsPanel';
import { defaultLanguage, FILE_1_KEY, FILE_2_KEY } from '../../../constants/ui';
import { createAnalysisPayload } from '../../../utils/analysisPayload';
import { sendPostRequest } from '../../../utils/requestHandler';
import { useDispatch, useSelector } from 'react-redux';
import {
  updateDualEditorFileByKey,
  updateDualEditorFileContentByKey,
  updateHistory,
} from '../../../hooks/redux/appActions';
import { debounce } from 'lodash';

const DualEditor = () => {
  const [language, setLanguage] = useState(defaultLanguage);
  const [file1, setFile1] = useState({});
  const [file2, setFile2] = useState({});
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const history = useSelector((state) => state.history);
  const dispatch = useDispatch();

  // Load files from Redux store if they exist
  const file1Stored = useSelector((state) => state.fileManager.dualEditorFiles[FILE_1_KEY]);
  const file2Stored = useSelector((state) => state.fileManager.dualEditorFiles[FILE_2_KEY]);

  const editorOptions = {
    selectOnLineNumbers: true,
    minimap: { enabled: false },
    fontSize: isMobile ? 12 : 14,
    fontFamily: 'Fira Code, monospace',
    formatOnPaste: true,
    formatOnType: true,
    scrollBeyondLastLine: false,
    contextmenu: true,
  };

  useEffect(() => {
    if (file1Stored) {
      setFile1(file1Stored);
    }
    if (file2Stored) {
      setFile2(file2Stored);
    }
  }, [file1Stored, file2Stored]);

  const debouncedUpdateFileContent = useMemo(
    () =>
      debounce((fileKey, newContent) => {
        dispatch(updateDualEditorFileContentByKey(fileKey, newContent));
      }, 500),
    [dispatch]
  );

  const handleCode1Change = (newValue) => {
    setFile1((prevFile) => ({ ...prevFile, content: newValue }));
    debouncedUpdateFileContent(FILE_1_KEY, newValue);
  };

  const handleCode2Change = (newValue) => {
    setFile2((prevFile) => ({ ...prevFile, content: newValue }));
    debouncedUpdateFileContent(FILE_2_KEY, newValue);
  };

  const handleFile1Upload = (files) => {
    const fileData = files[0];
    setFile1(fileData);
    dispatch(updateDualEditorFileByKey(FILE_1_KEY, fileData));
  };

  const handleFile2Upload = (files) => {
    const fileData = files[0];
    setFile2(fileData);
    dispatch(updateDualEditorFileByKey(FILE_2_KEY, fileData));
  };

  const handleClearEditor1 = () => {
    setFile1({});
    dispatch(updateDualEditorFileByKey(FILE_1_KEY, {}));
  };

  const handleClearEditor2 = () => {
    setFile2({});
    dispatch(updateDualEditorFileByKey(FILE_2_KEY, {}));
  };

  const handleClearAll = () => {
    setFile1({});
    setFile2({});
    setResults(null);
    dispatch(updateDualEditorFileByKey(FILE_1_KEY, {}));
    dispatch(updateDualEditorFileByKey(FILE_2_KEY, {}));
  };

  const handleAnalyze = async () => {
    if (!file1?.content || !file2?.content) return;

    setIsAnalyzing(true);
    const payload = createAnalysisPayload(language, file1, file2);
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
        details: `Analysis successfully completed`,
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
        details: 'An error occurred during analysis. Please try again.',
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
    setResults(apiResults);
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
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr min-content 1fr',
          },
          gap: 2,
          flex: 1,
          minHeight: 0,
          width: '100%',
          alignItems: 'center',
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

        <Toolbar
          onAnalyze={handleAnalyze}
          onClear={handleClearAll}
          canAnalyze={canAnalyze}
          isAnalyzing={isAnalyzing}
          language={language}
          onLanguageChange={setLanguage}
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

      <SingleResultsPanel results={results} isAnalyzing={isAnalyzing} />
    </Box>
  );
};

export default DualEditor;
