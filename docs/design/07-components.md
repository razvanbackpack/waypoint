# Component Patterns

## Cards

### Default Card
```tsx
<Card className="p-6">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>Content here</CardContent>
</Card>
```
- Background: `--card`
- Border: `--border`
- Border radius: 8px (radius-lg)
- Padding: 24px
- Shadow: shadow-sm

### Interactive Card
```tsx
<Card variant="interactive" className="cursor-pointer">
  {/* Lifts on hover, gold border on hover */}
</Card>
```
- Adds: `translateY(-2px)` on hover
- Adds: Gold border glow on hover
- Adds: shadow-lg on hover

### Featured Card
```tsx
<Card variant="featured">
  {/* Gold border, gradient background */}
</Card>
```
- Border: `1px solid oklch(0.72 0.14 85 / 0.5)`
- Background: Subtle gold gradient

## Buttons

| Variant | Background | Text Color | Border |
|---------|------------|------------|--------|
| default | --primary (gold) | --primary-fg | none |
| secondary | --secondary | --secondary-fg | none |
| outline | transparent | --foreground | --border |
| ghost | transparent | --foreground | none |
| destructive | --destructive | white | none |
| link | transparent | --primary | none |

| Size | Height | Padding X | Font Size |
|------|--------|-----------|-----------|
| sm | 32px | 12px | 0.875rem |
| default | 36px | 16px | 0.875rem |
| lg | 40px | 24px | 1rem |
| icon | 36px | 0 | - |
| icon-sm | 32px | 0 | - |
| icon-lg | 40px | 0 | - |

## Inputs & Forms

```css
.input {
  height: 36px;
  padding: 0 12px;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: transparent;
  transition: border-color 200ms, box-shadow 200ms;
}

.input:focus {
  border-color: var(--gw2-gold);
  box-shadow: 0 0 0 3px oklch(0.72 0.14 85 / 0.2);
}

.input:invalid {
  border-color: var(--destructive);
}
```

## Navigation Patterns

### Top Navigation Bar
- Height: 56px
- Background: --card
- Border-bottom: 2px solid oklch(0.72 0.14 85 / 0.3)
- Sticky positioning

### Active Nav Item
- Text color: --gw2-gold
- Underline: Gold with subtle glow
- Background: oklch(0.72 0.14 85 / 0.1)

### Mobile Menu
- Full-width slide-down
- Animation: fade-in 200ms
- Items: 44px touch targets

## Stat Displays

```tsx
<StatCard
  title="TOTAL VALUE"
  value={1234567}
  icon={<Coins />}
  trend={{ value: 5.2, isPositive: true }}
  variant="featured"
/>
```

Structure:
- Icon: 48px container, 10% primary background
- Value: 2rem-4rem, bold, gold color
- Label: 0.75rem, uppercase, muted

## Item Slots

```css
.item-slot {
  aspect-ratio: 1;
  width: 56px; /* md size */
  border: 2px solid var(--border);
  border-radius: 4px;
  background: var(--surface-sunken);
}

.item-slot.has-item {
  border-color: var(--rarity-color);
}

.item-slot:hover {
  border-color: var(--gw2-gold);
  box-shadow: 0 0 8px oklch(0.72 0.14 85 / 0.3);
  transform: scale(1.05);
}
```

Sizes: sm (40px), md (56px), lg (72px)

## Progress Bars

```css
.progress-container {
  height: 16px;
  background: var(--muted);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gw2-gold);
  transition: width 500ms var(--ease-out);
}
```

Variants: Default (gold), Success (green), Warning (amber)

## Tooltips/Popovers

```css
.tooltip {
  background: var(--popover);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 8px 12px;
  box-shadow: var(--shadow-xl);
  max-width: 288px;
  z-index: 50;
}
```

Entry animation: fade-in + zoom-in-95 150ms
