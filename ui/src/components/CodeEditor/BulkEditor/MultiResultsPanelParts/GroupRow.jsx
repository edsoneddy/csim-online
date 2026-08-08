import { useMemo, useState } from 'react';
import { Box, Paper, Typography, Chip, Collapse, IconButton, Stack } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import GroupFilesTable from './GroupFilesTable';
import TooltipIconButton from '../../../Common/TooltipIconButton';
import DifferenceIcon from '@mui/icons-material/Difference';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { blurActiveElement } from '../../../../utils/editor';

const getRiskMeta = (avg, isUnique, t, theme) => {
  if (isUnique) {
    return {
      riskLabel: t('bulkEditor.groupRow.riskClean'),
      borderColor: theme.palette.success.main,
      percentageText: t('dualResults.notAvailable'),
    };
  }

  const avgPercentage = avg * 100;
  if (avgPercentage >= 90) {
    return {
      riskLabel: t('bulkEditor.groupRow.riskHigh'),
      borderColor: theme.palette.error.main,
      percentageText: `${avgPercentage.toFixed(1)}%`,
    };
  }

  if (avgPercentage >= 70) {
    return {
      riskLabel: t('bulkEditor.groupRow.riskMedium'),
      borderColor: theme.palette.status.alert,
      percentageText: `${avgPercentage.toFixed(1)}%`,
    };
  }

  return {
    riskLabel: t('bulkEditor.groupRow.riskLow'),
    borderColor: theme.palette.success.main,
    percentageText: `${avgPercentage.toFixed(1)}%`,
  };
};

const GroupRow = ({
  fileNames,
  avg,
  isUnique,
  allFiles,
  onViewSelected,
  onViewDiffSelected = () => {},
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const { riskLabel, borderColor, percentageText } = getRiskMeta(avg, isUnique, t, theme);

  const groupFilesData = useMemo(() => {
    return fileNames.map((name) => {
      const fileData = allFiles.find((file) => file.name === name);
      return fileData || { name, size: 0, date: null };
    });
  }, [allFiles, fileNames]);

  return (
    <Paper
      sx={{
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: 'divider',
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: 1,
        overflow: 'hidden',
        mb: 2,
      }}
    >
      <Box
        role="button"
        tabIndex={0}
        aria-expanded={open}
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: 1,
          p: 2,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'background.paper' },
          '&:focus-visible': {
            outline: (theme) => `2px solid ${theme.palette.primary.main}`,
            outlineOffset: -2,
          },
        }}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setOpen(!open);
          }
        }}
      >
        <Typography
          variant="h6"
          sx={{ color: borderColor, fontWeight: 600, minWidth: { xs: 60, sm: 80 } }}
        >
          {percentageText}
        </Typography>

        <Chip
          label={riskLabel}
          size="small"
          sx={{
            bgcolor: 'transparent',
            color: borderColor,
            border: `1px solid ${borderColor}`,
            height: 22,
            fontSize: '0.7rem',
            mr: { xs: 1.5, sm: 3 },
            minWidth: { xs: 'auto', sm: '62px' },
          }}
        />

        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', flex: '1 1 100px', minWidth: 0 }}
          noWrap
        >
          {t('bulkEditor.groupRow.files', { count: fileNames.length })}
        </Typography>

        <Stack direction="row" sx={{ flexShrink: 0 }}>
          {!isUnique && (
            <TooltipIconButton
              props={{
                title: t('bulkEditor.groupRow.viewDifferences'),
                onClick: (event) => {
                  event.stopPropagation();
                  blurActiveElement();
                  onViewDiffSelected(groupFilesData);
                },
              }}
            >
              <DifferenceIcon />
            </TooltipIconButton>
          )}
          <TooltipIconButton
            props={{
              title: t('bulkEditor.groupRow.viewFiles'),
              onClick: (event) => {
                event.stopPropagation();
                blurActiveElement();
                onViewSelected(groupFilesData);
              },
            }}
          >
            <VisibilityIcon />
          </TooltipIconButton>
        </Stack>

        <IconButton
          size="small"
          aria-label={
            open ? t('bulkEditor.groupRow.collapseGroup') : t('bulkEditor.groupRow.expandGroup')
          }
          sx={{ color: 'text.secondary' }}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </Box>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <GroupFilesTable files={groupFilesData} />
      </Collapse>
    </Paper>
  );
};

export default GroupRow;
