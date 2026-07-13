import {
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { colorPalette } from '../../../styles/colorPalette';
import { formatBytes } from './MultiResultsPanelParts/formatters';

const FileTableRow = ({ file, isSelected, labelId, onToggle }) => (
  <ListItem
    secondaryAction={
      <Typography variant="body2" color="text.secondary">
        {formatBytes(file.size)}
      </Typography>
    }
    sx={{
      borderBottom: `1px solid ${colorPalette?.table?.divider || '#2D3748'}`,
      backgroundColor: isSelected
        ? colorPalette?.table?.selectedRow || '#1A1F2E'
        : colorPalette?.table?.row || '#0F1419',
      '&.Mui-selected .MuiListItemText-primary': { fontWeight: 'inherit' },
    }}
    disablePadding
  >
    <ListItemButton role={undefined} onClick={onToggle} dense>
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={isSelected}
          tabIndex={-1}
          disableRipple
          inputProps={{ 'aria-labelledby': labelId }}
        />
      </ListItemIcon>
      <ListItemText id={labelId} primary={file.name} />
    </ListItemButton>
  </ListItem>
);

export default FileTableRow;
