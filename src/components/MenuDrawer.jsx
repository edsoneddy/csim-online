import * as React from "react";
import {
  List,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  ListItem,
} from "@mui/material";

import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Mail as MailIcon,
  Help as HelpIcon,
  Code as CodeIcon,
} from "@mui/icons-material";

import {
  Drawer as CustomDrawer,
  DrawerHeader as CustomDrawerHeader,
} from "../utils/menu";
import { useDispatch, useSelector } from "react-redux";
import { changeActualContent, openSidebarMenu } from "../hooks/menuActions";

import {
  CODE_SECTION,
  CONTACT_US_SECTION,
  HELP_CENTER_SECTION,
  sections,
} from "../constants/menu";

const MenuDrawer = () => {
  const theme = useTheme();
  const open = useSelector((state) => state.menu.isOpenSidebarMenu);
  const dispatch = useDispatch();

  return (
    <CustomDrawer variant="permanent" open={open}>
      <CustomDrawerHeader>
        <IconButton
          onClick={() => {
            dispatch(openSidebarMenu());
          }}
        >
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </CustomDrawerHeader>
      <Divider />
      <List>
        <ListItem key={sections.code} disablePadding sx={{ display: "block" }}>
          <ListItemButton
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              onClick={() => {
                dispatch(changeActualContent(CODE_SECTION));
              }}
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <CodeIcon />
            </ListItemIcon>
            <ListItemText
              primary={sections.code}
              sx={{ opacity: open ? 1 : 0 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem
          key={sections.helpCenter}
          disablePadding
          sx={{ display: "block" }}
        >
          <ListItemButton
            onClick={() => {
              dispatch(changeActualContent(HELP_CENTER_SECTION));
            }}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <HelpIcon />
            </ListItemIcon>
            <ListItemText
              primary={sections.helpCenter}
              sx={{ opacity: open ? 1 : 0 }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem
          key={sections.contactUs}
          disablePadding
          sx={{ display: "block" }}
        >
          <ListItemButton
            onClick={() => {
              dispatch(changeActualContent(CONTACT_US_SECTION));
            }}
            sx={{
              minHeight: 48,
              justifyContent: open ? "initial" : "center",
              px: 2.5,
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              <MailIcon />
            </ListItemIcon>
            <ListItemText
              primary={sections.contactUs}
              sx={{ opacity: open ? 1 : 0 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </CustomDrawer>
  );
};

export default MenuDrawer;
