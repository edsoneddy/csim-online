import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import TooltipIconButton from '../../Common/TooltipIconButton';
import FileUploadButton from '../../Common/FileUploadButton';
import { useMemo, useState } from 'react';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FileTable from './FileTable';
import { getComparator } from '../../../utils/table';
import { useDispatch, useSelector } from 'react-redux';
import {
  addFilesToBulkEditor,
  updateBulkEditorSelectedFiles,
} from '../../../hooks/redux/appActions';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import { SUPPORTED_COMPRESSED_EXTENSIONS } from '../../../constants/ui';

const FilePanel = ({ onViewSelected }) => {
  const totalFiles = useSelector((state) => state.fileManager.bulkEditorFiles.files);
  const selected = useSelector((state) => state.fileManager.bulkEditorFiles.selected);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [activeFilters, setActiveFilters] = useState([]);
  const dispatch = useDispatch();

  const handleFileUploaded = (files) => {
    dispatch(addFilesToBulkEditor(files));
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleApplyFilter = (newFilterToken) => {
    if (!activeFilters.includes(newFilterToken)) {
      setActiveFilters([...activeFilters, newFilterToken]);
      setPage(0);
      dispatch(updateBulkEditorSelectedFiles([]));
    }
  };

  const handleDeleteFilter = (filterToDelete) => {
    setActiveFilters(activeFilters.filter((f) => f !== filterToDelete));
    setPage(0);
  };

  const filteredFiles = useMemo(() => {
    if (activeFilters.length === 0) return totalFiles;
    return totalFiles.filter((file) =>
      activeFilters.some((filter) => file.name.toLowerCase().includes(filter.toLowerCase()))
    );
  }, [totalFiles, activeFilters]);

  const visibleFiles = useMemo(() => {
    return [...filteredFiles]
      .sort(getComparator(order, orderBy))
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredFiles, order, orderBy, page, rowsPerPage]);

  const handleToggle = (file) => () => {
    const currentIndex = selected.findIndex((f) => f.name === file.name);
    const newSelected = [...selected];
    if (currentIndex === -1) newSelected.push(file);
    else newSelected.splice(currentIndex, 1);
    dispatch(updateBulkEditorSelectedFiles(newSelected));
  };

  const handleSelectPageClick = () => {
    if (selected.length > 0) {
      dispatch(updateBulkEditorSelectedFiles([]));
    } else {
      dispatch(updateBulkEditorSelectedFiles(visibleFiles));
    }
  };

  const handleClearAllFilters = () => {
    setActiveFilters([]);
    setPage(0);
  };

  return (
    <Paper
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
        backgroundColor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        sx={{
          p: 1.5,
          backgroundColor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          rowGap: 1,
          gap: 1,
          minHeight: '4em',
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ flex: '1 1 auto', minWidth: 0 }}
        >
          <FolderOpenIcon />
          <Typography variant="caption" noWrap sx={{ fontWeight: 600, color: 'text.primary' }}>
            {'File Manager'}
          </Typography>
        </Stack>
        <Chip
          label={`${totalFiles.length} Total Files`}
          size="small"
          variant="outlined"
          sx={{ height: 24, borderColor: 'divider', color: 'text.secondary', flexShrink: 0 }}
        />
        <Stack direction="row" sx={{ flexShrink: 0 }}>
          <TooltipIconButton props={{ title: 'Upload Files' }} asChild>
            <FileUploadButton onFilesSelected={handleFileUploaded} multiple />
          </TooltipIconButton>
          <TooltipIconButton props={{ title: 'Upload Zip File' }} asChild>
            <FileUploadButton
              onFilesSelected={handleFileUploaded}
              icon={<FolderZipIcon />}
              extensions={SUPPORTED_COMPRESSED_EXTENSIONS.join(',')}
            />
          </TooltipIconButton>
        </Stack>
      </Box>

      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <FileTable
          page={page}
          setPage={setPage}
          rowsPerPage={rowsPerPage}
          setRowsPerPage={setRowsPerPage}
          order={order}
          orderBy={orderBy}
          activeFilters={activeFilters}
          handleApplyFilter={handleApplyFilter}
          handleDeleteFilter={handleDeleteFilter}
          handleClearAllFilters={handleClearAllFilters}
          handleRequestSort={handleRequestSort}
          handleSelectPageClick={handleSelectPageClick}
          visibleFiles={visibleFiles}
          handleToggle={handleToggle}
          filteredFiles={filteredFiles}
          handleSelectAllGlobalClick={() => dispatch(updateBulkEditorSelectedFiles(filteredFiles))}
          handleClearSelection={() => dispatch(updateBulkEditorSelectedFiles([]))}
          onViewSelected={onViewSelected}
        />
      </Box>
    </Paper>
  );
};

export default FilePanel;
