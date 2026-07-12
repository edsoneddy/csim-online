export const TYPE_OF_ANALYSIS = {
  DUAL: 'dual',
  BULK: 'bulk',
};

// Toolbar Utility Functions
export const EDITOR_TYPES = {
  DUAL_EDITOR: 'Dual Editor',
  BULK_EDITOR: 'Bulk Editor',
};

// Toolbar Buttons
export const LANGUAGE_SELECT = 'language-select';
export const ANALYZE_BUTTON = 'analyze-button';
export const CLEAR_BUTTON = 'clear-button';
export const THRESHOLD_SLIDER = 'threshold-slider';

// Toolbar Button Configurations
export const TOOLBAR_BUTTONS = {
  [EDITOR_TYPES.DUAL_EDITOR]: [LANGUAGE_SELECT, ANALYZE_BUTTON, CLEAR_BUTTON],
  [EDITOR_TYPES.BULK_EDITOR]: [LANGUAGE_SELECT, THRESHOLD_SLIDER, ANALYZE_BUTTON, CLEAR_BUTTON],
};

export const DUAL_EDITOR_FILES_KEY = 'dualEditorFiles';
export const BULK_EDITOR_FILES_KEY = 'bulkEditorFiles';
