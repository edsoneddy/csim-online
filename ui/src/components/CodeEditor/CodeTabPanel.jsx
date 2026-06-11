import { Box } from '@mui/material';

const CodeTabPanel = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      style={{
        height: value === index ? '100%' : 'auto',
        display: value === index ? 'block' : 'none',
        overflowY: 'auto',
      }}
    >
      {value === index && (
        <Box
          sx={{
            p: 3,
            height: '100%',
            boxSizing: 'border-box',
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
};

export default CodeTabPanel;
