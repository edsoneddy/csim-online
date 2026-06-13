import { Stack, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import VerifiedIcon from '@mui/icons-material/Verified';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import { languageField, languageOptions } from '../../constants/ui';
const Toolbar = ({
  onAnalyze,
  onClear,
  canAnalyze = true,
  isAnalyzing = false,
  language,
  onLanguageChange,
}) => {
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
      <FormControl size={'small'} sx={{ minWidth: 120 }}>
        <InputLabel id="language-select-label">{languageField}</InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
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

      <Button
        variant="contained"
        endIcon={<VerifiedIcon />}
        onClick={() => {}}
        disabled={!canAnalyze || isAnalyzing}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          width: { xs: 'auto', md: '100%' },
        }}
      >
        {'Verify'}
      </Button>
      <Button
        variant="contained"
        endIcon={<CompareArrowsIcon />}
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
      <Button
        variant="outlined"
        endIcon={<PlagiarismIcon />}
        onClick={onClear}
        sx={{
          textTransform: 'none',
          fontWeight: 600,
          width: { xs: 'auto', md: '100%' },
        }}
      >
        Clear All
      </Button>
    </Stack>
  );
};

export default Toolbar;
