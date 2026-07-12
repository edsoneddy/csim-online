import { Stack, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { languageField, languageOptions } from '../../constants/ui';
import {
  ANALYZE_BUTTON,
  CLEAR_BUTTON,
  EDITOR_TYPES,
  LANGUAGE_SELECT,
  THRESHOLD_SLIDER,
  TOOLBAR_BUTTONS,
} from '../../utils/toolbar';
import InputSlider from '../Common/InputSlider';
const EditorToolbar = ({
  editorType = EDITOR_TYPES.DUAL_EDITOR,
  onAnalyze,
  onClear,
  canAnalyze = true,
  isAnalyzing = false,
  language,
  onLanguageChange,
  threshold,
  onThresholdChange,
}) => {
  const getToolbarOption = (option) => {
    switch (option) {
      case LANGUAGE_SELECT:
        return (
          <FormControl size={'small'} sx={{ minWidth: 120 }}>
            <InputLabel id="language-select-label">{languageField}</InputLabel>
            <Select
              labelId="language-select-label"
              id={LANGUAGE_SELECT}
              value={language}
              label={languageField}
              onChange={(event) => {
                onLanguageChange(event.target.value);
              }}
            >
              {languageOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case ANALYZE_BUTTON:
        return (
          <Button
            id={ANALYZE_BUTTON}
            variant="contained"
            endIcon={<PlagiarismIcon />}
            onClick={onAnalyze}
            disabled={!canAnalyze || isAnalyzing}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              width: { xs: 'auto', md: '100%' },
            }}
          >
            {'Analyze'}
          </Button>
        );
      case CLEAR_BUTTON:
        return (
          <Button
            id={CLEAR_BUTTON}
            variant="outlined"
            endIcon={<ClearAllIcon />}
            onClick={onClear}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              width: { xs: 'auto', md: '100%' },
            }}
          >
            Clear All
          </Button>
        );
      case THRESHOLD_SLIDER:
        return (
          <InputSlider
            label="Threshold"
            value={threshold}
            onChange={onThresholdChange}
            min={0}
            max={1}
            step={0.05}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stack
      spacing={1.5}
      direction={{ xs: 'row', md: 'column' }}
      sx={{
        marginBottom: 'auto',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        '& .MuiButton-root': { whiteSpace: 'nowrap' },
      }}
    >
      {TOOLBAR_BUTTONS[editorType].map((option, index) => (
        <Stack key={index} sx={{ width: '100%' }}>
          {getToolbarOption(option)}
        </Stack>
      ))}
    </Stack>
  );
};

export default EditorToolbar;
