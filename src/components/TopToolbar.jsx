import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";
import {
  defaultLanguage,
  languageField,
  languageOptions,
} from "../constants/toolbar";

const TopToolbar = () => {
  const [language, setLanguage] = React.useState(defaultLanguage);

  const handleChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <Box sx={{ paddingBottom: "1em" }}>
      <FormControl>
        <InputLabel id="demo-simple-select-label">{languageField}</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={language}
          label="Language"
          onChange={handleChange}
          sx={{ minWidth: "100px" }}
        >
          {languageOptions.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default TopToolbar;
