import {
  OPEN_SIDEBAR_MENU,
  OPEN_LANGUAGE_MENU,
  CHANGE_ACTUAL_CONTENT,
  OPEN_HISTORY_MENU,
  UPDATE_HISTORY,
  UPDATE_DUAL_EDITOR_FILE_BY_KEY,
  UPDATE_DUAL_EDITOR_FILE_CONTENT_BY_KEY,
  ADD_FILES_TO_BULK_EDITOR,
  REMOVE_FILES_FROM_BULK_EDITOR,
  UPDATE_BULK_EDITOR_SELECTED_FILES,
} from './appActionTypes';

export const openSidebarMenu = () => ({
  type: OPEN_SIDEBAR_MENU,
});

export const openLanguageMenu = () => ({
  type: OPEN_LANGUAGE_MENU,
});

export const changeActualContent = (actualContent) => ({
  type: CHANGE_ACTUAL_CONTENT,
  content: actualContent,
});

export const openHistoryMenu = () => ({
  type: OPEN_HISTORY_MENU,
});

export const updateHistory = (history) => ({
  type: UPDATE_HISTORY,
  history,
});

export const updateDualEditorFileByKey = (keyFile, file) => ({
  type: UPDATE_DUAL_EDITOR_FILE_BY_KEY,
  keyFile,
  file,
});

export const updateDualEditorFileContentByKey = (keyFile, content) => ({
  type: UPDATE_DUAL_EDITOR_FILE_CONTENT_BY_KEY,
  keyFile,
  content,
});

export const addFilesToBulkEditor = (files) => ({
  type: ADD_FILES_TO_BULK_EDITOR,
  files,
});

export const removeFilesFromBulkEditor = (fileIds) => ({
  type: REMOVE_FILES_FROM_BULK_EDITOR,
  fileIds,
});

export const updateBulkEditorSelectedFiles = (selectedFiles) => ({
  type: UPDATE_BULK_EDITOR_SELECTED_FILES,
  selectedFiles,
});
