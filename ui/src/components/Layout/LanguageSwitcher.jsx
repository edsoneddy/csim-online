import { useState } from 'react';
import { Badge, IconButton, Menu, MenuItem, ListItemText } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';
import LanguageIcon from '@mui/icons-material/Language';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../i18n';

const LanguageSwitcher = () => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const activeLanguage = i18n.resolvedLanguage || i18n.language;

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (code) => {
    if (code !== activeLanguage) {
      i18n.changeLanguage(code);
    }
    handleClose();
  };

  return (
    <>
      <IconButton
        color="inherit"
        size="small"
        onClick={handleOpen}
        aria-label={`${t('language.switcherLabel')}: ${t(`language.names.${activeLanguage}`)}`}
        aria-haspopup="menu"
        aria-controls={open ? 'language-switcher-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
      >
        <Badge
          badgeContent={activeLanguage.toUpperCase()}
          color="primary"
          overlap="circular"
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.5rem',
              height: 14,
              minWidth: 14,
              padding: '0 3px',
            },
          }}
        >
          <LanguageIcon fontSize="small" />
        </Badge>
      </IconButton>
      <Menu
        id="language-switcher-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{ 'aria-label': t('language.switcherLabel') }}
      >
        {SUPPORTED_LANGUAGES.map((code) => (
          <MenuItem
            key={code}
            selected={code === activeLanguage}
            onClick={() => handleSelect(code)}
          >
            {code === activeLanguage && (
              <CheckIcon fontSize="small" sx={{ mr: 1 }} color="primary" />
            )}
            <ListItemText inset={code !== activeLanguage}>
              {t(`language.names.${code}`)}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSwitcher;
