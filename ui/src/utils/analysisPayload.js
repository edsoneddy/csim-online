/**
 * Prepares the payload for the csim analysis API.
 */
export const createAnalysisPayload = (language, code1, code2, file1, file2) => {
  return {
    lang: language,
    threshold: 0.0,
    files: [
      {
        name: file1?.name || 'Editor 1',
        content: code1,
      },
      {
        name: file2?.name || 'Editor 2',
        content: code2,
      },
    ],
  };
};
