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

const SessionHistory = ({ history = [], onClearHistory }) => {
  const [expandedId, setExpandedId] = useState(null);
  const theme = useTheme();

  if (!history || history.length === 0) {
    return (
      <Paper
        sx={{
          p: 2,
          textAlign: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          No analysis history yet. Load files and click "Analyze" to start.
        </Typography>
      </Paper>
    );
  }

  const getSimilarityColor = (similarity) => {
    if (similarity >= 75) return '#ff6b6b'; // Red
    if (similarity >= 50) return '#ffa500'; // Orange
    if (similarity >= 25) return '#ffd700'; // Yellow
    return '#4caf50'; // Green
  };

  const getSimilarityIcon = (similarity) => {
    if (similarity >= 75) return <ErrorIcon sx={{ color: '#ff6b6b', fontSize: 18 }} />;
    if (similarity >= 50) return <WarningIcon sx={{ color: '#ffa500', fontSize: 18 }} />;
    return <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 18 }} />;
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    // Update parent history
    if (onClearHistory) {
      onClearHistory(newHistory);
    }
  };

  return (
    <Paper sx={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Session History ({history.length})
        </Typography>
        {history.length > 0 && (
          <Typography
            variant="caption"
            sx={{ color: 'rgba(255, 255, 255, 0.5)', cursor: 'pointer' }}
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
                backgroundColor: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.15)',
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
                        sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Stack>
                  </Box>

                  <Chip
                    label={`${item.similarity.toFixed(1)}%`}
                    sx={{
                      backgroundColor: getSimilarityColor(item.similarity),
                      color: '#fff',
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
                      color: '#ff6b6b',
                      '&:hover': { backgroundColor: 'rgba(255, 107, 107, 0.1)' },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  <ExpandMoreIcon
                    sx={{
                      fontSize: 18,
                      transition: 'transform 0.3s',
                      transform:
                        expandedId === item.id ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                  />
                </Box>
              </Box>

              <Collapse in={expandedId === item.id}>
                <Box sx={{ mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell
                            sx={{
                              border: 'none',
                              color: 'rgba(255, 255, 255, 0.6)',
                              py: 0.5,
                            }}
                          >
                            Matching Lines:
                          </TableCell>
                          <TableCell
                            sx={{
                              border: 'none',
                              color: '#fff',
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
                              color: 'rgba(255, 255, 255, 0.6)',
                              py: 0.5,
                            }}
                          >
                            Total Lines:
                          </TableCell>
                          <TableCell
                            sx={{
                              border: 'none',
                              color: '#fff',
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
                              color: 'rgba(255, 255, 255, 0.6)',
                              py: 0.5,
                            }}
                          >
                            Matched Blocks:
                          </TableCell>
                          <TableCell
                            sx={{
                              border: 'none',
                              color: '#fff',
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
