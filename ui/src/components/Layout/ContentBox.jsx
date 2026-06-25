import { Box } from '@mui/material';
import { useSelector } from 'react-redux';
import { CODE_SECTION, CONTACT_US_SECTION, HELP_CENTER_SECTION } from '../../constants/ui';
import CodeSection from '../CodeEditor/CodeSection';
import HelpCenter from '../HelpCenter/HelpCenter';
import ContactUs from '../ContactUs/ContactUs';

const ContentBox = () => {
  const actualContent = useSelector((state) => state.menu.actualContent);

  const getRenderContentBox = () => {
    switch (actualContent) {
      case CODE_SECTION:
        return <CodeSection />;
      case HELP_CENTER_SECTION:
        return <HelpCenter />;
      case CONTACT_US_SECTION:
        return <ContactUs />;
      default:
        return null;
    }
  };

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 1.5,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {getRenderContentBox()}
      </Box>
    </Box>
  );
};

export default ContentBox;
