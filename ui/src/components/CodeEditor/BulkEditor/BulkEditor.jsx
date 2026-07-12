import { Box } from '@mui/material';
import EditorToolbar from '../EditorToolbar';
import FilePanel from './FilePanel';
import MultiResultsPanel from './MultiResultsPanel';
import { BULK_EDITOR_FILES_KEY, EDITOR_TYPES, TYPE_OF_ANALYSIS } from '../../../utils/toolbar';
import {
  removeAllFilesFromBulkEditor,
  updateFileManagerResultsByEditorKey,
  updateHistory,
} from '../../../hooks/redux/appActions';
import { useDispatch, useSelector } from 'react-redux';
import { createAnalyzeAllPayload } from '../../../utils/analysisPayload';
import { useState } from 'react';
import { defaultLanguage, defaultThreshold } from '../../../constants/ui';
import { sendPostRequest } from '../../../utils/requestHandler';

const BulkEditor = () => {
  const [language, setLanguage] = useState(defaultLanguage);
  const [threshold, setThreshold] = useState(defaultThreshold);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const dispatch = useDispatch();
  const history = useSelector((state) => state.history);

  const selected = useSelector((state) => state.fileManager.bulkEditorFiles.selected);

  const getBulkSummary = (
    similarity_groups,
    unique_groups,
    totalFiles,
    thresholdValue,
    failedAnalysis = false
  ) => {
    if (failedAnalysis) {
      return {
        totalFiles,
        uniqueFiles: 0,
        copiedFiles: 0,
        threshold: thresholdValue,
      };
    }

    const uniqueFiles = unique_groups.length;
    const copiedFiles = totalFiles - uniqueFiles;

    return {
      totalFiles,
      uniqueFiles,
      copiedFiles,
      threshold: thresholdValue,
    };
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const payload = createAnalyzeAllPayload(language, selected, threshold);
    let apiResults = null;
    let historyItem = null;
    try {
      const data = await sendPostRequest('/api/analyzeAll', payload);
      const similarity_groups = data.similarity_groups || [];
      const similarity_groups_avg = data.similarity_groups_avg || [];
      const unique_groups = data.unique_groups || [];

      const bulkSummary = getBulkSummary(
        similarity_groups,
        unique_groups,
        selected.length,
        threshold
      );
      apiResults = {
        similarity_groups: similarity_groups,
        similarity_groups_avg: similarity_groups_avg,
        unique_groups: unique_groups,
        details: `Analysis successfully completed`,
        threshold: threshold,
        files: selected.map((file) => ({
          name: file.name || 'Untitled',
          content: file.content,
        })),
        success: true,
      };

      historyItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        timestamp: new Date(),
        type: TYPE_OF_ANALYSIS.BULK,
        similarity_groups: similarity_groups,
        similarity_groups_avg: similarity_groups_avg,
        unique_groups: unique_groups,
        bulkSummary,
        success: true,
      };
    } catch (error) {
      console.info('Error running csim analysis:', error);
      const bulkSummary = getBulkSummary([], [], selected.length, threshold, true);
      apiResults = {
        similarity_groups: [],
        similarity_groups_avg: [],
        unique_groups: [],
        details: 'An error occurred during analysis. Please try again.',
        threshold: threshold,
        files: selected.map((file) => ({
          name: file.name || 'Untitled',
          content: file.content,
        })),
        success: false,
      };
      historyItem = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        timestamp: new Date(),
        type: TYPE_OF_ANALYSIS.BULK,
        similarity_groups: [],
        similarity_groups_avg: [],
        unique_groups: [],
        bulkSummary,
        success: false,
      };
    } finally {
      setIsAnalyzing(false);
    }
    dispatch(updateFileManagerResultsByEditorKey(BULK_EDITOR_FILES_KEY, apiResults));
    const newHistory = [historyItem, ...history];
    dispatch(updateHistory(newHistory));
  };

  const handleClearAll = () => {
    dispatch(updateFileManagerResultsByEditorKey(BULK_EDITOR_FILES_KEY, null));
    dispatch(removeAllFilesFromBulkEditor());
  };

  const canAnalyze = selected.length > 1;

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
            md: '1fr auto 1fr',
          },
          gridTemplateRows: {
            xs: '1fr auto 1fr',
            md: '1fr',
          },
          gap: 2,
          flex: 1,
          minHeight: 0,
          width: '100%',
          alignItems: 'center',
          justifyItems: 'center',
        }}
      >
        <FilePanel />
        <EditorToolbar
          onClear={handleClearAll}
          isAnalyzing={isAnalyzing}
          orientation={{ xs: 'row', md: 'column' }}
          editorType={EDITOR_TYPES.BULK_EDITOR}
          onAnalyze={handleAnalyze}
          language={language}
          onLanguageChange={setLanguage}
          threshold={threshold}
          onThresholdChange={setThreshold}
          canAnalyze={canAnalyze}
        />
        <MultiResultsPanel isAnalyzing={isAnalyzing} />
      </Box>
    </Box>
  );
};

export default BulkEditor;
