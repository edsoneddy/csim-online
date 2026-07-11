// Toolbar Utility Functions
export const EDITOR_TYPES = {
  DUAL_EDITOR: 'Dual Editor',
  BULK_EDITOR: 'Bulk Editor',
};

// Toolbar Buttons
export const LANGUAGE_SELECT = 'language-select';
export const ANALYZE_BUTTON = 'analyze-button';
export const CLEAR_BUTTON = 'clear-button';

// Toolbar Button Configurations
export const TOOLBAR_BUTTONS = {
  [EDITOR_TYPES.DUAL_EDITOR]: [LANGUAGE_SELECT, ANALYZE_BUTTON, CLEAR_BUTTON],
  [EDITOR_TYPES.BULK_EDITOR]: [ANALYZE_BUTTON, CLEAR_BUTTON],
};
