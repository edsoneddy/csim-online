import {
  Box,
  Typography,
  IconButton,
  Collapse,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { colorPalette } from '../../styles/colorPalette';
import { useDispatch, useSelector } from 'react-redux';
import { updateHistory } from '../../hooks/redux/appActions';
import {
  getSimilarityIcon,
  getSimilarityColor,
  getSimilarityIconForBulk,
} from '../../utils/results';
import { TYPE_OF_ANALYSIS } from '../../utils/toolbar';

const SessionHistory = () => {
  const [expandedId, setExpandedId] = useState(null);
  const dispatch = useDispatch();
  const history = useSelector((state) => state.history);

  const onClearHistory = (newHistory) => {
    dispatch(updateHistory(newHistory));
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleDelete = (index) => {
    const newHistory = history.filter((_, i) => i !== index);
    if (onClearHistory) onClearHistory(newHistory);
  };

  const renderBulkSummary = (item) => {
    const similarity_groups = item.similarity_groups || [];
    const unique_groups = item.unique_groups || [];
    const totalFilesFromGroups = similarity_groups.reduce((acc, group) => acc + group.length, 0);
    const uniqueFilesFromGroups = unique_groups.length;
    const totalFiles = item.bulkSummary?.totalFiles ?? item.totalFiles ?? totalFilesFromGroups;
    const uniqueFiles = item.bulkSummary?.uniqueFiles ?? uniqueFilesFromGroups;
    const copiedFiles = item.bulkSummary?.copiedFiles ?? Math.max(totalFiles - uniqueFiles, 0);

    const summary = item.bulkSummary || {
      totalFiles,
      uniqueFiles,
      copiedFiles,
      threshold: item.threshold || 0,
    };

    return [
      { label: 'Unique Files', value: summary.uniqueFiles },
      { label: 'Copied Files', value: summary.copiedFiles },
      { label: 'Threshold', value: `${summary.threshold}%` },
    ];
  };

  return (
    <Box
      sx={{
        width: 350,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: colorPalette.alpha.light,
      }}
      role="presentation"
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${colorPalette.darkMode.border}`,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Session History ({history.length})
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: colorPalette.darkMode.textSecondary,
            cursor: 'pointer',
            '&:hover': { color: colorPalette.status.error },
          }}
          onClick={() => onClearHistory?.([])}
        >
          Clear all
        </Typography>
      </Box>

      <List disablePadding sx={{ overflowY: 'auto', flexGrow: 1 }}>
        {history.map((item, index) => {
          const isBulk = item.type === TYPE_OF_ANALYSIS.BULK;
          const isExpanded = expandedId === item.id;
          const bulkSummary = isBulk ? renderBulkSummary(item) : [];
          return (
            <ListItem
              key={item.id || index}
              disablePadding
              divider
              sx={{
                flexDirection: 'column',
                alignItems: 'stretch',
                backgroundColor: isExpanded ? colorPalette.darkMode.hover : 'transparent',
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                gap={1.5}
                sx={{ py: 1, px: 2, width: '100%', boxSizing: 'border-box' }}
              >
                <ListItemIcon sx={{ minWidth: 'auto', display: 'flex' }}>
                  {isBulk
                    ? getSimilarityIconForBulk(item.success)
                    : getSimilarityIcon(item.similarity)}
                </ListItemIcon>

                <ListItemText
                  primary={
                    isBulk
                      ? `Bulk Analysis (${item.bulkSummary?.totalFiles || item.totalFiles || 0} files)`
                      : item.file1Name + ' vs ' + item.file2Name
                  }
                  secondary={new Date(item.timestamp).toLocaleTimeString()}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: 500,
                    noWrap: true,
                    sx: { maxWidth: 140 },
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    sx: { color: colorPalette.darkMode.textSecondary },
                  }}
                />

                {isBulk ? (
                  <Chip
                    label={item.success ? 'Success' : 'Failed'}
                    size="small"
                    sx={{
                      backgroundColor: colorPalette.darkMode.textSecondary,
                      color: colorPalette.neutral.white,
                      fontWeight: 600,
                      height: 20,
                      fontSize: '0.70rem',
                      ml: 'auto',
                    }}
                  />
                ) : (
                  <Chip
                    label={item.similarity !== null ? `${item.similarity.toFixed(0)}%` : 'Failed'}
                    size="small"
                    sx={{
                      backgroundColor: getSimilarityColor(item.similarity),
                      color: colorPalette.neutral.white,
                      fontWeight: 600,
                      height: 20,
                      fontSize: '0.70rem',
                      ml: 'auto',
                    }}
                  />
                )}

                <Stack direction="row" alignItems="center" gap={0.5}>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(index)}
                    sx={{
                      color: colorPalette.status.error,
                      '&:hover': { backgroundColor: colorPalette.alpha.light },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>

                  <IconButton size="small" onClick={() => toggleExpand(item.id)}>
                    <ExpandMoreIcon
                      fontSize="small"
                      sx={{
                        transition: 'transform 0.2s',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: colorPalette.darkMode.textSecondary,
                      }}
                    />
                  </IconButton>
                </Stack>
              </Stack>

              <Collapse in={isExpanded} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                <Stack sx={{ p: 2, pt: 0, gap: 1, backgroundColor: colorPalette.darkMode.hover }}>
                  {(isBulk
                    ? bulkSummary
                    : [
                        { label: 'Matching Lines', value: item.matchingLines },
                        { label: 'Total Lines', value: item.totalLines },
                        { label: 'Matched Blocks', value: item.matchedBlocks },
                      ]
                  ).map((detail, idx) => (
                    <Stack key={idx} direction="row" justifyContent="space-between">
                      <Typography
                        variant="caption"
                        sx={{ color: colorPalette.darkMode.textSecondary }}
                      >
                        {detail.label}:
                      </Typography>
                      <Typography
                        variant="caption"
                        fontWeight={600}
                        sx={{ color: colorPalette.darkMode.textPrimary }}
                      >
                        {detail.value || 0}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Collapse>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default SessionHistory;
