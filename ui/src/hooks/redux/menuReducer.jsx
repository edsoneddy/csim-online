import { CODE_SECTION } from '../../constants/ui';
import {
  OPEN_SIDEBAR_MENU,
  OPEN_LANGUAGE_MENU,
  CHANGE_ACTUAL_CONTENT,
  OPEN_HISTORY_MENU,
  UPDATE_HISTORY,
} from './menuActionTypes';

const initialState = {
  menu: {
    isOpenSidebarMenu: false,
    isOpenLanguageMenu: false,
    isOpenHistoryMenu: false,
    actualContent: CODE_SECTION,
  },
  history: [],
};

const menuReducer = (state = initialState, action) => {
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
    default:
      return state;
  }
};

export default menuReducer;
