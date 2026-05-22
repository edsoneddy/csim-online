import { Box, Paper, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import TopToolbar from './TopToolbar';
import BottomToolbar from './BottomToolbar';
import { defaultLanguage } from '../../constants/ui';

const CodeSection = () => {
  const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [language, setLanguage] = useState(defaultLanguage);
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
        <Paper
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 3,
          }}
        >
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code1}
            options={editorOptions}
            onChange={(value) => setCode1(value || '')}
          />
        </Paper>
        <Paper
          sx={{
            width: '100%',
            height: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 3,
          }}
        >
          <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code2}
            options={editorOptions}
            onChange={(value) => setCode2(value || '')}
          />
        </Paper>
      </Box>
      <BottomToolbar />
    </Box>
  );
};

export default CodeSection;
