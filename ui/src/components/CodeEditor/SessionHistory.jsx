import {
  Box,
  Typography,
  IconButton,
  Button,
  Collapse,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Stack,
  useTheme,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateHistory } from '../../hooks/redux/appActions';
import {
  getSimilarityIcon,
  getSimilarityColor,
  getSimilarityIconForBulk,
} from '../../utils/results';
import { TYPE_OF_ANALYSIS } from '../../utils/toolbar';

const SessionHistory = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
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
      { label: t('sessionHistory.uniqueFiles'), value: summary.uniqueFiles },
      { label: t('sessionHistory.copiedFiles'), value: summary.copiedFiles },
      { label: t('sessionHistory.threshold'), value: `${summary.threshold}` },
    ];
  };

  return (
    <Box
      sx={{
        width: { xs: '85vw', sm: 350 },
        maxWidth: 350,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
      }}
      role="presentation"
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {t('sessionHistory.title', { count: history.length })}
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={() => onClearHistory?.([])}
          sx={{
            minWidth: 0,
            p: 0,
            textTransform: 'none',
            fontSize: '0.75rem',
            fontWeight: 400,
            color: 'text.secondary',
            '&:hover': { color: 'error.main', backgroundColor: 'transparent' },
          }}
        >
          {t('sessionHistory.clearAll')}
        </Button>
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
                backgroundColor: isExpanded ? 'action.selected' : 'transparent',
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
                      ? t('sessionHistory.bulkAnalysis', {
                          count: item.bulkSummary?.totalFiles || item.totalFiles || 0,
                        })
                      : t('sessionHistory.comparison', {
                          file1: item.file1Name,
                          file2: item.file2Name,
                        })
                  }
                  secondary={new Intl.DateTimeFormat(i18n.resolvedLanguage || i18n.language, {
                    timeStyle: 'short',
                  }).format(new Date(item.timestamp))}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: 500,
                    noWrap: true,
                    sx: { maxWidth: 140 },
                  }}
                  secondaryTypographyProps={{
                    variant: 'caption',
                    sx: { color: 'text.secondary' },
                  }}
                />

                {isBulk ? (
                  <Chip
                    label={item.success ? t('sessionHistory.success') : t('sessionHistory.failed')}
                    size="small"
                    sx={{
                      backgroundColor: item.success ? 'success.main' : 'error.main',
                      color: theme.palette.common.white,
                      fontWeight: 600,
                      height: 20,
                      fontSize: '0.70rem',
                      ml: 'auto',
                    }}
                  />
                ) : (
                  <Chip
                    label={
                      item.similarity !== null
                        ? `${item.similarity.toFixed(0)}%`
                        : t('sessionHistory.failed')
                    }
                    size="small"
                    sx={{
                      backgroundColor: getSimilarityColor(item.similarity),
                      color: theme.palette.common.white,
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
                    aria-label={t('sessionHistory.deleteItem')}
                    sx={{
                      color: 'error.main',
                      '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.1) },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={() => toggleExpand(item.id)}
                    aria-label={
                      isExpanded
                        ? t('sessionHistory.collapseDetails')
                        : t('sessionHistory.expandDetails')
                    }
                    aria-expanded={isExpanded}
                  >
                    <ExpandMoreIcon
                      fontSize="small"
                      sx={{
                        transition: 'transform 0.2s',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        color: 'text.secondary',
                      }}
                    />
                  </IconButton>
                </Stack>
              </Stack>

              <Collapse in={isExpanded} timeout="auto" unmountOnExit sx={{ width: '100%' }}>
                <Stack sx={{ p: 2, pt: 0, gap: 1, backgroundColor: 'action.selected' }}>
                  {(isBulk
                    ? bulkSummary
                    : [{ label: t('sessionHistory.totalLines'), value: item.totalLines }]
                  ).map((detail, idx) => (
                    <Stack key={idx} direction="row" justifyContent="space-between">
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {detail.label}:
                      </Typography>
                      <Typography variant="caption" fontWeight={600} sx={{ color: 'text.primary' }}>
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
