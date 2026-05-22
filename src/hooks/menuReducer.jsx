import { CODE_SECTION } from "../constants/menu";
import { OPEN_SIDEBAR_MENU, OPEN_LANGUAGE_MENU, CHANGE_ACTUAL_CONTENT } from "./menuActionTypes";

const initialState = {
  menu: {
    isOpenSidebarMenu: false,
    isOpenLanguageMenu: false,
    actualContent: CODE_SECTION,
  }
};

const menuReducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_SIDEBAR_MENU:
      return {
        ...state,
        menu: {
          ...state.menu,
          isOpenSidebarMenu: !state.menu.isOpenSidebarMenu,
        }
      };
    case OPEN_LANGUAGE_MENU:
      return {
        ...state,
        menu: {
          ...state.menu,
          isOpenLanguageMenu: !state.menu.isOpenLanguageMenu,
        }
      };    
    case CHANGE_ACTUAL_CONTENT:
      return {
        ...state,
        menu: {
          ...state.menu,
          actualContent: action.content,
        }
      };
    default:
      return state;
  }
};

export default menuReducer;
