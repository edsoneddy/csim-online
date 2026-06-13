import { Box, Skeleton, Stack, Paper, Typography } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { colorPalette } from '../../styles/colorPalette';
const ResultsLoadingSkeleton = () => {
  return (
    <Paper
      sx={{
        p: 3,
        textAlign: 'center',
        backgroundColor: colorPalette.alpha.light,
        border: `1px dashed ${colorPalette.darkMode.border}`,
      }}
    >
      <Typography variant="body2" sx={{ color: colorPalette.darkMode.textSecondary }}>
        Loading results, please wait...
      </Typography>
    </Paper>
  );
};

const EditorLoadingSkeleton = () => {
  return (
    <Paper
      sx={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 1.5,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Skeleton variant="text" width="150px" height={20} />
        <Skeleton variant="rounded" width={70} height={24} />
        <Skeleton variant="rounded" width={70} height={24} />
        <Skeleton variant="rounded" width={70} height={24} />
      </Box>

      {/* Editor Content */}
      <Box sx={{ flex: 1, p: 2, overflow: 'hidden' }}>
        <Stack spacing={1}>
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Skeleton key={i} variant="text" width={`${80 + Math.random() * 20}%`} height={20} />
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};

export { ResultsLoadingSkeleton, EditorLoadingSkeleton };
