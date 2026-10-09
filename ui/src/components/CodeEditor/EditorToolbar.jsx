import {
  Stack,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Switch,
} from '@mui/material';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import { useTranslation } from 'react-i18next';
import { languageOptions, languageDisplayNames, MAX_PREFILTER_MARGIN } from '../../constants/ui';
import {
  ANALYZE_BUTTON,
  CLEAR_BUTTON,
  EDITOR_TYPES,
  LANGUAGE_SELECT,
  PREFILTER_SWITCH,
  PREFILTER_MARGIN_SLIDER,
  THRESHOLD_SLIDER,
  TOOLBAR_BUTTONS,
} from '../../utils/toolbar';
import InputSlider from '../Common/InputSlider';
import TooltipIconButton from '../Common/TooltipIconButton';
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
  prefilter = false,
  onPrefilterChange,
  prefilterMargin,
  onPrefilterMarginChange,
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
      case PREFILTER_SWITCH:
        return (
          <TooltipIconButton props={{ title: t('editor.toolbar.prefilterHint') }} asChild>
            <FormControlLabel
              control={
                <Switch
                  id={PREFILTER_SWITCH}
                  size="small"
                  checked={prefilter}
                  onChange={(event) => onPrefilterChange(event.target.checked)}
                />
              }
              label={t('editor.toolbar.prefilter')}
              sx={{ m: 0, whiteSpace: 'nowrap' }}
            />
          </TooltipIconButton>
        );
      case PREFILTER_MARGIN_SLIDER:
        return (
          <InputSlider
            label={t('editor.toolbar.prefilterMargin')}
            help={t('editor.toolbar.prefilterMarginHint')}
            disabled={!prefilter}
            value={prefilterMargin}
            onChange={onPrefilterMarginChange}
            min={0}
            max={MAX_PREFILTER_MARGIN}
            step={0.01}
            fixed={2}
          />
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
            help={t('editor.toolbar.thresholdHint')}
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
        width: { xs: '100%', sm: 'auto' },
        justifyContent: 'center',
        alignItems: 'center',
        '& .MuiButton-root': { whiteSpace: 'nowrap' },
      }}
    >
      {TOOLBAR_BUTTONS[editorType].map((option, index) => {
        const control = getToolbarOption(option);
        // Sliders take the whole row on phones and keep a usable width from `sm` up.
        const isSlider = option === THRESHOLD_SLIDER || option === PREFILTER_MARGIN_SLIDER;
        return (
          control && (
            <Box
              key={index}
              sx={
                isSlider ? { width: { xs: '100%', sm: 'auto' }, minWidth: { sm: 200 } } : undefined
              }
            >
              {control}
            </Box>
          )
        );
      })}
    </Stack>
  );
};

export default EditorToolbar;
