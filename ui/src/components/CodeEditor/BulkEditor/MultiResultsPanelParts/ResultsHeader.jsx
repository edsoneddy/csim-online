import { Box, Button, Chip, Stack, Typography } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DownloadIcon from '@mui/icons-material/Download';
import { useDispatch, useSelector } from 'react-redux';
import { updateFileManagerResultsByEditorKey } from '../../../../hooks/redux/appActions';
import TooltipIconButton from '../../../Common/TooltipIconButton';
import ClearIcon from '@mui/icons-material/Clear';
import { BULK_EDITOR_FILES_KEY } from '../../../../utils/toolbar';

const getLocalTimestampForFilename = () => {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60000;
  const localDate = new Date(now - timezoneOffsetMs);

  return localDate.toISOString().replace('T', '_').replace(/:/g, '-').slice(0, -1);
};

const ResultsHeader = ({ threshold }) => {
  const dispatch = useDispatch();
  const printable_output = useSelector(
    (state) => state.fileManager.bulkEditorFiles.results.printable_output
  );

  const handleClearResults = () => {
    dispatch(updateFileManagerResultsByEditorKey(BULK_EDITOR_FILES_KEY, null));
  };

  const handleExportResults = async () => {
    if ('showSaveFilePicker' in window) {
      try {
        const options = {
          suggestedName: `results_${getLocalTimestampForFilename()}.txt`,
          types: [
            {
              description: 'Text File',
              accept: { 'text/plain': ['.txt'] },
            },
          ],
        };

        const fileHandle = await window.showSaveFilePicker(options);
        const writable = await fileHandle.createWritable();
        await writable.write(printable_output);
        await writable.close();
        return;
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error al guardar el archivo:', error);
        }
        return;
      }
    }

    downloadFallback();
  };

  return (
    <Box
      sx={{
        p: 1.5,
        px: 2,
        backgroundColor: '#1A1F2E',
        borderBottom: '1px solid #2D3748',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 1,
        minHeight: '4em',
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
        <DescriptionIcon />
        <Typography variant="caption" sx={{ fontWeight: 600, color: '#F0F4F8', lineHeight: 1.2 }}>
          Analysis Results
        </Typography>
      </Stack>
      <Chip
        label={`Threshold ${threshold}`}
        size="small"
        variant="outlined"
        sx={{ height: 24, borderColor: '#2D3748', color: '#A0AEC0' }}
      />
      <Button
        variant="outlined"
        size="small"
        onClick={handleExportResults}
        startIcon={<DownloadIcon />}
        sx={{ textTransform: 'none', borderColor: '#2D3748', color: '#FFF' }}
      >
        Export
      </Button>
      <TooltipIconButton props={{ title: 'Clear', onClick: handleClearResults }}>
        <ClearIcon />
      </TooltipIconButton>
    </Box>
  );
};

export default ResultsHeader;
