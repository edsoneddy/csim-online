import { createTheme, alpha } from '@mui/material/styles';
import { colorPalette } from './colorPalette';

/**
 * Builds the app's MUI theme for a resolved mode ('light' | 'dark'). This is
 * the only place hardcoded colors should live — components read everything
 * back out via `theme.palette.*`.
 */
export const buildTheme = (mode) => {
  const surface = colorPalette.modes[mode];

  return createTheme({
    palette: {
      mode,
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
        main: colorPalette.semantic.info,
      },
      error: {
        main: colorPalette.status.error,
      },
      // Similarity-severity tiers MUI's standard palette has no slot for.
      status: {
        alert: colorPalette.status.alert,
        failed: colorPalette.status.failed,
        hint: colorPalette.semantic.hint,
      },
      background: {
        default: surface.background,
        paper: surface.paper,
      },
      text: {
        primary: surface.textPrimary,
        secondary: surface.textSecondary,
      },
      divider: surface.border,
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
      MuiCssBaseline: {
        styleOverrides: (theme) => ({
          // Scrollbars default to the OS/browser chrome, which stays light
          // even in dark mode unless told otherwise.
          '*': {
            scrollbarColor: `${alpha(theme.palette.text.secondary, 0.4)} transparent`,
          },
          '*::-webkit-scrollbar': {
            width: 10,
            height: 10,
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.text.secondary, 0.4),
            borderRadius: 8,
            border: `2px solid ${theme.palette.background.default}`,
          },
          '*::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
          },
        }),
      },
      MuiTooltip: {
        styleOverrides: {
          tooltip: ({ theme }) => ({
            backgroundColor: colorPalette.semantic.hint,
            color: theme.palette.getContrastText(colorPalette.semantic.hint),
            border: `1px solid ${theme.palette.divider}`,
            fontFamily: theme.typography.fontFamily,
            fontSize: '0.75rem',
            borderRadius: 6,
            padding: '6px 10px',
            boxShadow: `0px 4px 12px ${colorPalette.shadow}`,
          }),
          arrow: {
            color: colorPalette.semantic.hint,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: ({ theme }) => ({
            background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`,
            boxShadow: `0px 4px 12px ${colorPalette.shadow}`,
            borderBottom: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            backgroundColor: theme.palette.background.paper,
            backgroundClip: 'border-box',
          }),
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            minHeight: 44,
          },
          contained: {
            background: colorPalette.gradients.primary,
            color: colorPalette.primary.contrast,
            '&:hover': {
              background: colorPalette.gradients.primary,
              opacity: 0.9,
            },
          },
          outlined: ({ theme }) => ({
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              borderColor: theme.palette.primary.light,
            },
          }),
          containedSecondary: ({ theme }) => ({
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.3),
            },
          }),
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
          filledSuccess: ({ theme }) => ({
            backgroundColor: colorPalette.status.success,
            color: theme.palette.getContrastText(colorPalette.status.success),
          }),
          filledWarning: ({ theme }) => ({
            backgroundColor: colorPalette.status.warning,
            color: theme.palette.getContrastText(colorPalette.status.warning),
          }),
          filledError: ({ theme }) => ({
            backgroundColor: colorPalette.status.error,
            color: theme.palette.getContrastText(colorPalette.status.error),
          }),
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
          root: ({ theme }) => ({
            borderColor: theme.palette.divider,
          }),
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            minWidth: 44,
            minHeight: 44,
          },
        },
      },
    },
  });
};
