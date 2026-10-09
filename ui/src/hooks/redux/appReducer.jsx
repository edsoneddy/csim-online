import { CODE_SECTION, DEFAULT_MAX_FILES, FILE_1_KEY, FILE_2_KEY } from '../../constants/ui';
import {
  OPEN_SIDEBAR_MENU,
  CHANGE_ACTUAL_CONTENT,
  OPEN_HISTORY_MENU,
  UPDATE_HISTORY,
  UPDATE_DUAL_EDITOR_FILE_BY_KEY,
  UPDATE_DUAL_EDITOR_FILE_CONTENT_BY_KEY,
  REMOVE_FILES_FROM_BULK_EDITOR,
  ADD_FILES_TO_BULK_EDITOR,
  UPDATE_BULK_EDITOR_SELECTED_FILES,
  REMOVE_ALL_FILES_FROM_BULK_EDITOR,
  UPDATE_FILE_MANAGER_RESULTS_BY_EDITOR_KEY,
  UPDATE_INFO_DIALOG,
  UPDATE_CSIMX_VERSION,
  UPDATE_MAX_FILES,
  UPDATE_ANALYSIS_JOB,
} from './appActionTypes';

const initialState = {
  menu: {
    isOpenSidebarMenu: false,
    isOpenLanguageMenu: false,
    isOpenHistoryMenu: false,
    actualContent: CODE_SECTION,
  },
  appInfo: {
    csimxVersion: null,
    maxFiles: DEFAULT_MAX_FILES,
  },
  // The running bulk job ({ id, state, phase, done, total, etaSeconds }) or null.
  analysisJob: null,
  history: [],
  fileManager: {
    dualEditorFiles: {
      [FILE_1_KEY]: {},
      [FILE_2_KEY]: {},
      results: null,
    },
    bulkEditorFiles: {
      files: [],
      selected: [],
      results: null,
    },
  },
  infoDialog: {
    open: false,
    message: '',
    header: '',
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
    case REMOVE_ALL_FILES_FROM_BULK_EDITOR:
      return {
        ...state,
        fileManager: {
          ...state.fileManager,
          bulkEditorFiles: {
            ...state.fileManager.bulkEditorFiles,
            files: [],
            selected: [],
          },
        },
      };
    case UPDATE_FILE_MANAGER_RESULTS_BY_EDITOR_KEY:
      return {
        ...state,
        fileManager: {
          ...state.fileManager,
          [action.editorKey]: {
            ...state.fileManager[action.editorKey],
            results: action.results,
          },
        },
      };
    case UPDATE_INFO_DIALOG:
      return {
        ...state,
        infoDialog: {
          open: action.open,
          message: action.message || '',
          header: action.header || '',
        },
      };
    case UPDATE_MAX_FILES:
      return {
        ...state,
        appInfo: {
          ...state.appInfo,
          maxFiles: action.maxFiles,
        },
      };
    case UPDATE_CSIMX_VERSION:
      return {
        ...state,
        appInfo: {
          ...state.appInfo,
          csimxVersion: action.csimxVersion,
        },
      };
    case UPDATE_ANALYSIS_JOB:
      return {
        ...state,
        analysisJob: action.job,
      };
    default:
      return state;
  }
};

export default appReducer;
