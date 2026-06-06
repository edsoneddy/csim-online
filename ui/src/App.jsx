import './App.css';
import { StyledEngineProvider, ThemeProvider, Box } from '@mui/material';
import AppContainer from './components/Layout/AppContainer';
import { darkTheme } from './styles/theme';

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={darkTheme}>
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
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
