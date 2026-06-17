import './App.css';
import { StyledEngineProvider, ThemeProvider, Box } from '@mui/material';
import AppContainer from './components/Layout/AppContainer';
import { darkTheme } from './styles/theme';
import store from './hooks/redux/store';
import { Provider } from 'react-redux';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={darkTheme}>
        <Provider store={store}>
          <Box
            sx={{
              width: '100vw',
              height: '100vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <AppContainer />
          </Box>
        </Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
