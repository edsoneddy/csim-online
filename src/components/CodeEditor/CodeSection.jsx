import { Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import TopToolbar from './TopToolbar';
import BottomToolbar from './BottomToolbar';
import EditorPanel from './EditorPanel';
import ResultsPanel from './ResultsPanel';
import { defaultLanguage } from '../../constants/ui';

const CodeSection = () => {
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [language, setLanguage] = useState(defaultLanguage);
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [results, setResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  const handleFile1Upload = (fileData) => {
    setFile1(fileData);
    setCode1(fileData.content);
  };

  const handleFile2Upload = (fileData) => {
    setFile2(fileData);
    setCode2(fileData.content);
  };

  const handleClearEditor1 = () => {
    setFile1(null);
    setCode1('');
  };

  const handleClearEditor2 = () => {
    setFile2(null);
    setCode2('');
  };

  const handleClearAll = () => {
    setFile1(null);
    setFile2(null);
    setCode1('');
    setCode2('');
    setResults(null);
  };

  const handleAnalyze = () => {
    if (!code1 || !code2) return;
    
    setIsAnalyzing(true);
    // Simular análisis - más adelante aquí irá la lógica real
    setTimeout(() => {
      const mockResults = {
        similarity: Math.random() * 100,
        matchingLines: Math.floor(Math.random() * 50),
        totalLines: Math.max(code1.split('\n').length, code2.split('\n').length),
        uniqueBlocks: Math.floor(Math.random() * 20),
        matchedBlocks: Math.floor(Math.random() * 10),
        details: 'Analysis completed. Check the highlighted sections in the editors.',
      };
      setResults(mockResults);
      setIsAnalyzing(false);
    }, 2000);
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
          onChange={setCode1}
          language={language}
          fileName={file1?.name}
          fileSize={file1?.size}
          editorOptions={editorOptions}
          onClear={file1 ? handleClearEditor1 : undefined}
        />
        <EditorPanel
          value={code2}
          onChange={setCode2}
          language={language}
          fileName={file2?.name}
          fileSize={file2?.size}
          editorOptions={editorOptions}
          onClear={file2 ? handleClearEditor2 : undefined}
        />
      </Box>

      <ResultsPanel results={results} isAnalyzing={isAnalyzing} />
      
      <BottomToolbar 
        onAnalyze={handleAnalyze}
        onClear={handleClearAll}
        canAnalyze={canAnalyze}
        isAnalyzing={isAnalyzing}
      />
    </Box>
  );
};

export default CodeSection;
