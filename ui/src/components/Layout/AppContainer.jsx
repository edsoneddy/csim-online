import { Box, CssBaseline, Drawer } from '@mui/material';
import MenuAppBar from './MenuAppBar';
import MenuDrawer from './MenuDrawer';
import ContentBox from './ContentBox';
import { useDispatch, useSelector } from 'react-redux';
import { openHistoryMenu } from '../../hooks/redux/appActions';
import SessionHistory from '../CodeEditor/SessionHistory';
import InfoDialog from '../Common/InfoDialog';
import { blurActiveElement } from '../../utils/editor';

const AppContainer = () => {
  const open = useSelector((state) => state.menu.isOpenHistoryMenu);
  const infoDialog = useSelector((state) => state.infoDialog);

  const dispatch = useDispatch();

  const handleCloseHistoryMenu = () => {
    blurActiveElement();
    dispatch(openHistoryMenu());
  };

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
        }}
      >
        <MenuAppBar />
        <Box
          sx={{
            display: 'flex',
            flex: 1,
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <MenuDrawer />
          <ContentBox />
        </Box>
      </Box>
      <Drawer
        anchor={'right'}
        open={open}
        onClose={handleCloseHistoryMenu}
        sx={{
          '& .MuiDrawer-paper': {
            top: '64px',
            height: 'calc(100% - 64px)',
          },
        }}
      >
        <SessionHistory />
      </Drawer>
      {infoDialog.open && (
        <InfoDialog
          open={infoDialog.open}
          errorMessage={infoDialog.message}
          header={infoDialog.header}
        />
      )}
    </>
  );
};
export default AppContainer;
