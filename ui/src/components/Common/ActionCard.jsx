import { Paper, Typography } from '@mui/material';

const ActionCard = ({ title, description, variant = 'primary' }) => {
  const bgColor = variant === 'primary' ? 'primary.main' : 'secondary.light';
  const textColor = variant === 'primary' ? 'primary.contrastText' : 'inherit';

  return (
    <Paper
      sx={{
        mt: 4,
        p: 3,
        bgcolor: bgColor,
        color: textColor,
        textAlign: 'center',
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mb: 2 }}>
        {description}
      </Typography>
    </Paper>
  );
};

export default ActionCard;
