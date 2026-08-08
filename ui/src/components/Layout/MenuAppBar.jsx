import { Typography, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { Menu as MenuIcon, ViewSidebar as ViewSidebarIcon } from '@mui/icons-material';
import { AppBar as CustomAppBar } from '../../utils/menu';
import { Toolbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { openHistoryMenu, openSidebarMenu } from '../../hooks/redux/appActions';
import { blurActiveElement } from '../../utils/editor';
import LanguageSwitcher from './LanguageSwitcher';
import ThemeToggle from './ThemeToggle';

const MenuAppBar = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const open = useSelector((state) => state.menu.isOpenSidebarMenu);
  const dispatch = useDispatch();

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
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            marginLeft: '32px',
            flex: 1,
            fontSize: { xs: '1rem', sm: '1.25rem' },
            fontWeight: 500,
          }}
        >
          {t('app.title')}
        </Typography>
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
