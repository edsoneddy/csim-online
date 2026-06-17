import { Box, CssBaseline, Drawer } from '@mui/material';
import MenuAppBar from './MenuAppBar';
import MenuDrawer from './MenuDrawer';
import ContentBox from './ContentBox';
import { useDispatch, useSelector } from 'react-redux';
import HistoryDrawer from './HistoryDrawer';
import { openHistoryMenu } from '../../hooks/redux/menuActions';

const AppContainer = () => {
  const open = useSelector((state) => state.menu.isOpenHistoryMenu);
  const dispatch = useDispatch();

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
      <Drawer anchor={'right'} open={open} onClose={() => dispatch(openHistoryMenu())}>
        <HistoryDrawer />
      </Drawer>
    </>
  );
};
export default AppContainer;
