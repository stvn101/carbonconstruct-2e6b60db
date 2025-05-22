
# CarbonConstruct Theme System

This document outlines the theme system for the CarbonConstruct application, ensuring consistency across all components and pages.

## Color Palette

### Day Mode
- Primary background: `#F8F9FA` (light gray)
- Secondary elements: `#E9ECEF` (soft white)
- Accent colors: `#2B8A3E` (forest green) for interactive elements
- Text: `#212529` (near-black)

### Night Mode
- Primary background: `#212529` (dark charcoal)
- Secondary elements: `#343A40` (deep gray)
- Accent colors: `#2B8A3E` (same green for continuity)
- Text: `#F8F9FA` (light gray)

## Component Standards

### Buttons
- Primary buttons:
  - Background: `#2B8A3E` (green)
  - Text: White `#FFFFFF`
  - Padding: 12px 24px
  - Border radius: 8px

### Cards
- Day mode:
  - Background: `#FFFFFF`
  - Border: `#DEE2E6`
  - Shadow: `0 2px 8px rgba(0,0,0,0.1)`
- Night mode:
  - Background: `#343A40`
  - Border: `#495057`
  - Shadow: `0 2px 8px rgba(255,255,255,0.1)`

### Text
- Heading text: Bold, current foreground color
- Body text: Normal, current foreground color
- Muted text: `#6C757D` (day) / `#ADB5BD` (night)
- Link text: `#2B8A3E` (same for day and night)

## CSS Variables

We use CSS variables for all theme colors and properties. These are defined in `theme-variables.css` and automatically applied based on the current theme.

Example usage:
```css
.my-component {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border: 1px solid hsl(var(--border));
}
```

## Responsive Design

- We use a mobile-first approach
- All components are responsive and adjust appropriately at different breakpoints
- Touch targets on mobile are at least 44px x 44px (WCAG compliant)
- Font sizes increase gradually as screen size increases

## Testing Theme Consistency

Use the ThemeTest component to verify theme consistency across the application:
1. Navigate to `/theme-test` in development mode
2. Toggle between light and dark modes
3. Check for any inconsistencies highlighted by the validator

## Best Practices

1. Always use the CSS variables defined in `theme-variables.css`
2. Never hardcode colors unless absolutely necessary
3. Test all components in both light and dark modes
4. Ensure sufficient contrast for text and interactive elements (WCAG AA standard)
5. Use the ThemeTest component to verify theme consistency

## Z-Index Hierarchy

- `--z-tooltip`: 50 (tooltips, highest)
- `--z-dropdown`: 40 (dropdowns, popovers)
- `--z-modal`: 30 (modals, dialogs)
- `--z-navbar`: 20 (navigation)
- `--z-theme-toggle`: 15 (theme toggle)
- `--z-base`: 10 (base elements)
