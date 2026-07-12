import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';

const InputSlider = ({ label, value, onChange, min, max, step }) => {
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  return (
    <Box
      sx={{
        padding: 1,
        borderRadius: 1,
        border: '1px solid rgb(79, 83, 95)',
      }}
    >
      <Typography id="non-linear-slider" gutterBottom variant="body2" sx={{ fontWeight: 600 }}>
        {label}: {value.toFixed(2)}
      </Typography>
      <Slider value={value} min={min} step={step} max={max} size="small" onChange={handleChange} />
    </Box>
  );
};

export default InputSlider;
