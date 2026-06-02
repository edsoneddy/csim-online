import { createTheme } from '@mui/material';
import { colorPalette } from './colorPalette';

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colorPalette.primary.main,
      light: colorPalette.primary.light,
      dark: colorPalette.primary.dark,
      contrastText: colorPalette.primary.contrast,
    },
    secondary: {
      main: colorPalette.accent.main,
      light: colorPalette.accent.light,
      dark: colorPalette.accent.dark,
      contrastText: colorPalette.accent.contrast,
    },
    success: {
      main: colorPalette.status.success,
    },
    warning: {
      main: colorPalette.status.warning,
    },
    info: {
      main: colorPalette.status.alert,
    },
    error: {
      main: colorPalette.status.error,
    },
    background: {
      default: colorPalette.darkMode.background,
      paper: colorPalette.darkMode.paper,
    },
    text: {
      primary: colorPalette.darkMode.textPrimary,
      secondary: colorPalette.darkMode.textSecondary,
    },
    divider: colorPalette.darkMode.border,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, fontSize: '2.5rem' },
    h2: { fontWeight: 700, fontSize: '2rem' },
    h3: { fontWeight: 600, fontSize: '1.75rem' },
    h4: { fontWeight: 600, fontSize: '1.5rem' },
    h5: { fontWeight: 600, fontSize: '1.25rem' },
    h6: { fontWeight: 600, fontSize: '1rem' },
    body1: { fontWeight: 400, fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontWeight: 400, fontSize: '0.875rem', lineHeight: 1.5 },
    button: { fontWeight: 600, textTransform: 'none' },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: `linear-gradient(135deg, ${colorPalette.darkMode.paper} 0%, ${colorPalette.darkMode.background} 100%)`,
          boxShadow: `0px 4px 12px ${colorPalette.shadows.dark}`,
          borderBottom: `1px solid ${colorPalette.darkMode.border}`,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colorPalette.darkMode.paper,
          backgroundClip: 'border-box',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: colorPalette.gradients.primary,
          '&:hover': {
            background: colorPalette.gradients.primary,
            opacity: 0.9,
          },
        },
        outlined: {
          borderColor: colorPalette.primary.main,
          color: colorPalette.primary.main,
          '&:hover': {
            backgroundColor: colorPalette.alpha.light,
            borderColor: colorPalette.primary.light,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
        filledSuccess: {
          backgroundColor: colorPalette.status.success,
          color: colorPalette.neutral.white,
        },
        filledWarning: {
          backgroundColor: colorPalette.status.warning,
          color: colorPalette.neutral.white,
        },
        filledError: {
          backgroundColor: colorPalette.status.error,
          color: colorPalette.neutral.white,
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        bar: {
          background: colorPalette.gradients.primary,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: colorPalette.darkMode.border,
        },
      },
    },
  },
});
