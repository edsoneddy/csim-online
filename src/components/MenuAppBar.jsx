import * as React from "react";
import { Typography, IconButton } from "@mui/material";
import {
  Menu as MenuIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import { AppBar as CustomAppBar } from "../utils/menu";
import { Toolbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { openSidebarMenu } from "../hooks/menuActions";

const MenuAppBar = () => {
  const open = useSelector((state) => state.menu.isOpenSidebarMenu);
  const dispatch = useDispatch();

  return (
    <CustomAppBar position="fixed" open={open}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => {
            dispatch(openSidebarMenu());
          }}
          edge="start"
          sx={{
            marginRight: 5,
            ...(open && { display: "none" }),
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Mini variant drawer
        </Typography>
        <IconButton color="inherit" aria-label="open drawer" edge="start">
          <LanguageIcon />
        </IconButton>
      </Toolbar>
    </CustomAppBar>
  );
};

export default MenuAppBar;
