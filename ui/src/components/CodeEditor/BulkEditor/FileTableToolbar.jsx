import { Typography, Toolbar, Popover, Box, TextField, Button, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import TooltipIconButton from '../../Common/TooltipIconButton';
import { useState } from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const theme = useTheme();
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
        bgcolor: alpha(theme.palette.primary.main, numSelected > 0 ? 0.6 : 0.4),
        '&.MuiToolbar-root': {
          paddingLeft: '16px',
          paddingRight: '16px',
        },
      }}
      variant="dense"
    >
      <Typography sx={{ flex: '1 1 100%' }} variant={numSelected > 0 ? 'subtitle1' : 'subtitle1'}>
        {numSelected > 0
          ? t('bulkEditor.fileTableToolbar.selected', { count: numSelected })
          : t('bulkEditor.fileTableToolbar.noneSelected')}
      </Typography>
      {numSelected > 0 ? (
        <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <TooltipIconButton
            props={{
              title: t('bulkEditor.fileTableToolbar.view'),
              onClick: () => onViewSelected?.(selected),
            }}
            sx={{
              p: 0,
            }}
          >
            <VisibilityIcon />
          </TooltipIconButton>
          <TooltipIconButton
            props={{
              title: t('bulkEditor.fileTableToolbar.delete'),
              onClick: handleClearSelectedFiles,
            }}
            sx={{
              p: 0,
            }}
          >
            <DeleteIcon />
          </TooltipIconButton>
        </Box>
      ) : (
        <TooltipIconButton
          props={{ title: t('bulkEditor.fileTableToolbar.filter'), onClick: handleOpenPopover }}
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
            width: { xs: 'calc(100vw - 32px)', sm: '280px' },
            maxWidth: 320,
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
            label={t('bulkEditor.fileTableToolbar.filterByName')}
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
            {t('bulkEditor.fileTableToolbar.add')}
          </Button>
        </Box>

        {activeFilters.length > 0 && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
              pt: 1.5,
            }}
          >
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: '600' }}>
              {t('bulkEditor.fileTableToolbar.activeFilters', { count: activeFilters.length })}
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
            borderTop: '1px solid',
            borderColor: 'divider',
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
            {t('bulkEditor.fileTableToolbar.clearAll')}
          </Button>
          <Button
            size="small"
            color="inherit"
            variant="text"
            onClick={handleClosePopover}
            sx={{ fontSize: '0.75rem' }}
          >
            {t('bulkEditor.fileTableToolbar.close')}
          </Button>
        </Box>
      </Popover>
    </Toolbar>
  );
};

export default FileTableToolbar;
