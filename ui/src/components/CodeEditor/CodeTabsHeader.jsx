import { AppBar, Tabs, Tab } from '@mui/material';
import { Code as CodeIcon, FormatListNumbered as ListNumberedIcon } from '@mui/icons-material';
import { BULK_EDITOR, DUAL_EDITOR } from '../../constants/ui';

const CodeTabsHeader = ({ value, onChange }) => {
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
          icon={<CodeIcon />}
          iconPosition="end"
          label={DUAL_EDITOR}
          id="tab-0"
          sx={{ minHeight: '38px', padding: '0px 12px' }}
        />
        <Tab
          icon={<ListNumberedIcon />}
          iconPosition="end"
          label={BULK_EDITOR}
          id="tab-1"
          sx={{ minHeight: '38px', padding: '0px 12px' }}
        />
      </Tabs>
    </AppBar>
  );
};

export default CodeTabsHeader;
