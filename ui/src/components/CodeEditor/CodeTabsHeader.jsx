import { AppBar, Tabs, Tab } from '@mui/material';
import { Code as CodeIcon, FormatListNumbered as ListNumberedIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const CodeTabsHeader = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Tabs
        value={value}
        onChange={onChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        sx={{
          minHeight: '38px',
          '& .MuiTabs-flexContainer': { height: '48px' },
        }}
      >
        <Tab
          icon={<CodeIcon fontSize="small" />}
          iconPosition="end"
          label={t('editor.tabs.dual')}
          id="tab-0"
          sx={{
            minHeight: '38px',
            padding: { xs: '0px 6px', sm: '0px 12px' },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          }}
        />
        <Tab
          icon={<ListNumberedIcon fontSize="small" />}
          iconPosition="end"
          label={t('editor.tabs.bulk')}
          id="tab-1"
          sx={{
            minHeight: '38px',
            padding: { xs: '0px 6px', sm: '0px 12px' },
            fontSize: { xs: '0.75rem', sm: '0.875rem' },
          }}
        />
      </Tabs>
    </AppBar>
  );
};

export default CodeTabsHeader;
