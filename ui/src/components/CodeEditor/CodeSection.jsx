import { Box, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import TopToolbar from './TopToolbar';
import BottomToolbar from './BottomToolbar';
import EditorPanel from './EditorPanel';
import ResultsPanel from './ResultsPanel';
import SessionHistory from './SessionHistory';
import { defaultLanguage } from '../../constants/ui';
import { createAnalysisPayload } from '../../utils/analysisPayload';
import { sendPostRequest } from '../../utils/requestHandler';

const CodeSection = () => {
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [language, setLanguage] = useState(defaultLanguage);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sessionHistory, setSessionHistory] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isCode1Modified, setIsCode1Modified] = useState(false);
  const [isCode2Modified, setIsCode2Modified] = useState(false);
  const [isResultsModified, setIsResultsModified] = useState(false);

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

  const handleCode1Change = (newValue) => {
    setCode1(newValue);
    setIsCode1Modified(true);
  };

  const handleCode2Change = (newValue) => {
    setCode2(newValue);
    setIsCode2Modified(true);
  };

  const handleFile1Upload = (fileData) => {
    setFile1(fileData);
    setCode1(fileData.content);
    setIsCode1Modified(false);
  };

  const handleFile2Upload = (fileData) => {
    setFile2(fileData);
    setCode2(fileData.content);
    setIsCode2Modified(false);
  };

  const handleClearEditor1 = () => {
    setFile1(null);
    setCode1('');
    setIsCode1Modified(false);
  };

  const handleClearEditor2 = () => {
    setFile2(null);
    setCode2('');
    setIsCode2Modified(false);
  };

  const handleClearAll = () => {
    setFile1(null);
    setFile2(null);
    setCode1('');
    setCode2('');
    setResults(null);
    setIsResultsModified(false);
    setIsCode1Modified(false);
    setIsCode2Modified(false);
  };

  const handleAnalyze = async () => {
    if (!code1 || !code2) return;

    setIsAnalyzing(true);
    setIsResultsModified(true);

    const payload = createAnalysisPayload(language, code1, code2, file1, file2);

    try {
      const data = await sendPostRequest('/api/analyze', payload);

      const rawSimilarity = data.result;
      const similarityPercentage = rawSimilarity <= 1 ? rawSimilarity * 100 : rawSimilarity;

      const apiResults = {
        similarity: similarityPercentage,
        matchingLines: 0,
        totalLines: Math.max(code1.split('\n').length, code2.split('\n').length),
        uniqueBlocks: 0,
        matchedBlocks: 0,
        details: `Analysis successfully executed using APTED Tree Edit Distance algorithm for ${language.toUpperCase()}.`,
      };

      setResults(apiResults);

      const historyItem = {
        id: Date.now(),
        timestamp: new Date(),
        file1Name: payload.files[0].name,
        file2Name: payload.files[1].name,
        similarity: apiResults.similarity,
        totalLines: apiResults.totalLines,
      };

      setSessionHistory((prevHistory) => [historyItem, ...prevHistory]);
    } catch (error) {
      console.error('Error running csim analysis:', error);
      setResults({
        similarity: 0,
        matchingLines: 0,
        totalLines: 0,
        uniqueBlocks: 0,
        matchedBlocks: 0,
        details: error.message || 'Failed to connect to the csim backend analysis server.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateHistory = (newHistory) => {
    setSessionHistory(newHistory);
  };

  const canAnalyze = code1.trim().length > 0 && code2.trim().length > 0;

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
      {!isResultsModified && (
        <>
          <TopToolbar language={language} onLanguageChange={setLanguage} />

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: '1fr 1fr',
              },
              gap: 2,
              flex: 1,
              minHeight: 0,
              width: '100%',
            }}
          >
            <EditorPanel
              value={code1}
              onChange={handleCode1Change}
              language={language}
              fileName={file1?.name}
              fileSize={file1?.size}
              editorOptions={editorOptions}
              onClear={handleClearEditor1}
              isModified={isCode1Modified}
              onFileUploaded={handleFile1Upload}
            />
            <EditorPanel
              value={code2}
              onChange={handleCode2Change}
              language={language}
              fileName={file2?.name}
              fileSize={file2?.size}
              editorOptions={editorOptions}
              onClear={handleClearEditor2}
              isModified={isCode2Modified}
              onFileUploaded={handleFile2Upload}
            />
          </Box>
        </>
      )}

      <ResultsPanel results={results} isAnalyzing={isAnalyzing} />

      <BottomToolbar
        onAnalyze={handleAnalyze}
        onClear={handleClearAll}
        canAnalyze={canAnalyze}
        isAnalyzing={isAnalyzing}
      />

      <SessionHistory history={sessionHistory} onClearHistory={handleUpdateHistory} />
    </Box>
  );
};

export default CodeSection;
