import './App.css';
import { StyledEngineProvider, ThemeProvider, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { enUS, esES } from '@mui/material/locale';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Provider } from 'react-redux';
import AppContainer from './components/Layout/AppContainer';
import { buildTheme } from './styles/theme';
import { ThemeModeProvider, useThemeMode } from './theme/ThemeModeContext';
import store from './hooks/redux/store';

// MUI's own components (TablePagination, etc.) carry their own built-in
// strings, translated separately from src/i18n via these locale objects.
const MUI_LOCALES = { en: enUS, es: esES };

// Needs to sit inside ThemeModeProvider to read the resolved light/dark mode.
const ThemedApp = ({ children }) => {
  const { i18n } = useTranslation();
  const { resolvedMode } = useThemeMode();
  const theme = useMemo(
    () => createTheme(buildTheme(resolvedMode), MUI_LOCALES[i18n.resolvedLanguage] || enUS),
    [resolvedMode, i18n.resolvedLanguage]
  );

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
};

function App() {
  return (
    <ThemeModeProvider>
      <ThemedApp>
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
      </ThemedApp>
    </ThemeModeProvider>
  );
}

export default App;
