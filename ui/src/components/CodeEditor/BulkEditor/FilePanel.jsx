import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import TooltipIconButton from '../../Common/TooltipIconButton';
import FileUploadButton from '../../Common/FileUploadButton';
import { useMemo, useState } from 'react';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import FileTable from './FileTable';
import FileViewerDialog from './FileViewerDialog';
import { getComparator } from '../../../utils/table';
import { useDispatch, useSelector } from 'react-redux';
import {
  addFilesToBulkEditor,
  updateBulkEditorSelectedFiles,
} from '../../../hooks/redux/appActions';

const FilePanel = () => {
  const totalFiles = useSelector((state) => state.fileManager.bulkEditorFiles.files);
  const selected = useSelector((state) => state.fileManager.bulkEditorFiles.selected);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('name');
  const [activeFilters, setActiveFilters] = useState([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerFiles, setViewerFiles] = useState([]);
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

  const handleViewSelected = (filesToView) => {
    if (!filesToView || filesToView.length === 0) return;
    setViewerFiles(filesToView);
    setIsViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setIsViewerOpen(false);
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
        backgroundColor: '#0F1419',
        border: '1px solid #2D3748',
      }}
    >
      <Box
        sx={{
          p: 1.5,
          backgroundColor: '#1A1F2E',
          borderBottom: '1px solid #2D3748',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
          height: '4em',
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1 }}>
          <FolderOpenIcon />
          <Typography variant="caption" sx={{ fontWeight: 600, color: '#F0F4F8' }}>
            {'Files Manager'}
          </Typography>
        </Stack>
        <Chip
          label={`${totalFiles.length} Total Files`}
          size="small"
          variant="outlined"
          sx={{ height: 24, borderColor: '#2D3748', color: '#A0AEC0' }}
        />
        <TooltipIconButton props={{ title: 'Upload' }} asChild>
          <FileUploadButton onFilesSelected={handleFileUploaded} multiple />
        </TooltipIconButton>
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
          onViewSelected={handleViewSelected}
        />
      </Box>

      <FileViewerDialog open={isViewerOpen} onClose={handleCloseViewer} files={viewerFiles} />
    </Paper>
  );
};

export default FilePanel;
