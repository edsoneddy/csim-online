import { Box, Button, Stack, Chip, Typography } from '@mui/material';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { colorPalette } from '../../styles/colorPalette';

const MatchNavigation = ({
  currentMatch = 0,
  totalMatches = 0,
  onPrevious,
  onNext,
  disabled = false,
}) => {
  const hasMatches = totalMatches > 0;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 1.5,
        backgroundColor: colorPalette.alpha.light,
        border: `1px solid ${colorPalette.darkMode.border}`,
        borderRadius: 1,
      }}
    >
      <Typography variant="body2" sx={{ color: colorPalette.darkMode.textSecondary }}>
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
            borderColor: colorPalette.darkMode.border,
            color: colorPalette.darkMode.textSecondary,
            '&:hover': {
              borderColor: colorPalette.primary.main,
              backgroundColor: colorPalette.alpha.light,
            },
            '&:disabled': {
              borderColor: colorPalette.darkMode.border,
              color: colorPalette.neutral.medium,
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
            backgroundColor: colorPalette.alpha.light,
            borderColor: colorPalette.primary.main,
            color: colorPalette.primary.main,
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
            borderColor: colorPalette.darkMode.border,
            color: colorPalette.darkMode.textSecondary,
            '&:hover': {
              borderColor: colorPalette.primary.main,
              backgroundColor: colorPalette.alpha.light,
            },
            '&:disabled': {
              borderColor: colorPalette.darkMode.border,
              color: colorPalette.neutral.medium,
            },
          }}
        >
          Next
        </Button>
      </Stack>

      {hasMatches && (
        <Typography
          variant="caption"
          sx={{ color: colorPalette.darkMode.textSecondary, ml: 'auto' }}
        >
          Jump between detected matches
        </Typography>
      )}
    </Box>
  );
};

export default MatchNavigation;
