import React from 'react';
import { TextField } from '@mui/material';

const FormField = ({
  label,
  name,
  value,
  onChange,
  error,
  helperText,
  placeholder,
  disabled,
  multiline = false,
  rows = 1,
  type = 'text',
  fullWidth = true,
  variant = 'outlined',
}) => {
  return (
    <TextField
      fullWidth={fullWidth}
      label={label}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      variant={variant}
      error={!!error}
      helperText={error || helperText}
      placeholder={placeholder}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
    />
  );
};

export default FormField;
