import { useMemo, useState } from 'react';
import { Box, Paper, Typography, Chip, Collapse, IconButton, Stack } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import GroupFilesTable from './GroupFilesTable';
import TooltipIconButton from '../../../Common/TooltipIconButton';
import DifferenceIcon from '@mui/icons-material/Difference';
import { blurActiveElement } from '../../../../utils/editor';

const getRiskMeta = (avg, isUnique) => {
  if (isUnique) {
    return {
      riskLabel: 'Clean',
      borderColor: '#ffffff',
      percentageText: 'N/A',
    };
  }

  const avgPercentage = avg * 100;
  if (avgPercentage >= 90) {
    return {
      riskLabel: 'High',
      borderColor: '#f44336',
      percentageText: `${avgPercentage.toFixed(1)}%`,
    };
  }

  if (avgPercentage >= 70) {
    return {
      riskLabel: 'Medium',
      borderColor: '#ff9800',
      percentageText: `${avgPercentage.toFixed(1)}%`,
    };
  }

  return {
    riskLabel: 'Low',
    borderColor: '#4caf50',
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
  const [open, setOpen] = useState(false);
  const { riskLabel, borderColor, percentageText } = getRiskMeta(avg, isUnique);

  const groupFilesData = useMemo(() => {
    return fileNames.map((name) => {
      const fileData = allFiles.find((file) => file.name === name);
      return fileData || { name, size: 0, date: null };
    });
  }, [allFiles, fileNames]);

  return (
    <Paper
      sx={{
        bgcolor: '#151A25',
        border: '1px solid #2D3748',
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: 1,
        overflow: 'hidden',
        mb: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: 1,
          p: 2,
          cursor: 'pointer',
          '&:hover': { bgcolor: '#1A1F2E' },
        }}
        onClick={() => setOpen(!open)}
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
          sx={{ color: '#8892B0', flex: '1 1 100px', minWidth: 0 }}
          noWrap
        >
          {fileNames.length} {fileNames.length === 1 ? 'file' : 'files'}
        </Typography>

        <Stack direction="row" sx={{ flexShrink: 0 }}>
          {!isUnique && (
            <TooltipIconButton
              props={{
                title: 'View Differences',
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
              title: 'View Files',
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

        <IconButton size="small" sx={{ color: '#8892B0' }}>
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
