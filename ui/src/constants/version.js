import packageJson from '../../package.json';

// Single source of truth for the UI version: bump package.json and it
// propagates here automatically (kept in sync with the git tag on release).
export const UI_VERSION = packageJson.version;
