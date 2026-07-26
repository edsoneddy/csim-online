import { IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRef, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JSZip from 'jszip';
import { MAX_FILES_IN_BULK_EDITOR } from '../../utils/table';
import { updateInfoDialog } from '../../hooks/redux/appActions';
import { SUPPORTED_EXTENSIONS } from '../../constants/ui';

const FileUploadButton = forwardRef(
  ({ onFilesSelected, disabled = false, multiple = false, icon, extensions, ...props }, ref) => {
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const filesLength = (useSelector((state) => state.fileManager.bulkEditorFiles.files) || [])
      .length;

    const readFileAsText = (fileBlob) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result || '');
        reader.onerror = (e) => reject(e);
        reader.readAsText(fileBlob);
      });
    };

    const isSupportedExtension = (fileName) => {
      const ext = `.${fileName.split('.').pop().toLowerCase()}`;
      return SUPPORTED_EXTENSIONS.includes(ext);
    };

    const extractZipFiles = async (zipFile) => {
      const zip = new JSZip();
      const zipContent = await zip.loadAsync(zipFile);
      const extractedFiles = [];

      for (const [relativePath, fileEntry] of Object.entries(zipContent.files)) {
        if (fileEntry.dir || relativePath.startsWith('__MACOSX/') || relativePath.startsWith('.')) {
          continue;
        }

        const fileName = relativePath.split('/').pop();

        if (isSupportedExtension(fileName)) {
          const content = await fileEntry.async('string');
          const blob = await fileEntry.async('blob');

          extractedFiles.push({
            name: fileName,
            content,
            size: blob.size,
            type: blob.type || 'text/plain',
          });
        }
      }

      return extractedFiles;
    };

    const handleFileChange = async (event) => {
      const selectedFiles = Array.from(event.target.files || []);

      if (selectedFiles.length === 0) return;

      try {
        let rawProcessedFiles = [];

        for (const file of selectedFiles) {
          const isZip = file.name.endsWith('.zip') || file.type === 'application/zip';

          if (isZip) {
            const unzipped = await extractZipFiles(file);
            rawProcessedFiles.push(...unzipped);
          } else if (isSupportedExtension(file.name)) {
            const content = await readFileAsText(file);
            rawProcessedFiles.push({
              name: file.name,
              content,
              size: file.size,
              type: file.type,
            });
          }
        }

        if (filesLength + rawProcessedFiles.length > MAX_FILES_IN_BULK_EDITOR) {
          dispatch(
            updateInfoDialog(
              true,
              `You can only upload a maximum of ${MAX_FILES_IN_BULK_EDITOR} files in the bulk editor.`,
              'File Upload Limit Exceeded'
            )
          );
          return;
        }

        const dateNow = new Date();
        const finalFiles = rawProcessedFiles.map((file, index) => ({
          ...file,
          id: `${file.name}_${dateNow.getTime()}_${index}`,
          date: dateNow.getTime(),
        }));

        onFilesSelected(finalFiles);
      } catch (error) {
        console.error('Error processing files:', error);
        dispatch(
          updateInfoDialog(
            true,
            'An error occurred while processing the selected files.',
            'File Upload Error',
            'An error occurred while processing the selected files.'
          )
        );
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };

    const handleButtonClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    return (
      <IconButton ref={ref} onClick={handleButtonClick} disabled={disabled} {...props}>
        {icon || <CloudUploadIcon />}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
          accept={extensions || SUPPORTED_EXTENSIONS.join(',')}
          disabled={disabled}
          multiple={multiple}
        />
      </IconButton>
    );
  }
);

FileUploadButton.displayName = 'FileUploadButton';

export default FileUploadButton;
