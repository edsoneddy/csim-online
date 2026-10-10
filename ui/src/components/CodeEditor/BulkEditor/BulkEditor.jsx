import { Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import EditorToolbar from '../EditorToolbar';
import FilePanel from './FilePanel';
import MultiResultsPanel from './MultiResultsPanel';
import { BULK_EDITOR_FILES_KEY, EDITOR_TYPES, TYPE_OF_ANALYSIS } from '../../../utils/toolbar';
import {
  removeAllFilesFromBulkEditor,
  updateFileManagerResultsByEditorKey,
  updateAnalysisJob,
  updateHistory,
  updateInfoDialog,
} from '../../../hooks/redux/appActions';
import { useDispatch, useSelector } from 'react-redux';
import { createAnalyzeAllPayload } from '../../../utils/analysisPayload';
import { useEffect, useRef, useState } from 'react';
import {
  defaultLanguage,
  defaultThreshold,
  PREFILTER_MARGIN,
  SMALL_ESTIMATE_SECONDS,
} from '../../../constants/ui';
import {
  sendCancelBeacon,
  sendDeleteRequest,
  sendGetRequest,
  sendPostRequest,
} from '../../../utils/requestHandler';
import FileViewerDialog from './FileViewerDialog';
import FileDiffViewerDialog from '../FileDiffViewerDialog';
import { blurActiveElement } from '../../../utils/editor';
import { getPollIntervalMs } from '../../../utils/polling';
import EstimateDialog from './EstimateDialog';

const BulkEditor = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState(defaultLanguage);
  const [prefilter, setPrefilter] = useState(false);
  const [prefilterMargin, setPrefilterMargin] = useState(PREFILTER_MARGIN);
  const [threshold, setThreshold] = useState(defaultThreshold);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerFiles, setViewerFiles] = useState([]);
  const [isDiffViewerOpen, setIsDiffViewerOpen] = useState(false);
  const [diffViewerFiles, setDiffViewerFiles] = useState([]);

  // isStarting covers the estimate and the job start; the job itself lives in the store.
  const [isStarting, setIsStarting] = useState(false);
  const [estimate, setEstimate] = useState(null);
  const job = useSelector((state) => state.analysisJob);
  const isAnalyzing = isStarting || job != null;
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

  const finishWithResults = (data, files, thresholdValue) => {
    const similarity_groups = data.similarity_groups || [];
    const similarity_groups_avg = data.similarity_groups_avg || [];
    const unique_groups = data.unique_groups || [];
    const printable_output = data.printable_output || '';

    const bulkSummary = getBulkSummary(
      similarity_groups,
      unique_groups,
      files.length,
      thresholdValue
    );
    const apiResults = {
      similarity_groups: similarity_groups,
      similarity_groups_avg: similarity_groups_avg,
      unique_groups: unique_groups,
      details: t('dualResults.analysisComplete'),
      threshold: thresholdValue,
      files: files,
      success: true,
      printable_output: printable_output,
      prefilter_stats: data.prefilter_stats || null,
    };
    const historyItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      timestamp: new Date(),
      type: TYPE_OF_ANALYSIS.BULK,
      similarity_groups: similarity_groups,
      similarity_groups_avg: similarity_groups_avg,
      unique_groups: unique_groups,
      bulkSummary,
      success: true,
    };
    dispatch(updateFileManagerResultsByEditorKey(BULK_EDITOR_FILES_KEY, apiResults));
    dispatch(updateHistory([historyItem, ...historyRef.current]));
  };

  const finishWithFailure = (files, thresholdValue) => {
    const bulkSummary = getBulkSummary([], [], files.length, thresholdValue, true);
    const apiResults = {
      similarity_groups: [],
      similarity_groups_avg: [],
      unique_groups: [],
      details: t('dualResults.analysisError'),
      threshold: thresholdValue,
      files: files.map((file) => ({
        name: file.name || t('common.untitledFile'),
        content: file.content,
      })),
      success: false,
      printable_output: '',
    };
    const historyItem = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      timestamp: new Date(),
      type: TYPE_OF_ANALYSIS.BULK,
      similarity_groups: [],
      similarity_groups_avg: [],
      unique_groups: [],
      bulkSummary,
      success: false,
    };
    dispatch(updateFileManagerResultsByEditorKey(BULK_EDITOR_FILES_KEY, apiResults));
    dispatch(updateHistory([historyItem, ...historyRef.current]));
  };

  const showMessage = (titleKey, messageKey = titleKey) =>
    dispatch(
      updateInfoDialog(
        true,
        t(`bulkEditor.messages.${messageKey}`),
        t(`bulkEditor.messages.${titleKey}Title`)
      )
    );

  // The analysis the running job belongs to (what to show when it ends).
  const contextRef = useRef(null);
  const historyRef = useRef(history);
  historyRef.current = history;

  const handleJobEnd = (snapshot) => {
    const { files, threshold: thresholdValue } = contextRef.current || {
      files: selected,
      threshold,
    };
    dispatch(updateAnalysisJob(null));
    contextRef.current = null;
    if (snapshot.state === 'done') {
      finishWithResults(snapshot.result, files, thresholdValue);
    } else if (snapshot.state === 'cancelled') {
      showMessage('cancelled', 'cancelledIdle'); // the server gave up: no heartbeat or restart
    } else {
      finishWithFailure(files, thresholdValue);
      showMessage('error');
    }
  };

  const startJob = async (payload) => {
    try {
      const started = await sendPostRequest('/api/jobs', payload);
      dispatch(
        updateAnalysisJob({
          id: started.job_id,
          state: 'running',
          phase: null,
          done: 0,
          total: 0,
          etaSeconds: null,
          receivedAt: Date.now(),
          estimateSeconds: started.estimate?.estimated_seconds ?? null,
        })
      );
      if (!mountedRef.current) {
        // the editor was left while the job was starting: stop it at once
        sendCancelBeacon(started.job_id);
        dispatch(updateAnalysisJob(null));
      }
    } catch (error) {
      if (error.status === 429) {
        showMessage('busy');
      } else if (error.body?.detail?.allowed === false) {
        setEstimate(error.body.detail); // refused by the server: show why
      } else {
        console.info('Error starting csimx analysis:', error);
        showMessage('error');
      }
      contextRef.current = null;
    } finally {
      setIsStarting(false);
    }
  };

  const handleAnalyze = async () => {
    setIsStarting(true);
    dispatch(updateFileManagerResultsByEditorKey(BULK_EDITOR_FILES_KEY, null));
    const files = selected;
    const thresholdValue = threshold;
    const payload = createAnalyzeAllPayload(
      language,
      files,
      threshold / 100,
      prefilter ? prefilterMargin : null
    );
    contextRef.current = { files, threshold: thresholdValue, payload };
    try {
      const est = await sendPostRequest('/api/estimate', payload);
      if (!est.allowed || est.estimated_seconds >= SMALL_ESTIMATE_SECONDS) {
        setEstimate(est);
        setIsStarting(false);
        return;
      }
    } catch (error) {
      console.info('Error estimating csimx analysis:', error);
      contextRef.current = null;
      setIsStarting(false);
      showMessage('error');
      return;
    }
    await startJob(payload);
  };

  const handleEstimateContinue = async () => {
    setEstimate(null);
    setIsStarting(true);
    await startJob(contextRef.current.payload);
  };

  const handleEstimateClose = () => {
    blurActiveElement();
    setEstimate(null);
    contextRef.current = null;
  };

  const handleCancelJob = async () => {
    if (!job) return;
    try {
      await sendDeleteRequest(`/api/jobs/${job.id}`);
    } catch (error) {
      console.info('Error cancelling csimx analysis:', error);
    }
    dispatch(updateAnalysisJob(null));
    contextRef.current = null;
    showMessage('cancelled');
  };

  // Poll the running job. Each poll is also the server heartbeat; the next one is scheduled only
  // after the previous answer (never piled up) with an interval that follows the estimate.
  const jobId = job?.id;
  const pollMs = getPollIntervalMs(job?.estimateSeconds);
  useEffect(() => {
    if (!jobId) return undefined;
    let stopped = false;
    let timer = null;
    const poll = async () => {
      try {
        const snapshot = await sendGetRequest(`/api/jobs/${jobId}`);
        if (stopped) return;
        if (snapshot.state === 'running' || snapshot.state === 'queued') {
          dispatch(
            updateAnalysisJob({
              id: jobId,
              state: snapshot.state,
              phase: snapshot.phase,
              done: snapshot.done,
              total: snapshot.total,
              etaSeconds: snapshot.eta_seconds,
              receivedAt: Date.now(),
              estimateSeconds: jobRef.current?.estimateSeconds ?? null,
            })
          );
          timer = setTimeout(poll, pollMs);
        } else {
          stopped = true;
          handleJobEnd(snapshot);
        }
      } catch (error) {
        if (stopped) return;
        console.info('Error following csimx analysis:', error);
        stopped = true;
        handleJobEnd({ state: error.status === 404 ? 'cancelled' : 'error' });
      }
    };
    timer = setTimeout(poll, pollMs);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
    // handleJobEnd only reads refs and dispatch; polling restarts only for a new job.
  }, [jobId]);

  // Leaving the page (refresh, close, navigation) or this editor must not leave the job burning
  // CPU on the server. `pagehide` only: a hidden tab keeps its job (and its heartbeat). The
  // cleanup runs on a real unmount only if a job is active, so React StrictMode's simulated
  // unmount (no job yet) cancels nothing.
  const jobRef = useRef(job);
  jobRef.current = job;
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    const onPageHide = () => {
      if (jobRef.current?.id) sendCancelBeacon(jobRef.current.id);
    };
    // Restored from the back/forward cache: that job was cancelled by pagehide, start clean.
    const onPageShow = (event) => {
      if (event.persisted) dispatch(updateAnalysisJob(null));
    };
    window.addEventListener('pagehide', onPageHide);
    window.addEventListener('pageshow', onPageShow);
    return () => {
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('pageshow', onPageShow);
      mountedRef.current = false;
      if (jobRef.current?.id) {
        sendCancelBeacon(jobRef.current.id);
        dispatch(updateAnalysisJob(null));
      }
    };
  }, [dispatch]);

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
          prefilter={prefilter}
          onPrefilterChange={setPrefilter}
          prefilterMargin={prefilterMargin}
          onPrefilterMarginChange={setPrefilterMargin}
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
          flex: { xs: 'none', md: 1 }, // stacked panels keep their size and the tab scrolls
          minHeight: 0,
          width: '100%',
        }}
      >
        <FilePanel onViewSelected={handleViewSelected} />
        <MultiResultsPanel
          isAnalyzing={isAnalyzing}
          job={job}
          onCancelJob={handleCancelJob}
          onViewSelected={handleViewSelected}
          onViewDiffSelected={handleViewDiffSelected}
        />
      </Box>

      <EstimateDialog
        estimate={estimate}
        hasPrefilter={prefilter}
        onContinue={handleEstimateContinue}
        onClose={handleEstimateClose}
      />
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
