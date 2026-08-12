import { Typography, IconButton, useMediaQuery, useTheme, Box, Chip } from '@mui/material';
import { Menu as MenuIcon, ViewSidebar as ViewSidebarIcon } from '@mui/icons-material';
import { AppBar as CustomAppBar } from '../../utils/menu';
import { Toolbar } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { openHistoryMenu, openSidebarMenu, updateCsimVersion } from '../../hooks/redux/appActions';
import { blurActiveElement } from '../../utils/editor';
import { sendGetRequest } from '../../utils/requestHandler';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

const MenuAppBar = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const open = useSelector((state) => state.menu.isOpenSidebarMenu);
  const csimVersion = useSelector((state) => state.appInfo.csimVersion);
  const dispatch = useDispatch();

  useEffect(() => {
    sendGetRequest('/api/version')
      .then((data) => dispatch(updateCsimVersion(data.csim_version)))
      .catch(() => {});
  }, [dispatch]);

  return (
    <CustomAppBar position="relative" open={open && !isMobile}>
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
          px: { xs: 1, sm: 2 },
        }}
      >
        <IconButton
          color="inherit"
          aria-label={t('layout.appBar.toggleDrawer')}
          onClick={() => {
            blurActiveElement();
            dispatch(openSidebarMenu());
          }}
          size="small"
          sx={{
            transition: 'all 0.3s ease',
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Box
          sx={{
            marginLeft: '32px',
            flex: 1,
            display: 'flex',
            alignItems: 'baseline',
            gap: 1,
            minWidth: 0,
          }}
        >
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontSize: { xs: '1rem', sm: '1.25rem' },
              fontWeight: 500,
            }}
          >
            {t('app.title')}
          </Typography>
          {csimVersion && (
            <Chip
              label={`v${csimVersion}`}
              size="small"
              variant="outlined"
              title={t('app.csimVersion', { version: csimVersion })}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                height: 20,
                color: 'text.secondary',
                borderColor: 'divider',
                fontSize: '0.7rem',
                fontWeight: 600,
                flexShrink: 0,
                '& .MuiChip-label': { px: 0.75 },
              }}
            />
          )}
        </Box>
        <LanguageSwitcher />
        <ThemeToggle />
        <IconButton
          color="inherit"
          aria-label={t('layout.appBar.openSessionHistory')}
          size="small"
          onClick={() => {
            blurActiveElement();
            dispatch(openHistoryMenu());
          }}
        >
          <ViewSidebarIcon />
        </IconButton>
      </Toolbar>
    </CustomAppBar>
  );
};

export default MenuAppBar;
