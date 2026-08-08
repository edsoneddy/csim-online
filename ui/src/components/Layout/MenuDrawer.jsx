import {
  List,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  ListItem,
  Drawer as MuiDrawer,
} from '@mui/material';

import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Mail as MailIcon,
  Help as HelpIcon,
  Code as CodeIcon,
} from '@mui/icons-material';

import { Drawer as CustomDrawer, DrawerHeader as CustomDrawerHeader } from '../../utils/menu';
import { useDispatch, useSelector } from 'react-redux';
import { changeActualContent, openSidebarMenu } from '../../hooks/redux/appActions';

import {
  CODE_SECTION,
  CONTACT_US_SECTION,
  HELP_CENTER_SECTION,
  drawerWidth,
  sections,
} from '../../constants/ui';

const MenuDrawer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const open = useSelector((state) => state.menu.isOpenSidebarMenu);
  const dispatch = useDispatch();

  const handleToggle = () => {
    dispatch(openSidebarMenu());
  };

  const handleNavigate = (section) => {
    dispatch(changeActualContent(section));
    if (isMobile) handleToggle();
  };

  const drawerContent = (
    <>
      <CustomDrawerHeader>
        <IconButton onClick={handleToggle}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </CustomDrawerHeader>
      <Divider />
      <List>
        <ListItem key={sections.code} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => handleNavigate(CODE_SECTION)}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <CodeIcon />
            </ListItemIcon>
            <ListItemText primary={sections.code} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem key={sections.helpCenter} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => handleNavigate(HELP_CENTER_SECTION)}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <HelpIcon />
            </ListItemIcon>
            <ListItemText primary={sections.helpCenter} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
        <ListItem key={sections.contactUs} disablePadding sx={{ display: 'block' }}>
          <ListItemButton
            onClick={() => handleNavigate(CONTACT_US_SECTION)}
            sx={{
              minHeight: 48,
              justifyContent: open ? 'initial' : 'center',
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : 'auto',
                justifyContent: 'center',
              }}
            >
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary={sections.contactUs} sx={{ opacity: open ? 1 : 0 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </>
  );

  if (isMobile) {
    return (
      <MuiDrawer
        variant="temporary"
        open={open}
        onClose={handleToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </MuiDrawer>
    );
  }

  return (
    <CustomDrawer variant="permanent" open={open}>
      {drawerContent}
    </CustomDrawer>
  );
};

export default MenuDrawer;
