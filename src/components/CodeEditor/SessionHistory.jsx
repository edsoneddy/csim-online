import {
  Box,
  Paper,
  Typography,
  Stack,
  IconButton,
  Collapse,
  Divider,
  Chip,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import React, { useState } from 'react';
import { colorPalette } from '../../styles/colorPalette';

const SessionHistory = ({ history = [], onClearHistory }) => {
  const [expandedId, setExpandedId] = useState(null);
  const theme = useTheme();

  if (!history || history.length === 0) {
    return (
      <Paper
        sx={{
          p: 2,
          textAlign: 'center',
          backgroundColor: colorPalette.alpha.light,
          border: `1px dashed ${colorPalette.darkMode.border}`,
        }}
      >
        <Typography variant="body2" sx={{ color: colorPalette.darkMode.textSecondary }}>
          No analysis history yet. Load files and click "Analyze" to start.
        </Typography>
      </Paper>
    );
  }

  const getSimilarityColor = (similarity) => {
    if (similarity >= 75) return colorPalette.status.error;
    if (similarity >= 50) return colorPalette.status.alert;
    if (similarity >= 25) return colorPalette.status.warning;
    return colorPalette.status.success;
  };

  const getSimilarityIcon = (similarity) => {
    if (similarity >= 75)
      return <ErrorIcon sx={{ color: colorPalette.status.error, fontSize: 18 }} />;
    if (similarity >= 50)
      return <WarningIcon sx={{ color: colorPalette.status.alert, fontSize: 18 }} />;
    return <CheckCircleIcon sx={{ color: colorPalette.status.success, fontSize: 18 }} />;
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    if (onClearHistory) {
      onClearHistory(newHistory);
    }
  };

  return (
    <Paper sx={{ backgroundColor: colorPalette.alpha.light }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${colorPalette.darkMode.border}`,
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Session History ({history.length})
        </Typography>
        {history.length > 0 && (
          <Typography
            variant="caption"
            sx={{ color: colorPalette.darkMode.textSecondary, cursor: 'pointer' }}
            onClick={() => onClearHistory?.([])}
          >
            Clear all
          </Typography>
        )}
      </Box>

      <Stack spacing={1} sx={{ p: 1 }}>
        {history.map((item, index) => (
          <Box key={index}>
            <Paper
              sx={{
                p: 1.5,
                backgroundColor: colorPalette.darkMode.hover,
                border: `1px solid ${colorPalette.darkMode.border}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: colorPalette.darkMode.border,
                  borderColor: colorPalette.primary.main,
                },
              }}
              onClick={() => toggleExpand(item.id)}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                  {getSimilarityIcon(item.similarity)}

                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="body2" sx={{ fontWeight: 500 }} noWrap>
                        {item.file1Name} vs {item.file2Name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: colorPalette.darkMode.textSecondary }}
                      >
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Stack>
                  </Box>

                  <Chip
                    label={`${item.similarity.toFixed(1)}%`}
                    sx={{
                      backgroundColor: getSimilarityColor(item.similarity),
                      color: colorPalette.neutral.white,
                      fontWeight: 600,
                      minWidth: 70,
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                    sx={{
                      color: colorPalette.status.error,
                      '&:hover': { backgroundColor: colorPalette.alpha.light },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <ExpandMoreIcon
                    sx={{
                      fontSize: 18,
                      transition: 'transform 0.3s',
                      transform: expandedId === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </Box>
              </Box>

              <Collapse in={expandedId === item.id}>
                <Box
                  sx={{ mt: 1.5, pt: 1.5, borderTop: `1px solid ${colorPalette.darkMode.border}` }}
                >
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{
                              border: 'none',
                              color: colorPalette.darkMode.textSecondary,
                              py: 0.5,
                            }}
                          >
                            Matching Lines:
                          </TableCell>
                          <TableCell
                            sx={{
                              border: 'none',
                              color: colorPalette.darkMode.textPrimary,
                              fontWeight: 600,
                              py: 0.5,
                            }}
                          >
                            {item.matchingLines || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              border: 'none',
                              color: colorPalette.darkMode.textSecondary,
                              py: 0.5,
                            }}
                          >
                            Total Lines:
                          </TableCell>
                          <TableCell
                            sx={{
                              border: 'none',
                              color: colorPalette.darkMode.textPrimary,
                              fontWeight: 600,
                              py: 0.5,
                            }}
                          >
                            {item.totalLines || 0}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell
                            sx={{
                              border: 'none',
                              color: colorPalette.darkMode.textSecondary,
                              py: 0.5,
                            }}
                          >
                            Matched Blocks:
                          </TableCell>
                          <TableCell
                            sx={{
                              border: 'none',
                              color: colorPalette.darkMode.textPrimary,
                              fontWeight: 600,
                              py: 0.5,
                            }}
                          >
                            {item.matchedBlocks || 0}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Collapse>
            </Paper>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
};

export default SessionHistory;
