import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
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
import FileViewerDialog from './FileViewerDialog';
import FileDiffViewerDialog from '../FileDiffViewerDialog';
import { blurActiveElement } from '../../../utils/editor';

const BulkEditor = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(defaultLanguage);
  const [threshold, setThreshold] = useState(defaultThreshold);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerFiles, setViewerFiles] = useState([]);
  const [isDiffViewerOpen, setIsDiffViewerOpen] = useState(false);
  const [diffViewerFiles, setDiffViewerFiles] = useState([]);

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
    const similarityThreshold = threshold / 100;
    const payload = createAnalyzeAllPayload(language, selected, similarityThreshold);
    let apiResults = null;
    let historyItem = null;
    try {
      dispatch(updateFileManagerResultsByEditorKey(BULK_EDITOR_FILES_KEY, null));
      const data = await sendPostRequest('/api/analyze-all', payload);
      const similarity_groups = data.similarity_groups || [];
      const similarity_groups_avg = data.similarity_groups_avg || [];
      const unique_groups = data.unique_groups || [];
      const printable_output = data.printable_output || '';

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
        details: t('dualResults.analysisComplete'),
        threshold: threshold,
        files: selected,
        success: true,
        printable_output: printable_output,
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
        details: t('dualResults.analysisError'),
        threshold: threshold,
        files: selected.map((file) => ({
          name: file.name || t('common.untitledFile'),
          content: file.content,
        })),
        success: false,
        printable_output: '',
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

  const handleViewSelected = (filesToView) => {
    if (!filesToView || filesToView.length === 0) return;
    blurActiveElement();
    setViewerFiles(filesToView);
    setIsViewerOpen(true);
  };

  const handleViewDiffSelected = (filesToView) => {
    if (!filesToView || filesToView.length === 0) return;
    blurActiveElement();
    setDiffViewerFiles(filesToView);
    setIsDiffViewerOpen(true);
  };

  const handleCloseViewer = () => {
    blurActiveElement();
    setIsViewerOpen(false);
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
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: '100%',
          gap: 2,
        }}
      >
        <EditorToolbar
          onClear={handleClearAll}
          isAnalyzing={isAnalyzing}
          editorType={EDITOR_TYPES.BULK_EDITOR}
          onAnalyze={handleAnalyze}
          language={language}
          onLanguageChange={setLanguage}
          threshold={threshold}
          onThresholdChange={setThreshold}
          canAnalyze={canAnalyze}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: '1fr 1fr',
          },
          gap: 2,
          flex: 1,
          minHeight: 0,
          width: '100%',
        }}
      >
        <FilePanel onViewSelected={handleViewSelected} />
        <MultiResultsPanel
          isAnalyzing={isAnalyzing}
          onViewSelected={handleViewSelected}
          onViewDiffSelected={handleViewDiffSelected}
        />
      </Box>

      <FileViewerDialog open={isViewerOpen} onClose={handleCloseViewer} files={viewerFiles} />
      <FileDiffViewerDialog
        open={isDiffViewerOpen}
        onClose={() => {
          blurActiveElement();
          setIsDiffViewerOpen(false);
        }}
        files={diffViewerFiles}
      />
    </Box>
  );
};

export default BulkEditor;
