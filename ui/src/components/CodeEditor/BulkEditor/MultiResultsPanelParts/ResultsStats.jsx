import { Card, CardContent, Grid, Typography } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { colorPalette } from '../../../../styles/colorPalette';

const ResultsStats = ({ totalGroups, totalSuspicious, totalUnique }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const stats = [
    {
      label: t('bulkEditor.resultsStats.totalGroups'),
      value: totalGroups,
      caption: t('bulkEditor.resultsStats.groupsIdentified'),
      color: theme.palette.text.secondary,
    },
    {
      label: t('bulkEditor.resultsStats.suspiciousClusters'),
      value: totalSuspicious,
      caption: t('bulkEditor.resultsStats.highSimilarityGroups'),
      color: colorPalette.status.warning,
    },
    {
      label: t('bulkEditor.resultsStats.uniqueFiles'),
      value: totalUnique,
      caption: t('bulkEditor.resultsStats.filesWithNoMatches'),
      color: colorPalette.status.success,
    },
  ];

  return (
    <Grid container spacing={1}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={4} key={stat.label}>
          <Card
            sx={{
              bgcolor: alpha(stat.color, 0.08),
              border: '1px solid',
              borderColor: alpha(stat.color, 0.24),
              height: '100%',
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="caption" sx={{ color: stat.color, textAlign: 'center' }}>
                {stat.label}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600, color: stat.color, mt: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="caption" sx={{ color: stat.color, textAlign: 'center' }}>
                {stat.caption}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ResultsStats;
