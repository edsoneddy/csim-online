import { Stack, Button, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { useTranslation } from 'react-i18next';
import { languageOptions, languageDisplayNames } from '../../constants/ui';
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
  const { t } = useTranslation();
  const languageLabel = t('editor.toolbar.languageLabel');

  const getToolbarOption = (option) => {
    switch (option) {
      case LANGUAGE_SELECT:
        return (
          <FormControl size={'small'} sx={{ minWidth: 120 }}>
            <InputLabel id="language-select-label">{languageLabel}</InputLabel>
            <Select
              labelId="language-select-label"
              id={LANGUAGE_SELECT}
              value={language}
              label={languageLabel}
              onChange={(event) => {
                onLanguageChange(event.target.value);
              }}
              renderValue={(value) => languageDisplayNames[value] || value}
              sx={{
                '& .MuiSelect-select': {
                  paddingTop: '10.5px',
                  paddingBottom: '10.5px',
                },
              }}
            >
              {languageOptions.map((option, index) => (
                <MenuItem key={index} value={option}>
                  {languageDisplayNames[option]}
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
              minWidth: { xs: 'auto', sm: 120 },
            }}
          >
            {t('editor.toolbar.analyze')}
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
              minWidth: { xs: 'auto', sm: 120 },
            }}
          >
            {t('editor.toolbar.clearAll')}
          </Button>
        );
      case THRESHOLD_SLIDER:
        return (
          <InputSlider
            label={t('editor.toolbar.threshold')}
            value={threshold}
            onChange={onThresholdChange}
            suffix="%"
            min={0}
            max={100}
            step={5}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Stack
      spacing={2}
      direction="row"
      useFlexGap
      flexWrap="wrap"
      sx={{
        width: 'auto',
        justifyContent: 'center',
        alignItems: 'center',
        '& .MuiButton-root': { whiteSpace: 'nowrap' },
      }}
    >
      {TOOLBAR_BUTTONS[editorType].map((option, index) => (
        <Box key={index}>{getToolbarOption(option)}</Box>
      ))}
    </Stack>
  );
};

export default EditorToolbar;
