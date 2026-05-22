import React from "react";
import { Box, CssBaseline } from "@mui/material";
import MenuAppBar from "./MenuAppBar";
import MenuDrawer from "./MenuDrawer";
import ContentBox from "./ContentBox";
import { Provider } from "react-redux";
import store from "../hooks/store";

const AppContainer = () => {
  return (
    <Provider store={store}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <MenuAppBar />
        <MenuDrawer />
        <ContentBox />
      </Box>
    </Provider>
  );
};
export default AppContainer;
