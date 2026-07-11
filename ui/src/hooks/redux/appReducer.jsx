import { CODE_SECTION, FILE_1_KEY, FILE_2_KEY } from '../../constants/ui';
import {
  OPEN_SIDEBAR_MENU,
  OPEN_LANGUAGE_MENU,
  CHANGE_ACTUAL_CONTENT,
  OPEN_HISTORY_MENU,
  UPDATE_HISTORY,
  UPDATE_DUAL_EDITOR_FILE_BY_KEY,
  UPDATE_DUAL_EDITOR_FILE_CONTENT_BY_KEY,
  REMOVE_FILES_FROM_BULK_EDITOR,
  ADD_FILES_TO_BULK_EDITOR,
  UPDATE_BULK_EDITOR_SELECTED_FILES,
} from './appActionTypes';

const initialState = {
  menu: {
    isOpenSidebarMenu: false,
    isOpenLanguageMenu: false,
    isOpenHistoryMenu: false,
    actualContent: CODE_SECTION,
  },
  history: [],
  fileManager: {
    dualEditorFiles: {
      [FILE_1_KEY]: {},
      [FILE_2_KEY]: {},
    },
    bulkEditorFiles: {
      files: [],
      selected: [],
    },
  },
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_SIDEBAR_MENU:
      return {
        ...state,
        menu: {
          ...state.menu,
          isOpenSidebarMenu: !state.menu.isOpenSidebarMenu,
        },
      };
    case OPEN_LANGUAGE_MENU:
      return {
        ...state,
        menu: {
          ...state.menu,
          isOpenLanguageMenu: !state.menu.isOpenLanguageMenu,
        },
      };
    case CHANGE_ACTUAL_CONTENT:
      return {
        ...state,
        menu: {
          ...state.menu,
          actualContent: action.content,
        },
      };
    case OPEN_HISTORY_MENU:
      return {
        ...state,
        menu: {
          ...state.menu,
          isOpenHistoryMenu: !state.menu.isOpenHistoryMenu,
        },
      };
    case UPDATE_HISTORY:
      return {
        ...state,
        history: action.history,
      };
    case UPDATE_DUAL_EDITOR_FILE_BY_KEY:
      return {
        ...state,
        fileManager: {
          ...state.fileManager,
          dualEditorFiles: {
            ...state.fileManager.dualEditorFiles,
            [action.keyFile]: action.file,
          },
        },
      };
    case UPDATE_DUAL_EDITOR_FILE_CONTENT_BY_KEY:
      return {
        ...state,
        fileManager: {
          ...state.fileManager,
          dualEditorFiles: {
            ...state.fileManager.dualEditorFiles,
            [action.keyFile]: {
              ...state.fileManager.dualEditorFiles[action.keyFile],
              content: action.content,
            },
          },
        },
      };

    case ADD_FILES_TO_BULK_EDITOR:
      return {
        ...state,
        fileManager: {
          ...state.fileManager,
          bulkEditorFiles: {
            ...state.fileManager.bulkEditorFiles,
            files: [...state.fileManager.bulkEditorFiles.files, ...action.files],
          },
        },
      };

    case REMOVE_FILES_FROM_BULK_EDITOR:
      return {
        ...state,
        fileManager: {
          ...state.fileManager,
          bulkEditorFiles: {
            ...state.fileManager.bulkEditorFiles,
            files: state.fileManager.bulkEditorFiles.files.filter(
              (file) => !action.fileIds.includes(file.id)
            ),
          },
        },
      };
    case UPDATE_BULK_EDITOR_SELECTED_FILES:
      return {
        ...state,
        fileManager: {
          ...state.fileManager,
          bulkEditorFiles: {
            ...state.fileManager.bulkEditorFiles,
            selected: action.selectedFiles,
          },
        },
      };
    default:
      return state;
  }
};

export default appReducer;
