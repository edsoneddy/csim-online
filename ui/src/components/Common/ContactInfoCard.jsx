import { Card, CardActionArea, CardContent, Box, Typography } from '@mui/material';

const ContactInfoCard = ({ info }) => {
  const isLink = Boolean(info.link) && info.link !== '#';
  const isExternal = isLink && /^https?:\/\//.test(info.link);

  return (
    <Card
      sx={{
        transition: 'all 0.3s ease',
        ...(isLink && {
          '&:hover': {
            transform: 'translateX(4px)',
            boxShadow: 2,
          },
        }),
      }}
    >
      <CardActionArea
        component={isLink ? 'a' : 'div'}
        href={isLink ? info.link : undefined}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        disabled={!isLink}
      >
        <CardContent sx={{ display: 'flex', gap: 2, p: 2 }}>
          <Box
            sx={{
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {info.icon}
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {info.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {info.content}
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ContactInfoCard;
