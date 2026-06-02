export const CSIM_THEME_NAME = 'csimDarkTheme';

export const defineCSIMTheme = (monaco) => {
  monaco.editor.defineTheme(CSIM_THEME_NAME, {
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
      'editor.background': '#0F1419',
      'editor.gutter.background': '#0F1419',
      'editor.lineHighlightBackground': '#1A1F2E',
      'editor.foreground': '#F0F4F8',
      'editor.lineHighlightBorder': '#2D3748',
      'editorCursor.foreground': '#00ACC1',
      'editor.selectionBackground': '#264F7880',
      'editor.inactiveSelectionBackground': '#264F7840',
      'editorLineNumber.foreground': '#A0AEC0',
      'editorLineNumber.activeForeground': '#00ACC1',
      'editorWidget.background': '#1A1F2E',
      'editorWidget.border': '#2D3748',
      'editorError.foreground': '#EF5350',
      'editorWarning.foreground': '#F59E0B',
      'editorInfo.foreground': '#00ACC1',
    },
  });
};
