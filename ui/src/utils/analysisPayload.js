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

export const createAnalyzeAllPayload = (
  language,
  files,
  threshold = 0.0,
  prefilterMargin = null
) => {
  const payload = {
    lang: language,
    threshold: threshold,
    // The id travels with each file: names can repeat (a zip keeps only the file name of each
    // entry) and the groups come back as ids. Only sent when every file has one.
    files: files.map((file) => ({
      ...(files.every((f) => f.id) && { id: String(file.id) }),
      name: file.name || i18n.t('common.untitledFile'),
      content: file.content,
    })),
  };

  if (prefilterMargin != null) {
    payload.prefilter_margin = prefilterMargin;
  }

  return payload;
};
