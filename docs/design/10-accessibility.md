# Accessibility

## Color Contrast Requirements

WCAG AA compliance:
- **Normal text**: 4.5:1 minimum contrast ratio
- **Large text (18px+ or 14px+ bold)**: 3:1 minimum
- **UI components**: 3:1 against adjacent colors

### Verified Contrast Ratios

| Combination | Ratio | Grade |
|-------------|-------|-------|
| Gold on dark background | 8.5:1 | AAA |
| White text on dark | 21:1 | AAA |
| Primary text on card | 15:1 | AAA |
| Muted text on card | 4.5:1 | AA |

## Focus States

All interactive elements must have visible focus indicators:

```css
/* Visible focus ring for keyboard navigation */
:focus-visible {
  outline: 2px solid var(--gw2-gold);
  outline-offset: 2px;
}

/* Input focus */
input:focus-visible {
  border-color: var(--gw2-gold);
  box-shadow: 0 0 0 3px oklch(0.72 0.14 85 / 0.2);
}

/* Button focus */
button:focus-visible {
  outline: 2px solid var(--gw2-gold);
  outline-offset: 2px;
}
```

## Reduced Motion

Always respect user preferences for reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Screen Reader Considerations

### Semantic HTML
- Use proper heading hierarchy (h1 → h2 → h3)
- Use semantic elements (`<nav>`, `<main>`, `<aside>`, `<button>`)
- Use lists (`<ul>`, `<ol>`) for grouped items

### ARIA Labels

```tsx
{/* Icon-only buttons must have labels */}
<Button variant="ghost" size="icon" aria-label="Open settings">
  <Settings className="h-5 w-5" />
</Button>

{/* Decorative icons should be hidden */}
<Coins className="h-4 w-4" aria-hidden="true" />
```

### Visually Hidden Text

```tsx
{/* For screen readers only */}
<span className="sr-only">Loading complete</span>
```

### Live Regions

```tsx
{/* Announce dynamic updates */}
<div role="status" aria-live="polite">
  {statusMessage}
</div>
```

## Touch Targets

- Minimum size: 44px x 44px
- Spacing between targets: 8px minimum
- Apply to all clickable/tappable elements

```tsx
{/* Ensure adequate touch target */}
<button className="min-h-11 min-w-11 p-3">
  <Icon />
</button>
```

## Keyboard Navigation

- All interactive elements must be focusable
- Tab order should follow visual order
- Escape key should close modals/dropdowns
- Arrow keys for menu navigation

## Color Independence

- Never use color alone to convey information
- Include icons, text, or patterns alongside color
- Example: Error states should have icon + red color + text

```tsx
{/* Good: icon + color + text */}
<div className="text-destructive flex items-center gap-2">
  <AlertCircle className="h-4 w-4" />
  <span>Error: Invalid input</span>
</div>
```
