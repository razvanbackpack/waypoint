# Borders, Shadows & Depth

## Border Radius Philosophy

**Modern but Not Too Rounded** - The design should feel crisp and intentional, not bubbly or overly soft.

## Border Radius Scale

```css
--radius:     0.25rem;  /* 4px - base */
--radius-sm:  0.125rem; /* 2px - subtle, item slots */
--radius-md:  0.25rem;  /* 4px - buttons, inputs */
--radius-lg:  0.5rem;   /* 8px - cards */
--radius-xl:  0.75rem;  /* 12px - modals, featured */
--radius-2xl: 1rem;     /* 16px - large cards */
--radius-full: 9999px;  /* Pills, avatars */
```

## When to Use Each

| Element | Radius | Value |
|---------|--------|-------|
| Item slots | radius-sm | 2px |
| Buttons | radius-md | 4px |
| Inputs | radius-md | 4px |
| Badges | radius-md | 4px |
| Tooltips | radius-md | 4px |
| Cards | radius-lg | 8px |
| Tabs container | radius-lg | 8px |
| Modals/Dialogs | radius-lg | 8px |
| Progress bars | radius-full | 9999px |
| Avatars | radius-full | 9999px |

## Shadow Scale

```css
/* No shadow - flat elements */
--shadow-none: none;

/* Extra small - subtle lift */
--shadow-xs: 0 1px 2px oklch(0 0 0 / 0.05);

/* Small - buttons, inputs */
--shadow-sm: 0 1px 3px oklch(0 0 0 / 0.1),
             0 1px 2px oklch(0 0 0 / 0.06);

/* Medium - cards at rest */
--shadow-md: 0 4px 6px oklch(0 0 0 / 0.1),
             0 2px 4px oklch(0 0 0 / 0.06);

/* Large - elevated cards, hover */
--shadow-lg: 0 10px 15px oklch(0 0 0 / 0.1),
             0 4px 6px oklch(0 0 0 / 0.05);

/* Extra large - modals, popovers */
--shadow-xl: 0 20px 25px oklch(0 0 0 / 0.1),
             0 8px 10px oklch(0 0 0 / 0.04);
```

## Gold Glow Effects

```css
/* Small gold glow - subtle emphasis */
.glow-gold-sm {
  box-shadow: 0 0 10px oklch(0.72 0.14 85 / 0.2);
}

/* Medium gold glow - standard */
.glow-gold {
  box-shadow: 0 0 20px oklch(0.72 0.14 85 / 0.3);
}

/* Large gold glow - celebration/featured */
.glow-gold-lg {
  box-shadow: 0 0 30px oklch(0.72 0.14 85 / 0.4);
}

/* Rarity glow - uses CSS variable */
.glow-rarity {
  box-shadow: 0 0 12px var(--rarity-color);
}

/* Red glow - for errors/warnings */
.glow-red {
  box-shadow: 0 0 15px oklch(0.5 0.25 27 / 0.5);
}
```

## Elevation Guidelines

| Element | Shadow | Notes |
|---------|--------|-------|
| Page content | none | Flat on background |
| Cards at rest | shadow-sm | Subtle lift |
| Cards on hover | shadow-lg | Noticeable elevation |
| Dropdowns/Popovers | shadow-xl | Floating above |
| Modals/Dialogs | shadow-xl | Maximum elevation |
| Navigation | shadow-sm | Fixed elements |
| Featured items | glow-gold | Special emphasis |

## Border Guidelines

- Default border: 1px solid var(--border)
- Active/focused: 2px solid var(--gw2-gold)
- Rarity items: 2px solid var(--rarity-color)
- Featured: 1px solid oklch(0.72 0.14 85 / 0.5)
