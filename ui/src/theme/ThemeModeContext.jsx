import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { colorPalette } from '../styles/colorPalette';

const STORAGE_KEY = 'csim_theme_mode';
const MODES = ['light', 'dark', 'system'];
const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

const getSystemPrefersDark = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(DARK_MEDIA_QUERY).matches
    : false;

const getStoredMode = () => {
  if (typeof window === 'undefined') return 'system';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return MODES.includes(stored) ? stored : 'system';
};

const resolveMode = (mode, systemPrefersDark) =>
  mode === 'system' ? (systemPrefersDark ? 'dark' : 'light') : mode;

const ThemeModeContext = createContext(null);

export const ThemeModeProvider = ({ children }) => {
  // Lazy initializers run synchronously during the first render, before
  // anything paints -- resolvedMode below is correct from frame one.
  const [mode, setModeState] = useState(getStoredMode);
  const [systemPrefersDark, setSystemPrefersDark] = useState(getSystemPrefersDark);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mediaQueryList = window.matchMedia(DARK_MEDIA_QUERY);
    const handleChange = (event) => setSystemPrefersDark(event.matches);
    mediaQueryList.addEventListener('change', handleChange);
    return () => mediaQueryList.removeEventListener('change', handleChange);
  }, []);

  const resolvedMode = resolveMode(mode, systemPrefersDark);

  useEffect(() => {
    document.documentElement.style.colorScheme = resolvedMode;
    document.documentElement.setAttribute('data-theme-mode', resolvedMode);

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', colorPalette.modes[resolvedMode].background);
    }
  }, [resolvedMode]);

  const setMode = (nextMode) => {
    if (!MODES.includes(nextMode) || nextMode === mode) return;
    setModeState(nextMode);
    window.localStorage.setItem(STORAGE_KEY, nextMode);
  };

  const value = useMemo(() => ({ mode, resolvedMode, setMode }), [mode, resolvedMode]);

  return <ThemeModeContext.Provider value={value}>{children}</ThemeModeContext.Provider>;
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeModeProvider');
  }
  return context;
};
