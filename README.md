# CSIM Online

A modern web interface for [CSIM](https://pypi.org/project/csim/) - a code similarity detection and plagiarism analysis tool. Compare two files side-by-side or analyze multiple files in bulk to identify similar code patterns.

![CSIM Online](https://img.shields.io/badge/CSIM-3.3.0-blue)
![Python](https://img.shields.io/badge/Python-3.13+-green)
![React](https://img.shields.io/badge/React-19+-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Dual Editor Mode**: Compare two files side-by-side with syntax highlighting and similarity scoring
- **Bulk Analysis**: Analyze multiple files at once with configurable similarity thresholds
- **Multi-Language Support**: Python 3, Python 3.13, Java 24, C++ 14, Kotlin, C
- **Theme Support**: Light, dark, and system-preference themes
- **Internationalization**: English and Spanish locales
- **Diff Viewer**: Visual side-by-side comparison of matching code
- **File Viewer**: Preview and navigate through uploaded files
- **Session History**: Track and review previous analyses
- **Version Display**: The UI shows the CSIM engine version reported live by the API, plus its own release version

## Tech Stack

### Backend
- **Framework**: FastAPI 0.111.0
- **Server**: Uvicorn 0.23.2
- **Validation**: Pydantic 2.7.1
- **Analysis**: CSIM 3.3.0

### Frontend
- **Framework**: React 19
- **Build**: Vite
- **UI Library**: Material-UI 5
- **Editor**: Monaco Editor
- **Styling**: Emotion (CSS-in-JS)
- **State**: Redux (vanilla)
- **i18n**: react-i18next

## Quick Start

### Prerequisites
- Python 3.13+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd api
pip install -r requirements.txt
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

API endpoints:
- `GET /` - Health check
- `GET /api/version` - Returns the installed CSIM engine version (`{"csim_version": "3.3.0"}`), read live from the `csim` package via `importlib.metadata`. The UI fetches this on load and displays it next to the app title — bump `csim` in `api/requirements.txt` and it propagates automatically, no UI changes needed.
- `POST /api/analyze` - Compare two files
- `POST /api/analyze-all` - Analyze multiple files with threshold

### Frontend Setup

```bash
cd ui
npm install
npm run dev
```

The UI will be available at `http://localhost:3000`

### Production Build

```bash
# Frontend
cd ui
npm run build

# Deploy dist/ folder to static hosting or serve with nginx
```

## Configuration

### Environment Variables

**Frontend** (`.env` or `.env.local`):
```env
VITE_API_URL=http://localhost:8000  # API base URL
```

Default: Falls back to `http://localhost:8000` if not set.

**Backend** (Environment):
No additional configuration needed for local development.

## Supported Languages & Versions

### CSIM 3.3.0 Language Support

| Language | Version | Internal ID | Display Name |
|----------|---------|-------------|--------------|
| Python   | 3 (universal grammar) | `python_3` | Python 3 |
| Python   | 3.13    | `python_3_13` | Python 3.13  |
| Java     | 24      | `java_24`   | Java 24      |
| C++      | 14      | `cpp_14`    | C++ 14       |
| Kotlin   | —       | `kotlin`    | Kotlin |
| C        | —       | `c`         | C |

### Important Notes

- **Language Format**: CSIM requires version-specific language identifiers
- The UI displays friendly names ("Python 3.13") but sends version-specific strings (`python_3_13`) to the API
- **Python 3** (`python_3`) is the default/first option — it uses CSIM's universal grammar and is the recommended choice unless you specifically need 3.13-only syntax
- `java_20` is still accepted by the CSIM library but is no longer offered in the UI's language selector — `java_24` is the only Java option shown
- **Kotlin** (`kotlin`) and **C** (`c`) are new in CSIM 3.3.0
- Supported file extensions: `.py`, `.java`, `.cpp`, `.kt`, `.c`
- Bulk uploads support ZIP archives containing multiple files
- The dropdown is always alphabetically sorted by display name, derived automatically from `languageDisplayNames` — no manual reordering needed when a language is added or removed

## API Documentation

### POST /api/analyze
Compare two files for similarity.

**Request:**
```json
{
  "lang": "python_3_13",
  "threshold": 0.0,
  "files": [
    {
      "name": "file1.py",
      "content": "def hello():\n    print('Hello')"
    },
    {
      "name": "file2.py",
      "content": "def hello():\n    print('Hello')"
    }
  ]
}
```

**Response:**
```json
{
  "result": 1.0
}
```

**Returns:** Similarity score as float (0.0-1.0)

### POST /api/analyze-all
Analyze multiple files with similarity grouping.

**Request:**
```json
{
  "lang": "python_3_13",
  "threshold": 0.5,
  "files": [
    {
      "name": "file1.py",
      "content": "def hello():\n    print('Hello')"
    },
    {
      "name": "file2.py",
      "content": "def hello():\n    print('Hello')"
    },
    {
      "name": "file3.py",
      "content": "def goodbye():\n    print('Bye')"
    }
  ]
}
```

**Response:**
```json
{
  "similarity_groups": [
    ["file1.py", "file2.py"]
  ],
  "similarity_groups_avg": [1.0],
  "unique_groups": ["file3.py"],
  "printable_output": "..."
}
```

## Development

### Project Structure

```
csim-online/
├── api/
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py          # FastAPI application
│   └── requirements.txt
├── ui/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── styles/          # Theme and styling
│   │   ├── utils/           # Utilities (editor, analysis, etc)
│   │   ├── constants/       # Application constants
│   │   ├── hooks/           # Redux store and hooks
│   │   ├── i18n/            # Internationalization
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

### Running Tests

**API Testing:**
```bash
# Test csim 3.0.1 behavior
python3 test_csim_3.py
```

Expected output should show all ✓ marks for python_3_13, java_20, cpp_14, kotlin, c.

### Code Quality

```bash
# Frontend linting
cd ui
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check

# Find unused files/exports
npm run clean
```

## Troubleshooting

### Issue: `{result: null}` or `{results: null}` Response

**Cause**: Usually indicates an error in the analysis pipeline.

**Debug Steps**:
1. Check API logs for error messages
2. Verify language format is correct (should be `python_3_13`, not `python`)
3. Ensure csim 3.3.0 is installed: `pip list | grep csim` (or hit `GET /api/version`)

**Quick Test**:
```bash
# Test API endpoint directly
curl -X POST http://localhost:8000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "lang": "python_3_13",
    "threshold": 0.0,
    "files": [
      {"name": "a.py", "content": "print(\"hi\")"},
      {"name": "b.py", "content": "print(\"hi\")"}
    ]
  }'
```

### Issue: Syntax Highlighting Not Working

**Cause**: Monaco Editor doesn't recognize internal language format.

**Status**: ✅ Fixed in version 3.0.1
- Internal language format (`python_3_13`) is automatically converted to Monaco format (`python`)
- This conversion happens transparently in `utils/editor.js`

### Issue: API Connection Error

**Check**:
1. Is API running? `python3 -m uvicorn app.main:app`
2. Is port 8000 accessible?
3. Check CORS settings in `api/app/main.py` (should allow localhost:3000)

### Issue: Import/Module Errors

**Solution**:
```bash
# Reinstall dependencies
cd api
pip install -r requirements.txt --force-reinstall

cd ../ui
npm install
```

## CSIM 3.3.0 Upgrade Notes

### What Changed

| Aspect | Version 3.2.0 | Version 3.3.0 |
|--------|---------------|----------------|
| Kotlin Support | Not available | `kotlin` — new |
| C Support | Not available | `c` — new |
| Java/Python/C++ Support | Unchanged | Unchanged |

### Notes

- The CSIM library now accepts `python_3_13`, `python_3`, `java_20`, `java_24`, `cpp_14`, `kotlin`, and `c`; the UI's language selector exposes all of these except `java_20`
- No backend migration required — this is purely a `csim` version bump plus a UI language-selector addition

## CSIM 3.2.0 Upgrade Notes

### What Changed

| Aspect | Version 3.0.1/3.1.1 | Version 3.2.0 |
|--------|----------------------|----------------|
| Python Support | `python_3_13` only | `python_3` (universal grammar, now default) and `python_3_13` |
| Java Support | `java_20` only | `java_24` — replaces `java_20` in the UI's language selector |

### Notes

- The CSIM library itself accepts `python_3_13`, `python_3`, `java_20`, `java_24`, and `cpp_14`; the UI's language selector exposes `python_3`, `python_3_13`, `java_24`, and `cpp_14`
- `java_20` was dropped from the dropdown in favor of `java_24`; existing history entries analyzed with `java_20` are unaffected, but re-running that analysis requires selecting `java_24`
- No backend migration required — this is purely a UI language-selector change

## CSIM 3.0.1 Upgrade Notes

### What Changed

| Aspect | Version 2.0.6 | Version 3.0.1 |
|--------|---------------|---------------|
| Language Format | `python`, `java`, `cpp` | `python_3_13`, `java_20`, `cpp_14` |
| Python Support | 3.x | 3.13+ |
| Java Support | 8+ | 20 |
| C++ Support | 11 | 14 |

### Breaking Changes

- ⚠️ Language parameter format changed from base names to version-specific strings
- Any external integrations must be updated to use new language format
- Saved configurations using old format need migration

### Migration Path

If upgrading from CSIM 2.0.6:
1. Update `requirements.txt`: `csim==3.0.1`
2. Update language mappings (see Language Support section)
3. Update any external integrations to use new language format
4. Test with `test_csim_3.py` script

## Deployment

### Docker (Recommended)

```bash
# Build and run with Docker Compose
docker-compose up -d
```

Or manually:

```bash
# Build Docker image
docker build -t csim-online .

# Run container
docker run -p 3000:3000 -p 8000:8000 csim-online
```

### Render.com (Free Tier)

The application is optimized for Render.com free tier:
- RAM: 512 MB
- vCPU: 0.1 shared
- Ephemeral storage
- Auto spin-down after 15 minutes of inactivity

### GitHub Pages (Frontend Only)

```bash
cd ui
npm run deploy
```

This builds and deploys the frontend to GitHub Pages at your configured domain.

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, feature requests, or feedback:
- Open an issue on GitHub
- Contact via email at crew0eddy@gmail.com
- See the "Contact Us" section in the application

## Acknowledgments

- [CSIM](https://pypi.org/project/csim/) - Code similarity analysis library
- [FastAPI](https://fastapi.tiangolo.com/) - Modern Python web framework
- [React](https://react.dev/) - UI library
- [Material-UI](https://mui.com/) - Component library
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) - Code editor

## Versioning

- **CSIM engine version**: driven by a single file, `api/requirements.txt` (`csim==X.Y.Z`). The API reads the installed package version at runtime via `importlib.metadata` and exposes it at `GET /api/version`; the UI fetches it on load and shows it next to the app title. Bump that one line and both API and UI reflect it automatically after a redeploy — no other file needs to change.
- **UI (CSIM Online) version**: tracked in `ui/package.json` (`version`) and tagged in git (e.g. `v1.0.0`). Displayed at the bottom of the sidebar drawer.

## Project Status

- ✅ CSIM 3.3.0 Integration Complete
- ✅ Multi-language Support (Python 3/3.13, Java 24, C++ 14, Kotlin, C)
- ✅ Theme Support (Light/Dark/System)
- ✅ Internationalization (EN/ES)
- ✅ Diff Viewer
- ✅ Bulk Analysis
- ✅ Live CSIM/UI version display
- 🚀 Production Ready

---

**Last Updated**: August 2026  
**CSIM Version**: 3.3.0  
**UI Version**: 1.0.0  
**React Version**: 19+
