import { IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRef, forwardRef } from 'react';

const FileUploadButton = forwardRef(({ onFileSelected, disabled = false, ...props }, ref) => {
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

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <IconButton ref={ref} onClick={handleButtonClick} disabled={disabled} {...props}>
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
  );
});

FileUploadButton.displayName = 'FileUploadButton';

export default FileUploadButton;
