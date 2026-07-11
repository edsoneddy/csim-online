import { useState } from 'react';
import { Box, ListItemIcon, Checkbox, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import TableSortLabel from '@mui/material/TableSortLabel';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { colorPalette } from '../../../styles/colorPalette';

const FileTableHeader = ({
  order,
  orderBy,
  onRequestSort,
  onSelectPageClick,
  onSelectAllGlobalClick,
  onClearSelection,
  numSelected,
  totalCount,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSelectAllGlobal = () => {
    onSelectAllGlobalClick();
    handleMenuClose();
  };

  const handleClear = () => {
    onClearSelection();
    handleMenuClose();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '46px',
        px: 2,
        borderBottom: `2px solid ${colorPalette?.table?.divider || '#2D3748'}`,
        boxSizing: 'border-box',
        bgcolor: colorPalette?.table?.header || '#1A1F2E',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <ListItemIcon sx={{ minWidth: '56px', display: 'flex', alignItems: 'center' }}>
          <Checkbox
            edge="start"
            disableRipple
            onChange={onSelectPageClick}
            indeterminate={numSelected > 0 && numSelected < totalCount}
            checked={totalCount > 0 && numSelected === totalCount}
            inputProps={{ 'aria-label': 'select files' }}
          />
          <IconButton
            size="small"
            onClick={handleMenuOpen}
            sx={{
              padding: 0,
              marginLeft: '-3px',
              color: 'text.secondary',
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <ArrowDropDownIcon fontSize="small" />
          </IconButton>
        </ListItemIcon>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          <MenuItem onClick={handleSelectAllGlobal}>Select all files ({totalCount})</MenuItem>
          <MenuItem onClick={handleClear} disabled={numSelected === 0}>
            None
          </MenuItem>
        </Menu>

        <TableSortLabel
          active={orderBy === 'name'}
          direction={orderBy === 'name' ? order : 'asc'}
          onClick={() => onRequestSort('name')}
          sx={{ fontWeight: '600', '& .MuiTableSortLabel-icon': { color: 'text.secondary' } }}
        >
          <Typography variant="body2" sx={{ fontWeight: '600', color: 'text.primary' }}>
            File Name
          </Typography>
        </TableSortLabel>
      </Box>

      <Typography variant="body2" sx={{ fontWeight: '600', color: 'text.primary', pr: 1 }}>
        File Size
      </Typography>
    </Box>
  );
};

export default FileTableHeader;
