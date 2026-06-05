import { Box, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRef } from 'react';

const FileUploadButton = ({ onFileSelected, disabled = false }) => {
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

        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <IconButton
        onClick={() => fileInputRef.current?.click()}
        disabled={disabled}
        disableRipple
        sx={{
          '&:hover': {
            backgroundColor: 'transparent',
          },
          '&.Mui-focusVisible': {
            backgroundColor: 'transparent',
          },
          padding: 0,
        }}
      >
        <CloudUploadIcon />
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept=".js,.py,.java,.cpp,.c,.ts,.jsx,.tsx,.json,.xml,.txt,.cs,.rb,.php,.go,.rs,.swift"
          disabled={disabled}
        />
      </IconButton>
    </Box>
  );
};

export default FileUploadButton;
