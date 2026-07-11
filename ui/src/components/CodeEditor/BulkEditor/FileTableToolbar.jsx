import { Typography, Toolbar, Popover, Box, TextField, Button, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import TooltipIconButton from '../../Common/TooltipIconButton';
import { useState } from 'react';
import { colorPalette } from '../../../styles/colorPalette';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDispatch, useSelector } from 'react-redux';
import {
  removeFilesFromBulkEditor,
  updateBulkEditorSelectedFiles,
} from '../../../hooks/redux/appActions';

const FileTableToolbar = ({
  numSelected,
  activeFilters,
  onDeleteFilter,
  onApplyFilter,
  onClearAllFilters,
  onViewSelected,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const selected = useSelector((state) => state.fileManager.bulkEditorFiles.selected);
  const dispatch = useDispatch();

  const handleOpenPopover = (event) => setAnchorEl(event.currentTarget);
  const handleClosePopover = () => {
    setAnchorEl(null);
    setInputValue('');
  };

  const isPopoverOpen = Boolean(anchorEl);

  const handleAddClick = () => {
    const cleanValue = inputValue.trim();
    if (cleanValue) {
      onApplyFilter(cleanValue);
    }
    setInputValue('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleAddClick();
    }
  };
  const handleClearSelectedFiles = () => {
    const selectedIds = selected.map((file) => file.id);
    dispatch(removeFilesFromBulkEditor(selectedIds));
    dispatch(updateBulkEditorSelectedFiles([]));
  };
  return (
    <Toolbar
      sx={{
        bgcolor: numSelected > 0 ? colorPalette.table.toolbarActive : colorPalette.table.toolbar,
        '&.MuiToolbar-root': {
          paddingLeft: '16px',
          paddingRight: '16px',
        },
      }}
      variant="dense"
    >
      <Typography sx={{ flex: '1 1 100%' }} variant={numSelected > 0 ? 'subtitle1' : 'subtitle1'}>
        {numSelected > 0 ? `${numSelected} selected` : '0 selected'}
      </Typography>
      {numSelected > 0 ? (
        <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <TooltipIconButton
            props={{ title: 'View', onClick: () => onViewSelected?.(selected) }}
            sx={{
              p: 0,
            }}
          >
            <VisibilityIcon />
          </TooltipIconButton>
          <TooltipIconButton
            props={{ title: 'Delete', onClick: handleClearSelectedFiles }}
            sx={{
              p: 0,
            }}
          >
            <DeleteIcon />
          </TooltipIconButton>
        </Box>
      ) : (
        <TooltipIconButton
          props={{ title: 'Filter', onClick: handleOpenPopover }}
          sx={{
            p: 0,
            color: isPopoverOpen || activeFilters.length > 0 ? 'primary.main' : 'text.primary',
            bgcolor: isPopoverOpen ? 'action.selected' : 'transparent',
            borderRadius: '4px',
            transition: 'all 0.2s ease',
          }}
        >
          <FilterListIcon />
        </TooltipIconButton>
      )}
      <Popover
        anchorEl={anchorEl}
        open={isPopoverOpen}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        PaperProps={{
          sx: {
            p: 2,
            width: '280px',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            maxHeight: '350px',
          },
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            size="small"
            label="Filter by name"
            variant="outlined"
            fullWidth
            autoFocus
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button
            sx={{ fontSize: '0.75rem' }}
            size="small"
            variant="contained"
            onClick={handleAddClick}
          >
            Add
          </Button>
        </Box>

        {activeFilters.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              borderTop: `1px solid ${colorPalette?.table?.divider || '#2D3748'}`,
              pt: 1.5,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: '600' }}>
              Active Filters ({activeFilters.length}):
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                flexWrap: 'wrap',
                overflowY: 'auto',
                maxHeight: '120px',
              }}
            >
              {activeFilters.map((filter, idx) => (
                <Chip
                  key={idx}
                  label={filter}
                  size="small"
                  onDelete={() => onDeleteFilter(filter)}
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            borderTop: '1px solid rgba(0, 0, 0, 0.08)',
            pt: 1,
            mt: 0.5,
            gap: 1,
          }}
        >
          <Button
            size="small"
            color="inherit"
            variant="outlined"
            onClick={onClearAllFilters}
            sx={{ fontSize: '0.75rem' }}
          >
            Clear All
          </Button>
          <Button
            size="small"
            color="inherit"
            variant="secondary"
            onClick={handleClosePopover}
            sx={{ fontSize: '0.75rem' }}
          >
            Close
          </Button>
        </Box>
      </Popover>
    </Toolbar>
  );
};

export default FileTableToolbar;
