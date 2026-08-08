# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

CSIM Online is a React web frontend for [CSIM](https://pypi.org/project/csim/), a code similarity/plagiarism detection tool. The UI lets users compare two files side-by-side (Dual Editor) or run bulk similarity analysis across many files (Bulk Editor), and sends the actual analysis work to a separate backend API.

## Commands

```bash
npm run dev            # Start Vite dev server at http://localhost:3000 (HMR)
npm run build           # Production build to dist/
npm run preview         # Preview the production build locally
npm run lint            # ESLint over the whole repo
npm run format          # Prettier write src/**/*.{js,jsx,json,css}
npm run format:check    # Prettier check (no write)
npm run clean           # knip — find unused files/exports/deps
npm run deploy          # Build then publish dist/ via gh-pages
```

There is no test suite/runner configured in this repo (no test script, no test files) — do not assume Jest/Vitest exist.

## Environment

- `VITE_API_URL` (in `.env`) points at the backend API (e.g. `https://csim-online.onrender.com`). Falls back to `http://localhost:8000` if unset. All API calls go through `src/utils/requestHandler.js`.
- `vite.config.js` sets `base: '/csim-online/'` (GitHub Pages deployment path) and dev server port `3000`.
- Docker build: multi-stage `Dockerfile` — `npm run build` in a node:24-alpine builder, then serves `dist/` via nginx.

## Architecture

### State: Redux (not Redux Toolkit)

Plain `redux` (`createStore`) with hand-written action types/creators/reducer — no RTK, no middleware beyond the Redux DevTools extension.

- `src/hooks/redux/store.jsx` — store creation
- `src/hooks/redux/appActionTypes.jsx` — action type string constants
- `src/hooks/redux/appActions.jsx` — action creators
- `src/hooks/redux/appReducer.jsx` — single root reducer, single flat `initialState` tree

The global state shape has three top-level branches: `menu` (sidebar/history drawer open state, active section), `fileManager` (holds `dualEditorFiles` keyed by `FILE_1_KEY`/`FILE_2_KEY` plus `results`, and `bulkEditorFiles` with `files`/`selected`/`results`), and `history` (flat array of past analysis runs, both dual and bulk, rendered by `SessionHistory.jsx`). `infoDialog` holds global error/info modal state. When adding new pieces of shared state, extend this same reducer/action-type pattern rather than introducing a second store or context.

### Two analysis modes share one shell

`App.jsx` → `AppContainer` → `MenuAppBar` + `MenuDrawer` + `ContentBox`, with `ContentBox` switching between sections (`CODE_SECTION`, `HELP_CENTER_SECTION`, `CONTACT_US_SECTION` — see `src/constants/ui.jsx`) based on `state.menu.actualContent`. Inside the code section, `EditorToolbar` + a tab switch selects between:

- **Dual Editor** (`components/CodeEditor/DualEditor/`) — two Monaco editors side by side, calls `POST /api/analyze` with a 2-file payload, shows a single similarity % result.
- **Bulk Editor** (`components/CodeEditor/BulkEditor/`) — a file table (`FileTable*`) for uploading/selecting many files, calls `POST /api/analyze-all` with an array of files + threshold, and renders grouped results (`similarity_groups`, `unique_groups`) via `MultiResultsPanel` and its `MultiResultsPanelParts/` subcomponents.

Both modes build their request payload via `src/utils/analysisPayload.js` (`createAnalyzePayload` / `createAnalyzeAllPayload`), send it with `src/utils/requestHandler.js#sendPostRequest`, and on completion dispatch both a `updateFileManagerResultsByEditorKey` (current results) and an `updateHistory` (append a history entry consumed by `SessionHistory.jsx`). `EDITOR_TYPES`/`TYPE_OF_ANALYSIS`/`TOOLBAR_BUTTONS`/the `*_FILES_KEY` constants live in `src/utils/toolbar.js` and drive which toolbar controls render for each editor type and which reducer branch a result belongs to. Follow this same request → dispatch-results → dispatch-history pattern when touching either analyze flow.

Similarity → color/icon/label mapping (used by both result panels and session history) is centralized in `src/utils/results.jsx` (`getSimilarityColor`, `getSimilarityIcon`, `getSimilarityLabel`) — thresholds are 0–25% success, 25–50% warning, 50–75% alert, 75%+ error, `null` = failed. Reuse these instead of re-deriving thresholds elsewhere.

### Styling

Material UI 5 + Emotion, single dark theme (`src/styles/theme.jsx`), with a hand-maintained color source of truth in `src/styles/colorPalette.js` — see `COLORS.md` for the full palette/rationale (primary cyan `#00ACC1`, amber accent, semantic status colors for similarity levels, dark-mode-only neutrals). Always pull colors from `colorPalette`/`theme` rather than hardcoding hex values, and keep new status-driven UI consistent with the existing green/amber/orange/red similarity scale. Monaco's editor theme is separately defined in `src/styles/monacoTheme.js`.

### Supported languages/files

`src/constants/ui.jsx` defines the supported analysis languages (`python`, `java`, `cpp`), their file extensions, and `.zip` as a supported compressed upload extension (bulk uploads are unzipped client-side via `jszip`). Extend this file, not scattered literals, when adding language/extension support.
