import { useState } from 'react';
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
  Popover,
  Divider,
} from '@mui/material';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import TuneIcon from '@mui/icons-material/Tune';
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

  const [anchorEl, setAnchorEl] = useState(null);

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  const openSettings = Boolean(anchorEl);

  const getToolbarOption = (option, inMenu = false) => {
    switch (option) {
      case LANGUAGE_SELECT:
        return (
          <FormControl size={'small'} sx={{ width: { xs: '100%', sm: 140 } }}>
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
          <TooltipIconButton
            props={{ title: t('editor.toolbar.prefilterHint'), placement: inMenu ? 'left' : 'top' }}
            asChild
          >
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
              labelPlacement={inMenu ? 'start' : 'end'}
              sx={{
                m: 0,
                width: inMenu ? '100%' : 'auto',
                display: 'flex',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                '& .MuiFormControlLabel-label': {
                  color: 'text.primary',
                  typography: 'body2',
                  fontWeight: 600,
                  marginLeft: inMenu ? 0 : undefined,
                },
              }}
            />
          </TooltipIconButton>
        );
      case PREFILTER_MARGIN_SLIDER:
        return (
          <Box sx={{ width: inMenu ? '100%' : { xs: '100%', sm: 200 } }}>
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
              tooltipPlacement={inMenu ? 'left' : 'top'}
            />
          </Box>
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
              width: { xs: '100%', sm: 140 },
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
              width: { xs: '100%', sm: 140 },
            }}
          >
            {t('editor.toolbar.clearAll')}
          </Button>
        );
      case THRESHOLD_SLIDER:
        return (
          <Box sx={{ width: inMenu ? '100%' : { xs: '100%', sm: 200 } }}>
            <InputSlider
              label={t('editor.toolbar.threshold')}
              help={t('editor.toolbar.thresholdHint')}
              value={threshold}
              onChange={onThresholdChange}
              suffix="%"
              min={0}
              max={100}
              step={5}
              tooltipPlacement={inMenu ? 'left' : 'top'}
            />
          </Box>
        );
      default:
        return null;
    }
  };

  const activeOptions = TOOLBAR_BUTTONS[editorType];
  const settingsOptionIds = [PREFILTER_SWITCH, PREFILTER_MARGIN_SLIDER, THRESHOLD_SLIDER];

  const directOptions = activeOptions.filter((opt) => !settingsOptionIds.includes(opt));

  const settingsOptions = [];
  if (activeOptions.includes(THRESHOLD_SLIDER)) {
    settingsOptions.push(THRESHOLD_SLIDER);
  }
  if (activeOptions.includes(PREFILTER_SWITCH) || activeOptions.includes(PREFILTER_MARGIN_SLIDER)) {
    if (settingsOptions.length > 0) settingsOptions.push('SEPARATOR');
    if (activeOptions.includes(PREFILTER_SWITCH)) settingsOptions.push(PREFILTER_SWITCH);
    if (activeOptions.includes(PREFILTER_MARGIN_SLIDER))
      settingsOptions.push(PREFILTER_MARGIN_SLIDER);
  }

  return (
    <>
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
        {directOptions.map((option, index) => {
          const control = getToolbarOption(option);
          return (
            control && (
              <Box key={index} sx={{ width: { xs: '100%', sm: 'auto' } }}>
                {control}
              </Box>
            )
          );
        })}

        {settingsOptions.length > 0 && (
          <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
            <Button
              variant="outlined"
              endIcon={<TuneIcon />}
              onClick={handleSettingsClick}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                width: { xs: '100%', sm: 140 },
              }}
            >
              {t('editor.toolbar.settings', 'Settings')}
            </Button>
          </Box>
        )}
      </Stack>

      <Popover
        open={openSettings}
        anchorEl={anchorEl}
        onClose={handleSettingsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        slotProps={{
          paper: {
            sx: {
              width: anchorEl ? anchorEl.clientWidth : 140,
              mt: 0.5,
              border: 1,
              borderColor: 'primary.main',
              boxShadow: (theme) => theme.shadows[4],
            },
          },
        }}
      >
        <Stack spacing={2.5} sx={{ p: 1, pt: 2, pb: 2 }}>
          {settingsOptions.map((option, index) => {
            if (option === 'SEPARATOR') {
              return <Divider key={`sep-${index}`} sx={{ my: -1 }} />;
            }
            const control = getToolbarOption(option, true);
            return control && <Box key={index}>{control}</Box>;
          })}
        </Stack>
      </Popover>
    </>
  );
};

export default EditorToolbar;
