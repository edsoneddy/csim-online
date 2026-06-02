import { Button, Box, TextField } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import React, { useRef } from 'react';

const FileUploadButton = ({ onFileSelected, label = 'Upload File', disabled = false }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onFileSelected({
          name: file.name,
          content: e.target?.result || '',
          size: file.size,
          type: file.type,
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".js,.py,.java,.cpp,.c,.ts,.jsx,.tsx,.json,.xml,.txt,.cs,.rb,.php,.go,.rs,.swift"
        disabled={disabled}
      />
      <Button
        variant="outlined"
        startIcon={<CloudUploadIcon />}
        onClick={() => fileInputRef.current?.click()}
        size="small"
        disabled={disabled}
        sx={{
          textTransform: 'none',
          fontWeight: 500,
        }}
      >
        {label}
      </Button>
    </Box>
  );
};

export default FileUploadButton;
