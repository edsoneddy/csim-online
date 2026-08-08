import './App.css';
import { StyledEngineProvider, ThemeProvider, Box, createTheme } from '@mui/material';
import { enUS, esES } from '@mui/material/locale';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AppContainer from './components/Layout/AppContainer';
import { darkTheme } from './styles/theme';
import store from './hooks/redux/store';
import { Provider } from 'react-redux';

// MUI's own components (TablePagination, etc.) carry their own built-in
// strings, translated separately from src/i18n via these locale objects.
const MUI_LOCALES = { en: enUS, es: esES };

function App() {
  const { i18n } = useTranslation();
  const theme = useMemo(
    () => createTheme(darkTheme, MUI_LOCALES[i18n.resolvedLanguage] || enUS),
    [i18n.resolvedLanguage]
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
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
