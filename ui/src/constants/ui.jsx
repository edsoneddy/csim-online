export const drawerWidth = 240;

// Sections
export const CODE_SECTION = 'CODE_SECTION';
export const HELP_CENTER_SECTION = 'HELP_CENTER_SECTION';
export const CONTACT_US_SECTION = 'CONTACT_US_SECTION';

// Language Options
export const defaultLanguage = 'python_3';
// Supported File Extensions
export const SUPPORTED_EXTENSIONS = ['.py', '.java', '.cpp', '.kt', '.c'];
export const defaultThreshold = 75;
export const languageByExtension = {
  py: 'python_3_13',
  java: 'java_24',
  cpp: 'cpp_14',
  kt: 'kotlin',
  c: 'c',
};

export const SUPPORTED_COMPRESSED_EXTENSIONS = ['.zip'];

// Language Display Names — the single source of truth for supported languages.
// languageOptions is derived from these keys, alphabetically sorted by display
// name, so the dropdown stays ordered automatically as languages are added.
export const languageDisplayNames = {
  python_3_13: 'Python 3.13',
  python_3: 'Python 3',
  java_24: 'Java 24',
  cpp_14: 'C++ 14',
  kotlin: 'Kotlin',
  c: 'C',
};

export const languageOptions = Object.keys(languageDisplayNames).sort((a, b) =>
  languageDisplayNames[a].localeCompare(languageDisplayNames[b])
);

// File Manager
export const FILE_1_KEY = 'file1';
export const FILE_2_KEY = 'file2';
