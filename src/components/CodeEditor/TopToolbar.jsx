import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import { languageField, languageOptions } from '../../constants/ui';

const TopToolbar = ({ language, onLanguageChange }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleChange = (event) => {
    onLanguageChange(event.target.value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <FormControl size={isMobile ? 'small' : 'medium'} sx={{ minWidth: 120 }}>
        <InputLabel id="language-select-label">{languageField}</InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={language}
          label={languageField}
          onChange={handleChange}
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
