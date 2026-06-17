import { Typography, IconButton } from '@mui/material';
import { Menu as MenuIcon, ViewSidebar as ViewSidebarIcon } from '@mui/icons-material';
import { AppBar as CustomAppBar } from '../../utils/menu';
import { Toolbar } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { openHistoryMenu, openSidebarMenu } from '../../hooks/redux/menuActions';

const MenuAppBar = () => {
  const open = useSelector((state) => state.menu.isOpenSidebarMenu);
  const dispatch = useDispatch();

  return (
    <CustomAppBar position="relative" open={open}>
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
          aria-label="toggle drawer"
          onClick={() => {
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
          CSIM Online
        </Typography>
        <IconButton
          color="inherit"
          aria-label="language selector"
          size="small"
          onClick={() => {
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
