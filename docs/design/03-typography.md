# Typography

## Font Stack

```css
/* Primary - Clean, readable, slightly geometric */
--font-sans: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;

/* Monospace - For numbers, timers, data */
--font-mono: "JetBrains Mono", "Fira Code", "SF Mono", monospace;
```

Note: Inter provides excellent readability at small sizes while maintaining a modern feel.

## Type Scale

| Name | Size | Line Height | Weight | Usage |
|------|------|-------------|--------|-------|
| xs | 0.75rem (12px) | 1rem | 400 | Captions, timestamps |
| sm | 0.875rem (14px) | 1.25rem | 400 | Secondary text, descriptions |
| base | 1rem (16px) | 1.5rem | 400 | Body text |
| lg | 1.125rem (18px) | 1.75rem | 500 | Large body, card titles |
| xl | 1.25rem (20px) | 1.75rem | 600 | Section headers |
| 2xl | 1.5rem (24px) | 2rem | 700 | Page titles |
| 3xl | 1.875rem (30px) | 2.25rem | 700 | Hero text |
| 4xl | 2.25rem (36px) | 2.5rem | 700 | Large stat values |

## Letter Spacing

```css
--tracking-tight:  -0.025em;   /* Headings */
--tracking-normal: 0;          /* Body */
--tracking-wide:   0.05em;     /* Labels, badges, uppercase */
```

## Font Weights

```css
--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

## Typography Utilities

```css
/* Stat display value */
.stat-value {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  color: var(--text-gold);
}

/* Stat label */
.stat-label {
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-muted);
}

/* Section heading with accent */
.heading-accent {
  border-left: 3px solid var(--gw2-red);
  padding-left: 0.75rem;
}
```

## Usage Guidelines

- Use monospace for currency amounts, timers, and numeric data
- Keep body text at base size (16px) for readability
- Use tracking-wide for uppercase labels
- Gold text color for important values and highlights
