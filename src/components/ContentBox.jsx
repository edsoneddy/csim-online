import React from "react";
import { Box, Typography } from "@mui/material";
import { DrawerHeader } from "../utils/menu";
import { useSelector } from "react-redux";
import {
  CODE_SECTION,
  CONTACT_US_SECTION,
  HELP_CENTER_SECTION,
} from "../constants/menu";
import CodeSection from "./CodeSection";

const ContentBox = () => {
  const actualContent = useSelector((state) => state.menu.actualContent);

  const getRenderContentBox = () => {
    switch (actualContent) {
      case CODE_SECTION:
        return <CodeSection />;
      case HELP_CENTER_SECTION:
        return <Typography paragraph>{actualContent}</Typography>;
      case CONTACT_US_SECTION:
        return <Typography paragraph>{actualContent}</Typography>;
      default:
        return null;
    }
  };

  return (
    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
      <DrawerHeader />
      {getRenderContentBox()}
    </Box>
  );
};

export default ContentBox;
