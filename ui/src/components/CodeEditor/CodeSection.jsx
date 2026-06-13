import { useState } from 'react';
import { Box } from '@mui/material';
import CodeTabsHeader from './CodeTabsHeader';
import CodeTabPanel from './CodeTabPanel';
import DualEditor from './DualEditor';
import BulkEditor from './BulkEditor';

const CodeSection = () => {
  const [currentTab, setCurrentTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        width: '100%',
        height: 'calc(100vh - 64px)',
        borderRadius: 1,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CodeTabsHeader value={currentTab} onChange={handleTabChange} />

      <Box sx={{ flex: 1, minHeight: 0 }}>
        <CodeTabPanel value={currentTab} index={0}>
          <DualEditor handleUpdateHistory={() => {}} />
        </CodeTabPanel>

        <CodeTabPanel value={currentTab} index={1}>
          <BulkEditor />
        </CodeTabPanel>
      </Box>
    </Box>
  );
};

export default CodeSection;
