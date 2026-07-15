import { IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRef, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MAX_FILES_IN_BULK_EDITOR } from '../../utils/table';
import { updateErrorDialog } from '../../hooks/redux/appActions';
import { SUPPORTED_EXTENSIONS } from '../../constants/ui';

const FileUploadButton = forwardRef(
  ({ onFilesSelected, disabled = false, multiple = false, ...props }, ref) => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const filesLength = (useSelector((state) => state.fileManager.bulkEditorFiles.files) || [])
      .length;

    const handleFileChange = async (event) => {
      const files = event.target.files;
      if (!files || files.length === 0) return;

      if (filesLength + files.length > MAX_FILES_IN_BULK_EDITOR) {
        dispatch(
          updateErrorDialog(true, 'You can only upload a maximum of 50 files in the bulk editor.')
        );
        return;
      }

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
          accept={SUPPORTED_EXTENSIONS.join(',')}
          disabled={disabled}
          multiple={multiple}
        />
      </IconButton>
    );
  }
);

FileUploadButton.displayName = 'FileUploadButton';

export default FileUploadButton;
