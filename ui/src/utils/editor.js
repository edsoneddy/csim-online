import i18n from '../i18n';
import { languageByExtension } from '../constants/ui';

// Map internal language identifiers to Monaco Editor language identifiers
const monacoLanguageMap = {
  python_3_13: 'python',
  python_3: 'python',
  java_24: 'java',
  cpp_14: 'cpp',
  kotlin: 'kotlin',
  c: 'c',
};

export const getMonacoLanguage = (internalLanguage) => {
  return monacoLanguageMap[internalLanguage] || internalLanguage;
};

export const getLanguageFromFileName = (fileName = '') => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return languageByExtension[extension] || 'plaintext';
};

export const formatFileSize = (bytes) => {
  if (typeof bytes !== 'number' || Number.isNaN(bytes)) return i18n.t('common.unknownSize');
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

export const getLineCount = (content) => {
  if (!content) return 0;
  return content.split('\n').length;
};

export const normalizeContent = (content) => {
  if (typeof content === 'string') return content;
  if (content == null) return '';
  if (typeof content === 'object') {
    try {
      return JSON.stringify(content, null, 2);
    } catch {
      return String(content);
    }
  }
  return String(content);
};

export const getFileLabel = (file, index) =>
  file?.name || i18n.t('common.fileLabel', { number: index + 1 });

// Blur the currently focused element
export const blurActiveElement = () => {
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
};
