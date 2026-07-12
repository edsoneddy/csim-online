/**
 * Prepares the payload for the csim analysis API.
 */
export const createAnalyzePayload = (language, file1, file2) => {
  return {
    lang: language,
    threshold: 0.0,
    files: [
      {
        name: file1?.name || 'Editor 1',
        content: file1?.content,
      },
      {
        name: file2?.name || 'Editor 2',
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
      name: file.name || 'Untitled',
      content: file.content,
    })),
  };

  return payload;
};
