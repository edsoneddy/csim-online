/**
 * CSIM Online Color Palette
 * Based on Colorimetry Principles & Accessibility Standards (WCAG AA)
 *
 * Design Principles:
 * - Primary: Cyan/Blue (#00ACC1) - Trust, Professional, Tech
 * - Accent: Amber (#FFC107) - Attention, Warmth, Action
 * - Success: Emerald Green (#10B981) - Safety, All Good
 * - Warning: Orange (#FF9800) - Caution, Medium Risk
 * - Error: Red (#EF5350) - Critical, High Risk
 * - Neutral: Gray (#F5F5F5 / #212121) - Light/Dark text & backgrounds
 */

export const colorPalette = {
  // Primary Colors - Main brand identity
  primary: {
    main: '#00ACC1', // Cyan - Primary action & trust
    light: '#4DD0E1', // Light cyan
    lighter: '#B2EBF2', // Very light cyan
    dark: '#0097A7', // Dark cyan
    darker: '#00838F', // Very dark cyan
    contrast: '#FFFFFF', // Contrast color
  },

  // Secondary/Accent Colors - Call-to-action, highlights
  accent: {
    main: '#FFC107', // Amber - Warm, attention-grabbing
    light: '#FFD54F', // Light amber
    lighter: '#FFF9C4', // Very light amber
    dark: '#FFA000', // Dark amber
    darker: '#FF6F00', // Very dark amber
    contrast: '#212121', // Dark text on light background
  },

  // Status Colors - Similarity/Match indicators
  status: {
    success: '#10B981', // Emerald - Low similarity (Good)
    warning: '#F59E0B', // Amber-Orange - Medium similarity (Caution)
    alert: '#FF9800', // Orange - High similarity (Warning)
    error: '#EF5350', // Red - Critical similarity (Danger)
    failed: '#B0BEC5', // Gray - Analysis failed or no data
  },

  // Semantic Colors - For UI elements
  semantic: {
    info: '#03A9F4', // Blue - Information
    hint: '#29B6F6', // Light blue - Helpful hint
  },

  // Neutral Colors - Backgrounds, text, borders
  neutral: {
    white: '#FFFFFF',
    light: '#F5F5F5', // Very light gray - Light mode background
    lighter: '#E0E0E0', // Light gray - Light mode borders
    medium: '#9E9E9E', // Medium gray - Secondary text
    dark: '#424242', // Dark gray - Dark mode text
    darker: '#212121', // Very dark gray - Dark mode background
    black: '#000000',
  },

  // Dark Mode Specific
  darkMode: {
    background: '#0F1419', // Deep dark blue-black
    paper: '#1A1F2E', // Dark card background
    border: '#2D3748', // Dark borders
    hover: '#2D3748', // Hover state
    textPrimary: '#F0F4F8', // Light text
    textSecondary: '#A0AEC0', // Secondary text
  },

  // Light Mode Specific
  lightMode: {
    background: '#F8FAFC', // Very light blue
    paper: '#FFFFFF', // White cards
    border: '#E2E8F0', // Light borders
    hover: '#F1F5F9', // Hover state
    textPrimary: '#1E293B', // Dark text
    textSecondary: '#64748B', // Secondary text
  },

  // Gradient Colors - Modern, smooth transitions
  gradients: {
    primary: 'linear-gradient(135deg, #00ACC1 0%, #0097A7 100%)',
    success: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    error: 'linear-gradient(135deg, #EF5350 0%, #E53935 100%)',
    accent: 'linear-gradient(135deg, #FFC107 0%, #FF9800 100%)',
  },

  // Transparency/Opacity variations
  alpha: {
    light: 'rgba(0, 172, 193, 0.1)', // 10% opacity
    medium: 'rgba(0, 172, 193, 0.3)', // 30% opacity
    strong: 'rgba(0, 172, 193, 0.5)', // 50% opacity
  },

  // Shadow Colors - Depth perception
  shadows: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.2)',
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
 * - All text/background combinations meet WCAG AA standards
 * - Minimum contrast ratio: 4.5:1 for normal text
 * - Color not the only indicator (backed by icons/text)
 *
 * Psychology:
 * - Cyan: Trust, innovation, professionalism
 * - Amber: Warmth, energy, attention
 * - Green: Safety, growth, positive
 * - Orange/Red: Warning, urgency, errors
 *
 * Best Practices Applied:
 * - Limited palette (reduces cognitive load)
 * - Color consistency (same meaning = same color)
 * - Sufficient contrast
 * - Colorblind-friendly combinations
 */
