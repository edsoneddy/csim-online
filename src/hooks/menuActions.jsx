import { OPEN_SIDEBAR_MENU, OPEN_LANGUAGE_MENU, CHANGE_ACTUAL_CONTENT } from "./menuActionTypes";

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
