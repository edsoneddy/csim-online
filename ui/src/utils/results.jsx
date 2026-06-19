import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import ReportOffIcon from '@mui/icons-material/ReportOff';
import { colorPalette } from '../styles/colorPalette';

/**
 * Utility functions for interpreting and displaying analysis results.
 * Provides consistent mapping of similarity scores to colors, icons, and labels.
 */

export const getSimilarityColor = (similarity) => {
  if (similarity === null) return colorPalette.status.failed;
  if (similarity >= 75) return colorPalette.status.error;
  if (similarity >= 50) return colorPalette.status.alert;
  if (similarity >= 25) return colorPalette.status.warning;
  return colorPalette.status.success;
};

export const getSimilarityIcon = (similarity) => {
  if (similarity === null) return <ReportOffIcon sx={{ color: colorPalette.status.failed }} />;
  if (similarity >= 75) return <ErrorIcon sx={{ color: colorPalette.status.error }} />;
  if (similarity >= 50) return <WarningIcon sx={{ color: colorPalette.status.alert }} />;
  return <CheckCircleIcon sx={{ color: colorPalette.status.success }} />;
};

export const getSimilarityLabel = (similarity) => {
  if (similarity === null) return 'Analysis Failed';
  if (similarity >= 75) return 'Critical Match';
  if (similarity >= 50) return 'High Match';
  if (similarity >= 25) return 'Medium Match';
  return 'Low Match';
};
