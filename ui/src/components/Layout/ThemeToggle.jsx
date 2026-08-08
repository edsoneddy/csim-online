import { useState } from 'react';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import {
  LightMode as LightModeIcon,
  DarkMode as DarkModeIcon,
  SettingsBrightness as SystemModeIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../../theme/ThemeModeContext';

const MODE_ICONS = {
  light: LightModeIcon,
  dark: DarkModeIcon,
  system: SystemModeIcon,
};

const MODES = ['light', 'dark', 'system'];

const ThemeToggle = () => {
  const { t } = useTranslation();
  const { mode, setMode } = useThemeMode();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (nextMode) => {
    setMode(nextMode);
    handleClose();
  };

  const ActiveIcon = MODE_ICONS[mode];

  return (
    <>
      <IconButton
        color="inherit"
        size="small"
        onClick={handleOpen}
        aria-label={`${t('theme.switcherLabel')}: ${t(`theme.modes.${mode}`)}`}
        aria-haspopup="menu"
        aria-controls={open ? 'theme-switcher-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
      >
        <ActiveIcon fontSize="small" />
      </IconButton>
      <Menu
        id="theme-switcher-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-label': t('theme.switcherLabel') }}
      >
        {MODES.map((option) => {
          const OptionIcon = MODE_ICONS[option];
          return (
            <MenuItem key={option} selected={option === mode} onClick={() => handleSelect(option)}>
              <ListItemIcon>
                <OptionIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>{t(`theme.modes.${option}`)}</ListItemText>
              {option === mode && <CheckIcon fontSize="small" color="primary" sx={{ ml: 2 }} />}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default ThemeToggle;
