import { Box, Skeleton, Stack, Paper } from '@mui/material';

const ResultsLoadingSkeleton = () => {
  return (
    <Paper sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Main Score Skeleton */}
      <Box>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="150px" height={20} />
            <Skeleton variant="text" width="100px" height={28} sx={{ mt: 0.5 }} />
          </Box>
          <Skeleton variant="rounded" width={120} height={32} />
        </Stack>
        <Skeleton variant="rounded" height={8} />
      </Box>

      {/* Divider */}
      <Skeleton variant="rounded" height={1} />

      {/* Statistics Grid */}
      <Stack spacing={1}>
        {[1, 2, 3, 4].map((i) => (
          <Stack key={i} direction="row" spacing={2} alignItems="center">
            <Skeleton variant="text" width="100px" height={16} />
            <Skeleton variant="text" width="60px" height={24} sx={{ ml: 'auto' }} />
          </Stack>
        ))}
      </Stack>

      {/* Divider */}
      <Skeleton variant="rounded" height={1} />

      {/* Details */}
      <Stack spacing={0.5}>
        <Skeleton variant="text" width="80px" height={16} />
        <Skeleton variant="text" width="100%" height={60} />
      </Stack>

      {/* Buttons */}
      <Stack direction="row" spacing={1}>
        <Skeleton variant="rounded" width={140} height={36} />
        <Skeleton variant="rounded" width={120} height={36} />
      </Stack>
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
