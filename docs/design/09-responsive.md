# Responsive Design

## Breakpoint Scale

```css
--screen-sm:  640px;   /* Mobile landscape */
--screen-md:  768px;   /* Tablet portrait */
--screen-lg:  1024px;  /* Tablet landscape / small desktop */
--screen-xl:  1280px;  /* Desktop */
--screen-2xl: 1536px;  /* Large desktop */
```

## Mobile-First Approach

Always start with mobile styles, then add breakpoints for larger screens:

```css
/* Base styles (mobile) */
.component { ... }

/* Tablet and up */
@media (min-width: 768px) {
  .component { ... }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component { ... }
}
```

Tailwind example:
```tsx
<div className="flex flex-col md:flex-row lg:gap-8">
  {/* Stacks on mobile, row on tablet+ */}
</div>
```

## Density Adjustments

| Breakpoint | Card Padding | Grid Gap | Font Scale |
|------------|--------------|----------|------------|
| < 640px | 12px | 12px | 0.875x |
| 640-1024px | 16px | 16px | 1x |
| > 1024px | 24px | 24px | 1x |

## Common Responsive Patterns

### Stack on Mobile, Side-by-Side on Tablet+

```tsx
<div className="flex flex-col gap-4 md:flex-row">
  <div>Left content</div>
  <div>Right content</div>
</div>
```

### Responsive Grid

```tsx
{/* 1 col mobile, 2 col tablet, 3 col desktop */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Hide/Show Elements

```tsx
{/* Hide on mobile, show on desktop */}
<span className="hidden lg:inline">Full Label</span>
<span className="lg:hidden">Short</span>
```

### Navigation Patterns

```tsx
{/* Desktop nav */}
<nav className="hidden md:flex gap-4">
  {navItems.map(item => <NavLink />)}
</nav>

{/* Mobile hamburger */}
<button className="md:hidden">
  <Menu className="h-6 w-6" />
</button>
```

## Touch Targets

- Minimum touch target: 44px x 44px on mobile
- Increase button padding on mobile if needed
- Spacing between interactive elements: 8px minimum

## Container Behavior

```tsx
<div className="container mx-auto px-4 md:px-6 lg:px-8">
  {/* Content with responsive padding */}
</div>
```

## Responsive Typography

```tsx
{/* Larger headings on desktop */}
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Page Title
</h1>
```
