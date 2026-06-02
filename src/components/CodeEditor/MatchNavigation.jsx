import { Box, Button, Stack, Chip, Typography } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import React from 'react';

const MatchNavigation = ({ 
  currentMatch = 0, 
  totalMatches = 0, 
  onPrevious, 
  onNext,
  disabled = false 
}) => {
  const hasMatches = totalMatches > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 1.5,
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 1,
      }}
    >
      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
        Matches:
      </Typography>
      
      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          size="small"
          variant="outlined"
          startIcon={<NavigateBeforeIcon />}
          onClick={onPrevious}
          disabled={disabled || !hasMatches || currentMatch === 0}
          sx={{
            textTransform: 'none',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
            '&:disabled': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          Previous
        </Button>

        <Chip
          label={`${hasMatches ? currentMatch + 1 : 0} / ${totalMatches}`}
          variant="outlined"
          sx={{
            minWidth: 80,
            backgroundColor: 'rgba(25, 118, 210, 0.1)',
            borderColor: '#1976d2',
            color: '#fff',
            fontWeight: 600,
          }}
        />

        <Button
          size="small"
          variant="outlined"
          endIcon={<NavigateNextIcon />}
          onClick={onNext}
          disabled={disabled || !hasMatches || currentMatch >= totalMatches - 1}
          sx={{
            textTransform: 'none',
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
            '&:disabled': {
              borderColor: 'rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.3)',
            },
          }}
        >
          Next
        </Button>
      </Stack>

      {hasMatches && (
        <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', ml: 'auto' }}>
          Jump between detected matches
        </Typography>
      )}
    </Box>
  );
};

export default MatchNavigation;
