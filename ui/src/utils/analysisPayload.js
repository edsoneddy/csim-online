import i18n from '../i18n';

/**
 * Prepares the payload for the csim analysis API.
 */
export const createAnalyzePayload = (language, file1, file2) => {
  return {
    lang: language,
    threshold: 0.0,
    files: [
      {
        name: file1?.name || i18n.t('common.editorLabel', { number: 1 }),
        content: file1?.content,
      },
      {
        name: file2?.name || i18n.t('common.editorLabel', { number: 2 }),
        content: file2?.content,
      },
    ],
  };
};

export const createAnalyzeAllPayload = (language, files, threshold = 0.0) => {
  const payload = {
    lang: language,
    threshold: threshold,
    files: files.map((file) => ({
      name: file.name || i18n.t('common.untitledFile'),
      content: file.content,
    })),
  };

  return payload;
};
