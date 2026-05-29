import React from 'react';
import {
  Paper,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';

const FAQSection = ({ section }) => {
  return (
    <Paper
      sx={{
        mb: 3,
        overflow: 'hidden',
        borderLeft: '4px solid',
        borderColor: 'primary.main',
      }}
    >
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          bgcolor: 'action.hover',
        }}
      >
        <Box sx={{ color: 'primary.main' }}>{section.icon}</Box>
        <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
          {section.category}
        </Typography>
      </Box>

      {section.questions.map((faq, index) => (
        <Accordion key={index}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={{
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>{faq.q}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography color="textSecondary">{faq.a}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Paper>
  );
};

export default FAQSection;
