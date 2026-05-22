import { Stack, Button } from "@mui/material";
import React from "react";

const BottomToolbar = () => {
  return (
    <Stack spacing={2} direction="row" sx={{ paddingTop: "1em" }}>
      <Button variant="contained" sx={{ textTransform: "none" }}>
        Analize
      </Button>
      <Button variant="outlined" sx={{ textTransform: "none" }}>
        Clean Up
      </Button>
    </Stack>
  );
};

export default BottomToolbar;
