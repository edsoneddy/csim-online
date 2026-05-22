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
      <>
        <CssBaseline />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
          }}
        >
          <MenuAppBar />
          <Box
            sx={{
              display: "flex",
              flex: 1,
              width: "100%",
              overflow: "hidden",
            }}
          >
            <MenuDrawer />
            <ContentBox />
          </Box>
        </Box>
      </>
    </Provider>
  );
};
export default AppContainer;
