# CSIM Online

Modern web interface to run [CSIM](https://pypi.org/project/csim/) - code similarity detection tool.

## 🎯 Objectives

CSIM Online is a web application that provides:

- 📊 **Code Similarity Detection** - Compare source code files
- 🔍 **Structure Analysis** - Uses parse trees and tree edit distance
- 🛡️ **Plagiarism Detection** - Identifies similar or obfuscated code

## Tech Stack

- **Frontend:** React 18 + Vite 5
- **UI:** Material-UI 5 + Emotion
- **State:** Redux
- **Editor:** Monaco Editor
- **Virtualization:** React Virtualized

## Quick Start

This UI needs the CSIM Online backend API running to actually perform analyses. Start the backend first, then the frontend.

### Prerequisites

- Node.js 18+
- npm or yarn
- Python 3.13+ (for the backend, see below)

### Backend Setup

The backend lives in `../api` (one level up from this folder).

```bash
cd ../api
pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at [http://localhost:8000](http://localhost:8000).

### Frontend Setup

```bash
npm install
npm run dev
```

Opens [http://localhost:3000](http://localhost:3000) - HMR enabled, ~90ms startup.

By default the UI talks to the API at `http://localhost:8000`. To point it elsewhere, create a `.env` file in this folder:

```env
VITE_API_URL=http://localhost:8000
```

### Production

```bash
npm run build      # Build
npm run preview    # Preview
```

## Project Structure

```
src/
├── components/          # UI Components
├── hooks/              # Redux store and reducers
├── constants/          # Constants
├── utils/              # Utilities
├── App.jsx             # Main component
└── main.jsx            # Entry point
```

## Features

- 🎨 Material-UI dark theme
- ⚡ Ultra-fast development with Vite
- 📝 Monaco editor with syntax highlighting
- 🔄 Side-by-side code comparison
- 📋 JSON tools (format, validate, minify)

## Deployment

```bash
npm run build
# Deploy 'dist/' to Vercel, Netlify, or any static host
```

## Resources

- [CSIM PyPI](https://pypi.org/project/csim/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
