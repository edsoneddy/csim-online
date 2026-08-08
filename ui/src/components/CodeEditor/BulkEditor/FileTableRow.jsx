import {
  Typography,
  ListItem,
  ListItemButton,
  ListItemIcon,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { formatBytes } from './MultiResultsPanelParts/formatters';

const FileTableRow = ({ file, isSelected, labelId, onToggle }) => {
  const theme = useTheme();

  return (
    <ListItem
      secondaryAction={
        <Typography variant="body2" color="text.secondary">
          {formatBytes(file.size)}
        </Typography>
      }
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: isSelected ? alpha(theme.palette.primary.main, 0.4) : 'background.default',
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
};

export default FileTableRow;
