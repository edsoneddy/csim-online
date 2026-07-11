import { Box } from '@mui/material';
import EditorToolbar from '../EditorToolbar';
import FilePanel from './FilePanel';
import MultiResultsPanel from './MultiResultsPanel';
import { EDITOR_TYPES } from '../../../utils/toolbar';

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
        <EditorToolbar orientation={{ xs: 'row', md: 'column' }} editorType={EDITOR_TYPES.BULK_EDITOR} />
        <MultiResultsPanel />
      </Box>
    </Box>
  );
};

export default BulkEditor;
