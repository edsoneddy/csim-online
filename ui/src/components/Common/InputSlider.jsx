import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Slider from '@mui/material/Slider';
import Stack from '@mui/material/Stack';
import TooltipIconButton from './TooltipIconButton';

const InputSlider = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  fixed,
  suffix,
  help,
  disabled = false,
}) => {
  const handleChange = (event, newValue) => {
    onChange(newValue);
  };

  const val = fixed ? value.toFixed(fixed) : value;
  const labelFixed = `${label} ${val}${suffix ? `${suffix}` : ''}`;

  // Shared popup for every slider: a one-sentence help tooltip over the whole control (the value
  // is already in the label, so there is no value bubble).
  const control = (
    <FormControl
      variant="outlined"
      size="small"
      disabled={disabled}
      sx={{ minWidth: 120, width: '100%' }}
    >
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
              disabled={disabled}
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
          minHeight: '40px',
          paddingRight: 1,
        }}
      />
    </FormControl>
  );

  // Same tooltip as the buttons (TooltipIconButton + the MuiTooltip theme override).
  return help ? (
    <TooltipIconButton props={{ title: help, offset: [0, 5] }} asChild>
      {/* A span keeps the tooltip working while the slider is disabled (MUI skips disabled children). */}
      <span style={{ display: 'block' }}>{control}</span>
    </TooltipIconButton>
  ) : (
    control
  );
};

export default InputSlider;
