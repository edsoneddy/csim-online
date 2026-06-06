# 🎨 CSIM Online - Color Palette & Design System

## Color Palette Overview

### 🔵 Primary Color - Trust & Professionalism
```
Cyan #00ACC1
Light: #4DD0E1
Lighter: #B2EBF2
Dark: #0097A7
Darker: #00838F
```
**Usage:** Main actions, primary buttons, links, active states
**Psychology:** Trust, innovation, technology, professionalism
**Accessibility:** WCAG AA compliant

---

### 🟡 Accent Color - Warmth & Attention
```
Amber #FFC107
Light: #FFD54F
Lighter: #FFF9C4
Dark: #FFA000
Darker: #FF6F00
```
**Usage:** Call-to-action, highlights, secondary buttons, notifications
**Psychology:** Warmth, energy, attention-grabbing
**Best for:** Buttons, important elements that need user attention

---

### 🟢 Status Colors - Semantic Meaning

#### Success (Low Similarity)
```
Emerald Green #10B981
```
Usage: ✅ All good, low match percentage (0-25%)

#### Warning (Medium Similarity)
```
Amber-Orange #F59E0B
```
Usage: ⚠️ Medium match (25-50%)

#### Alert (High Similarity)
```
Orange #FF9800
```
Usage: ⚠️ High match, needs attention (50-75%)

#### Error (Critical)
```
Red #EF5350
```
Usage: ❌ Critical match, possible plagiarism (75%+)

---

### ⚫ Neutral Colors - Backgrounds & Text

#### Dark Mode (Default)
```
Background: #0F1419 (Deep dark blue-black)
Paper: #1A1F2E (Card backgrounds)
Border: #2D3748 (Borders)
Text Primary: #F0F4F8 (Light text)
Text Secondary: #A0AEC0 (Muted text)
```

#### Light Mode (Future)
```
Background: #F8FAFC (Very light blue)
Paper: #FFFFFF (White)
Border: #E2E8F0 (Light borders)
Text Primary: #1E293B (Dark text)
Text Secondary: #64748B (Muted text)
```

---

## Color Harmony System

### Triadic Color Scheme (Used)
- **Primary:** Cyan #00ACC1 (60% - Main color)
- **Accent:** Amber #FFC107 (30% - Supporting)
- **Status:** Red/Green #EF5350/#10B981 (10% - Indicators)

This creates a balanced, professional look with warm accents.

---

## Accessibility Compliance

✅ **WCAG AA Standards**
- Text/background contrast ratio: 4.5:1+
- Color not the only indicator (backed by icons)
- Colorblind-friendly combinations
- Sufficient luminance contrast

---

## Component Color Usage

### Buttons
- **Primary (Contained):** Cyan gradient background
- **Secondary (Outlined):** Cyan border, light hover state
- **Hover:** 90% opacity of gradient

### Chips
- **Success:** Emerald background
- **Warning:** Amber background
- **Error:** Red background

### Progress Indicators
- **Low Match (0-25%):** Emerald
- **Medium Match (25-50%):** Amber
- **High Match (50-75%):** Orange
- **Critical (75%+):** Red

### Backgrounds
- **Primary Surface:** #1A1F2E
- **Elevated Surface:** #2D3748
- **Hover State:** #2D3748 with opacity

### Borders & Dividers
- **Default:** #2D3748 (#00ACC1 with 10% opacity)
- **Subtle:** #2D3748 lighter shade

---

## Gradients

### Primary Gradient
```css
linear-gradient(135deg, #00ACC1 0%, #0097A7 100%)
```
Used for: Primary buttons, important CTAs, visual hierarchy

### Success Gradient
```css
linear-gradient(135deg, #10B981 0%, #059669 100%)
```
Used for: Success states, positive indicators

### Warning Gradient
```css
linear-gradient(135deg, #F59E0B 0%, #D97706 100%)
```
Used for: Warnings, attention-required states

### Error Gradient
```css
linear-gradient(135deg, #EF5350 0%, #E53935 100%)
```
Used for: Errors, critical alerts

### Accent Gradient
```css
linear-gradient(135deg, #FFC107 0%, #FF9800 100%)
```
Used for: Warmth, energy, secondary highlights

---

## Color Application Best Practices

### ✅ DO
- Use cyan as primary brand color across all interfaces
- Use status colors consistently (green = good, red = bad)
- Apply gradients for depth and visual interest
- Maintain 4.5:1 contrast ratio for text
- Use icons alongside colors for meaning

### ❌ DON'T
- Use multiple different blues (stick to cyan)
- Rely solely on color for information (use text/icons)
- Use more than 3 colors in one component
- Apply gradient to text (only backgrounds)
- Use low contrast combinations

---

## File Structure

```
src/styles/
  ├── colorPalette.js (Main color definitions)
  ├── theme.jsx (Material UI theme configuration)
  └── ...

Components using colorPalette:
  ├── ResultsPanel.jsx
  ├── SessionHistory.jsx
  ├── MatchNavigation.jsx
  └── ...
```

---

## Import Example

```javascript
import { colorPalette } from '../../styles/colorPalette';

// Usage
sx={{
  backgroundColor: colorPalette.primary.main,
  color: colorPalette.neutral.white,
  border: `1px solid ${colorPalette.darkMode.border}`,
}}
```

---

## Future Enhancements

- [ ] Light mode theme implementation
- [ ] CSS variables for theme switching
- [ ] Advanced dark/light mode toggle
- [ ] Color accessibility audit tool
- [ ] Storybook component showcase with colors

---

**Last Updated:** June 2, 2026
**Compliance:** WCAG AA Level, WCAG AAA ready
**Design System:** Material UI 5.x compatible
