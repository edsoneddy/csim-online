/**
 * CSIM Online color tokens — the single source of truth for the app's palette.
 *
 * Consumed only by src/styles/theme.jsx (builds the light/dark MUI themes)
 * and src/styles/monacoTheme.js (mirrors the same brand/status hues for the
 * editor). Components should never import this directly — read colors via
 * `theme.palette.*` (the `sx` prop, `useTheme()`, or a styled/override
 * callback), so every color stays reactive to the active light/dark mode.
 *
 * Design Principles:
 * - Primary: Cyan/Blue (#00ACC1) - Trust, Professional, Tech
 * - Accent: Amber (#FFC107) - Attention, Warmth, Action
 * - Success: Emerald Green (#10B981) - Safety, All Good
 * - Warning: Orange (#FF9800) - Caution, Medium Risk
 * - Error: Red (#EF5350) - Critical, High Risk
 */

export const colorPalette = {
  // Brand colors — identical in both light and dark themes.
  primary: {
    main: '#00ACC1', // Cyan - Primary action & trust
    light: '#4DD0E1', // Light cyan
    lighter: '#B2EBF2', // Very light cyan
    dark: '#0097A7', // Dark cyan
    darker: '#00838F', // Very dark cyan
    // Text color for content placed on `main`/the primary gradient. White
    // only reaches ~2.7-3.5:1 there (fails WCAG AA 4.5:1); this dark ink
    // clears 4.5:1 at both ends of the gradient.
    contrast: '#0F1419',
  },
  accent: {
    main: '#FFC107', // Amber - Warm, attention-grabbing
    light: '#FFD54F', // Light amber
    lighter: '#FFF9C4', // Very light amber
    dark: '#FFA000', // Dark amber
    darker: '#FF6F00', // Very dark amber
    contrast: '#212121', // Dark text on light background
  },

  // Similarity/status tiers for analysis result badges (Chips, icons). Each
  // is a self-contained badge (its own background + white text), so kept
  // identical across light/dark rather than threaded through the theme mode.
  status: {
    success: '#10B981', // Emerald - Low similarity (Good)
    warning: '#F59E0B', // Amber-Orange - Medium similarity (Caution)
    alert: '#FF9800', // Orange - High similarity (Warning) — MUI has no standard slot for this tier
    error: '#EF5350', // Red - Critical similarity (Danger)
    failed: '#B0BEC5', // Gray - Analysis failed or no data
  },

  // Semantic accents for UI chrome (not analysis results).
  semantic: {
    info: '#03A9F4', // Blue - Information
    hint: '#29B6F6', // Light blue - Tooltip background
  },

  // Decorative gradients, built from the brand/status colors above — also
  // mode-independent.
  gradients: {
    primary: 'linear-gradient(135deg, #00ACC1 0%, #0097A7 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    error: 'linear-gradient(135deg, #EF5350 0%, #E53935 100%)',
    accent: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)',
  },

  // Elevation shadow tone — translucent black reads correctly on both
  // modes (MUI's own default light-theme shadows are black too).
  shadow: 'rgba(0, 0, 0, 0.2)',

  // Everything below DOES change between modes: surfaces, borders, text.
  modes: {
    dark: {
      background: '#0F1419', // Deep dark blue-black
      paper: '#1A1F2E', // Dark card background
      border: '#2D3748', // Dark borders
      textPrimary: '#F0F4F8', // Light text
      textSecondary: '#A0AEC0', // Secondary text
    },
    light: {
      background: '#F8FAFC', // Very light blue
      paper: '#FFFFFF', // White cards
      border: '#E2E8F0', // Light borders
      textPrimary: '#1E293B', // Dark text
      textSecondary: '#64748B', // Secondary text
    },
  },
};

/**
 * Color Harmony Reference:
 *
 * Triadic Harmony (Used):
 * - Primary: Cyan #00ACC1
 * - Accent: Amber #FFC107
 * - Complementary: Used in status colors
 *
 * Accessibility:
 * - Text/background combinations target WCAG AA (4.5:1 for normal text)
 * - Color is never the only indicator (backed by icons/text)
 *
 * Psychology:
 * - Cyan: Trust, innovation, professionalism
 * - Amber: Warmth, energy, attention
 * - Green: Safety, growth, positive
 * - Orange/Red: Warning, urgency, errors
 */
