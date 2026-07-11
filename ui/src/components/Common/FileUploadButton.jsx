import { IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRef, forwardRef } from 'react';

const FileUploadButton = forwardRef(
  ({ onFilesSelected, disabled = false, multiple = false, ...props }, ref) => {
    const fileInputRef = useRef(null);

    const handleFileChange = async (event) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      const filePromises = Array.from(files).map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          const dateNow = new Date();
          reader.onload = (e) => {
            resolve({
              id: `${file.name}_${dateNow.getTime()}`,
              date: dateNow.getTime(),
              name: file.name,
              content: e.target?.result || '',
              size: file.size,
              type: file.type,
            });
          };
          reader.readAsText(file);
        });
      });

      const processedFiles = await Promise.all(filePromises);

      onFilesSelected(processedFiles);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
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
          accept=".py"
          disabled={disabled}
          multiple={multiple}
        />
      </IconButton>
    );
  }
);

FileUploadButton.displayName = 'FileUploadButton';

export default FileUploadButton;
