# Spacing & Layout

## Spacing Scale

```css
--space-0:   0;
--space-0.5: 0.125rem;  /* 2px */
--space-1:   0.25rem;   /* 4px */
--space-1.5: 0.375rem;  /* 6px */
--space-2:   0.5rem;    /* 8px */
--space-3:   0.75rem;   /* 12px */
--space-4:   1rem;      /* 16px - Base unit */
--space-5:   1.25rem;   /* 20px */
--space-6:   1.5rem;    /* 24px */
--space-8:   2rem;      /* 32px */
--space-10:  2.5rem;    /* 40px */
--space-12:  3rem;      /* 48px */
--space-16:  4rem;      /* 64px */
```

## Container Widths

```css
--container-sm:  640px;   /* Small forms, modals */
--container-md:  768px;   /* Medium content */
--container-lg:  1024px;  /* Main content */
--container-xl:  1280px;  /* Wide layouts */
--container-2xl: 1536px;  /* Maximum */
```

## Bento Grid Patterns

CSS examples for modern bento-style layouts:

```css
/* 2-column equal */
.grid-2 { grid-template-columns: repeat(2, 1fr); gap: 1rem; }

/* 3-column equal */
.grid-3 { grid-template-columns: repeat(3, 1fr); gap: 1rem; }

/* Bento asymmetric (2:1) */
.grid-bento-2-1 {
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
}

/* Bento asymmetric (1:2) */
.grid-bento-1-2 {
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
}

/* Dashboard layout */
.grid-dashboard {
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto;
  gap: 1rem;
}
```

## Card Sizing Guidelines

| Card Type      | Min Width | Max Width | Padding |
|----------------|-----------|-----------|---------|
| Stat Card      | 180px     | 280px     | 16px    |
| Item Card/Slot | 40px      | 72px      | 0       |
| Feature Card   | 300px     | 100%      | 24px    |
| Modal Card     | 320px     | 512px     | 24px    |

## Common Spacing Patterns

- Page padding: `px-4` (16px horizontal)
- Section gaps: `gap-6` or `gap-8` (24-32px)
- Card internal padding: `p-6` (24px)
- Inline element gap: `gap-2` (8px)
- List item spacing: `space-y-2` (8px)

## Layout Guidelines

- Use `container mx-auto` for centered content
- Max content width: 1280px (xl container)
- Minimum page padding on mobile: 16px
- Grid gap standard: 16px (can reduce to 12px for denser layouts)
