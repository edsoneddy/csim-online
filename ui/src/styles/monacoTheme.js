import { colorPalette } from './colorPalette';

const CSIM_DARK_THEME_NAME = 'csimDarkTheme';
const CSIM_LIGHT_THEME_NAME = 'csimLightTheme';

// Monaco mirrors exactly the app's resolved light/dark mode -- no separate
// editor theme picker, no third variant. See docs/theming.md.
export const monacoThemeNameFor = (resolvedMode) =>
  resolvedMode === 'dark' ? CSIM_DARK_THEME_NAME : CSIM_LIGHT_THEME_NAME;

const dark = colorPalette.modes.dark;
const light = colorPalette.modes.light;

/** Registers both custom Monaco themes. Safe to call every mount -- Monaco
 * dedupes by theme name. */
const defineCSIMThemes = (monaco) => {
  monaco.editor.defineTheme(CSIM_DARK_THEME_NAME, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: '', foreground: 'F0F4F8' },
      { token: 'comment', foreground: '10B981', fontStyle: 'italic' },
      { token: 'keyword', foreground: '00ACC1', fontStyle: 'bold' },
      { token: 'storage', foreground: '0097A7' },
      { token: 'string', foreground: 'FFC107' },
      { token: 'regexp', foreground: 'FFD54F' },
      { token: 'delimiter', foreground: 'A0AEC0' },
      { token: 'number', foreground: '4DD0E1' },
      { token: 'type', foreground: '4DD0E1' },
      { token: 'tag', foreground: '00ACC1' },
      { token: 'attribute.name', foreground: 'FFC107' },
      { token: 'attribute.value', foreground: 'FFF9C4' },
    ],
    colors: {
      'editor.background': dark.background,
      'editor.gutter.background': dark.background,
      'editor.lineHighlightBackground': dark.paper,
      'editor.foreground': dark.textPrimary,
      'editor.lineHighlightBorder': dark.border,
      'editorCursor.foreground': colorPalette.primary.main,
      'editor.selectionBackground': '#264F7880',
      'editor.inactiveSelectionBackground': '#264F7840',
      'editorLineNumber.foreground': dark.textSecondary,
      'editorLineNumber.activeForeground': colorPalette.primary.main,
      'editorWidget.background': dark.paper,
      'editorWidget.border': dark.border,
      'editorError.foreground': colorPalette.status.error,
      'editorWarning.foreground': colorPalette.status.warning,
      'editorInfo.foreground': colorPalette.primary.main,
    },
  });

  monaco.editor.defineTheme(CSIM_LIGHT_THEME_NAME, {
    base: 'vs',
    inherit: true,
    rules: [
      { token: '', foreground: '1E293B' },
      { token: 'comment', foreground: '059669', fontStyle: 'italic' },
      { token: 'keyword', foreground: '0097A7', fontStyle: 'bold' },
      { token: 'storage', foreground: '00838F' },
      { token: 'string', foreground: 'B45309' },
      { token: 'regexp', foreground: 'FFA000' },
      { token: 'delimiter', foreground: '64748B' },
      { token: 'number', foreground: '0097A7' },
      { token: 'type', foreground: '0097A7' },
      { token: 'tag', foreground: '0097A7' },
      { token: 'attribute.name', foreground: 'B45309' },
      { token: 'attribute.value', foreground: '92400E' },
    ],
    colors: {
      'editor.background': light.paper,
      'editor.gutter.background': light.paper,
      'editor.lineHighlightBackground': light.background,
      'editor.foreground': light.textPrimary,
      'editor.lineHighlightBorder': light.border,
      'editorCursor.foreground': colorPalette.primary.dark,
      'editor.selectionBackground': '#B2EBF280',
      'editor.inactiveSelectionBackground': '#B2EBF250',
      'editorLineNumber.foreground': light.textSecondary,
      'editorLineNumber.activeForeground': colorPalette.primary.dark,
      'editorWidget.background': light.background,
      'editorWidget.border': light.border,
      'editorError.foreground': colorPalette.status.error,
      'editorWarning.foreground': colorPalette.status.warning,
      'editorInfo.foreground': colorPalette.primary.dark,
    },
  });
};

/** Shared `beforeMount` handler for every `<Editor>`/`<DiffEditor>` in the
 * app. Registers both themes before Monaco creates the editor instance, so
 * the initial `theme` prop resolves correctly on first paint instead of
 * falling back to the built-in light `vs` theme (visible as a white flash,
 * particularly in dark mode) until some later prop change triggers
 * `setTheme()`. */
export const handleMonacoBeforeMount = (monaco) => {
  defineCSIMThemes(monaco);
};
