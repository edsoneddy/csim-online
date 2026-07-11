import { Box } from '@mui/material';
import Toolbar from '../Toolbar';
import FilePanel from './FilePanel';
import MultiResultsPanel from './MultiResultsPanel';

const BulkEditor = () => {
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
        <Toolbar orientation={{ xs: 'row', md: 'column' }} />
        <MultiResultsPanel />
      </Box>
    </Box>
  );
};

export default BulkEditor;
