import { Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import TopToolbar from './TopToolbar';
import BottomToolbar from './BottomToolbar';
import EditorPanel from './EditorPanel';
import ResultsPanel from './ResultsPanel';
import SessionHistory from './SessionHistory';
import { defaultLanguage } from '../../constants/ui';

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
    setIsCode1Modified(false);
    setIsCode2Modified(false);
  };

  const handleAnalyze = () => {
    if (!code1 || !code2) return;

    setIsAnalyzing(true);

    setTimeout(() => {
      const mockResults = {
        similarity: Math.random() * 100,
        matchingLines: Math.floor(Math.random() * 50),
        totalLines: Math.max(code1.split('\n').length, code2.split('\n').length),
        uniqueBlocks: Math.floor(Math.random() * 20),
        matchedBlocks: Math.floor(Math.random() * 10) + 1,
        details: 'Analysis completed. Check the navigation to browse through matches.',
      };
      setResults(mockResults);

      const historyItem = {
        id: Date.now(),
        timestamp: new Date(),
        file1Name: file1?.name || 'Code 1',
        file2Name: file2?.name || 'Code 2',
        similarity: mockResults.similarity,
        matchingLines: mockResults.matchingLines,
        totalLines: mockResults.totalLines,
        matchedBlocks: mockResults.matchedBlocks,
      };

      setSessionHistory([historyItem, ...sessionHistory]);
      setIsAnalyzing(false);
    }, 2000);
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
      <TopToolbar
        language={language}
        onLanguageChange={setLanguage}
        onFile1Uploaded={handleFile1Upload}
        onFile2Uploaded={handleFile2Upload}
      />

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
        />
      </Box>

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
