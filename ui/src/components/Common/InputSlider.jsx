import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';

const InputSlider = ({ label, value, onChange, min, max, step }) => {
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  const labelFixed = `${label} ${value.toFixed(2)}`;

  return (
    <FormControl variant="outlined" size="small" sx={{ minWidth: 120, width: '100%' }}>
      <InputLabel shrink id={`slider-label-${labelFixed}`}>
        {labelFixed}
      </InputLabel>

      <OutlinedInput
        label={labelFixed}
        notched
        startAdornment={
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ width: '100%', px: 1, mt: 0.5 }}
          >
            <Slider
              value={value}
              min={min}
              max={max}
              step={step}
              size="small"
              onChange={handleChange}
              aria-labelledby={`slider-label-${labelFixed}`}
              sx={{ flexGrow: 1 }}
            />
          </Stack>
        }
        inputProps={{
          sx: { display: 'none' },
        }}
        sx={{
          height: '40px',
          paddingRight: 1,
        }}
      />
    </FormControl>
  );
};

export default InputSlider;
