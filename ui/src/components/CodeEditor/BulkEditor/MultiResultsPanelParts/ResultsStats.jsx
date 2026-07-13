import { Card, CardContent, Grid, Typography } from '@mui/material';

const ResultsStats = ({ totalGroups, totalSuspicious, totalUnique }) => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={4}>
        <Card sx={{ bgcolor: '#09172C', border: '1px solid #122F4F', height: '100%' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#8892B0', textAlign: 'center' }}>
              Total Groups
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#8892B0', mt: 1 }}>
              {totalGroups}
            </Typography>
            <Typography variant="caption" sx={{ color: '#8892B0', textAlign: 'center' }}>
              Groups identified
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={4}>
        <Card sx={{ bgcolor: '#1F1A13', border: '1px solid #432E16', height: '100%' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#ffb74d', textAlign: 'center' }}>
              Suspicious Clusters
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#ffb74d', mt: 1 }}>
              {totalSuspicious}
            </Typography>
            <Typography variant="caption" sx={{ color: '#ffb74d', textAlign: 'center' }}>
              High similarity groups
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={4}>
        <Card sx={{ bgcolor: '#0B1F1B', border: '1px solid #183428', height: '100%' }}>
          <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ color: '#81c784', textAlign: 'center' }}>
              Unique Files
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: '#81c784', mt: 1 }}>
              {totalUnique}
            </Typography>
            <Typography variant="caption" sx={{ color: '#81c784', textAlign: 'center' }}>
              Files with no matches
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default ResultsStats;
