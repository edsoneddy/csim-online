import { Box, Typography, TablePagination, Paper, List } from '@mui/material';
import { colorPalette } from '../../../styles/colorPalette';
import FileTableToolbar from './FileTableToolbar';
import FileTableHeader from './FileTableHeader';
import FileTableRow from './FileTableRow';

const FileTable = ({
  selected,
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  order,
  orderBy,
  activeFilters,
  handleApplyFilter,
  handleDeleteFilter,
  handleClearAllFilters,
  handleRequestSort,
  handleSelectPageClick,
  handleSelectAllGlobalClick,
  handleClearSelection,
  visibleFiles,
  handleToggle,
  filteredFiles,
}) => {
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Paper
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          borderRadius: 0,
        }}
      >
        <FileTableToolbar
          numSelected={selected.length}
          activeFilters={activeFilters}
          onDeleteFilter={handleDeleteFilter}
          onApplyFilter={handleApplyFilter}
          onClearAllFilters={handleClearAllFilters}
        />

        <FileTableHeader
          order={order}
          orderBy={orderBy}
          onRequestSort={handleRequestSort}
          onSelectPageClick={handleSelectPageClick}
          onSelectAllGlobalClick={handleSelectAllGlobalClick}
          onClearSelection={handleClearSelection}
          numSelected={selected.length}
          totalCount={filteredFiles.length}
        />

        <Box sx={{ flexGrow: 1, overflowY: 'auto', overscrollBehavior: 'none' }}>
          <List disablePadding>
            {visibleFiles.map((file, index) => (
              <FileTableRow
                key={file.id}
                file={file}
                isSelected={selected.includes(file.name)}
                labelId={`checkbox-list-label-${index}`}
                onToggle={handleToggle(file.name)}
              />
            ))}

            {visibleFiles.length === 0 && (
              <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No files found matching the selected filters.
                </Typography>
              </Box>
            )}
          </List>
        </Box>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          component="div"
          count={filteredFiles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{
            borderTop: `1px solid ${colorPalette?.table?.divider || '#2D3748'}`,
            minHeight: '52px',
            boxSizing: 'border-box',
          }}
        />
      </Paper>
    </Box>
  );
};

export default FileTable;
