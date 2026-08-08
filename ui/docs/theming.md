# Theming

The app supports `light`, `dark`, and `system` (follows the OS, live). All
color values flow from one source of truth — nothing else in the codebase
should define a color.

## Architecture

```
src/styles/colorPalette.js   raw color tokens (brand, status, per-mode surfaces)
src/styles/theme.jsx         buildTheme(mode) -> a full MUI theme for 'light' | 'dark'
src/styles/monacoTheme.js    two Monaco themes, sourced from the same tokens
src/theme/ThemeModeContext.jsx  mode state: 'light' | 'dark' | 'system' + resolvedMode
src/components/Layout/ThemeToggle.jsx  the toolbar switcher
```

`App.jsx` wraps the tree in `ThemeModeProvider`, reads `resolvedMode` from
`useThemeMode()`, and builds the MUI theme with
`createTheme(buildTheme(resolvedMode), muiLocale)`. Every component reads
colors back out via `theme.palette.*` — the `sx` prop, `useTheme()`, or a
component style-override callback (`({ theme }) => ({...})`). No component
should ever import `colorPalette` directly; the one sanctioned exception is
`src/utils/results.jsx`, which can't use React hooks and whose similarity
badge colors are self-contained (own background + white text), so they don't
need to vary by mode.

## Mode state: a context, not Redux

`ThemeModeContext` mirrors how `src/i18n` handles language — a small
dedicated provider, not Redux. Theme mode is a cross-cutting rendering
concern, not domain state (files/results/history), so it gets its own
provider rather than pulling an unrelated concern into the app's data store.

- **Default**: `system` on first visit.
- **Persistence**: explicit choice is written to
  `localStorage['csim_theme_mode']` and takes precedence over the OS setting
  on every subsequent load.
- **Live system updates**: a `matchMedia('(prefers-color-scheme: dark)')`
  listener updates `resolvedMode` immediately when the OS setting changes
  while `mode === 'system'` — no reload needed.
- **No flash on load**: `useState`'s lazy initializer resolves the mode
  synchronously during React's first render (before anything paints). A
  small inline script in `index.html` additionally sets
  `<html data-theme-mode>` and a matching background before the JS bundle
  even loads, so there's no flash during that brief window either. Keep the
  two hex values in that script's `<style>` block in sync with
  `colorPalette.js`'s `modes.dark.background` / `modes.light.background`.

## Adding or adjusting a palette color

1. **Brand/status colors** (`primary`, `accent`, `status`, `semantic`,
   `gradients`, `shadow`) live at the top level of `colorPalette.js` and are
   identical in both themes. Edit the value there — it propagates to
   `theme.jsx`, `monacoTheme.js`, and `utils/results.jsx` automatically.
2. **Surface colors that must differ by mode** (background, paper, border,
   text) live under `colorPalette.js`'s `modes.dark` / `modes.light`. Add or
   edit both — there's no fallback if one is missing.
3. If you need a genuinely new *semantic* slot MUI's standard palette has no
   room for (the way `status.alert` covers the "high similarity" tier
   `warning` was already taken by), add it to `theme.jsx`'s
   `palette.status` block rather than inventing a new ad-hoc prop — that's
   the one extension point already wired through.
4. Never write a raw hex or `rgba(...)` value directly in a component. If
   you need a translucent tint of an existing color (a hover state, a subtle
   background wash), use MUI's `alpha(theme.palette.x.main, 0.1)` from
   `@mui/material/styles` — that's how the table toolbar/header/row-selected
   backgrounds are built, so they scale correctly to both themes for free
   instead of needing separate light/dark values.

## Monaco

Monaco gets exactly two themes (`csimDarkTheme` / `csimLightTheme`, defined
in `monacoTheme.js`) — it mirrors the app's `resolvedMode`, nothing more.
Every `<Editor>`/`<DiffEditor>` in the app:

- calls the shared `handleMonacoBeforeMount` in its `beforeMount` (registers
  both themes — cheap, Monaco dedupes by name, safe to call every mount —
  *before* Monaco creates the editor instance), and
- passes `theme={monacoThemeNameFor(resolvedMode)}` as a prop.

Registration must happen in `beforeMount`, not `onMount`: Monaco resolves the
`theme` prop when it creates the editor, which happens before `onMount`
fires. If the custom theme name isn't registered yet at creation time, Monaco
silently falls back to its built-in light `vs` theme (a white flash, most
visible in dark mode) and `@monaco-editor/react` only calls `setTheme()`
again when the `theme` prop value changes — so a mode that was correct on a
later prop change could still start wrong on first mount.

`@monaco-editor/react` applies a changed `theme` prop via
`monaco.editor.setTheme()` internally rather than remounting, so switching
app theme mode never touches editor content, cursor position, or undo
history — confirmed by typing into an editor, switching modes, and checking
the content survived.

## Checked for contrast in both themes

Dialogs, menus/popovers, tooltips, tables/lists (including hover and
selected-row states), form inputs, disabled controls, and the Monaco chrome
(gutter, line-highlight, selection, widgets) were all reviewed in both
modes. There's no `<canvas>` or hand-drawn SVG in the app — all icons are
MUI Icons colored via `sx`, so they inherit correctly once their color
source does.
