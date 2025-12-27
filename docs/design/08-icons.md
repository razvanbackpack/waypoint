# Iconography

This project uses Lucide React icons.

## Icon Sizes

| Name | Size | Usage |
|------|------|-------|
| xs | 12px | Inline with small text |
| sm | 16px | Buttons (sm), badges |
| md | 20px | Default buttons, nav items |
| lg | 24px | Page headers, emphasis |
| xl | 32px | Feature icons, empty states |
| 2xl | 48px | Hero elements |

## Tailwind Classes

```tsx
// Extra small
<Icon className="h-3 w-3" />

// Small
<Icon className="h-4 w-4" />

// Medium (default)
<Icon className="h-5 w-5" />

// Large
<Icon className="h-6 w-6" />

// Extra large
<Icon className="h-8 w-8" />

// 2XL
<Icon className="h-12 w-12" />
```

## Stroke Width

- Standard: 2px (Lucide default)
- Maintain consistency - do not mix stroke widths
- Use `strokeWidth` prop only for specific UI needs

## Filled vs Outlined

- **Outlined (default)**: Most UI icons, navigation, actions
- **Filled**: Active states, selected items, emphasis
- **Solid**: Checkmarks, status indicators

## Icon Button Guidelines

```tsx
<Button variant="ghost" size="icon" aria-label="Settings">
  <Settings className="h-5 w-5" />
</Button>
```

- Always include `aria-label` for accessibility
- Minimum touch target: 44px x 44px
- Icon should be centered with equal padding
- Use `size="icon"` variant for square buttons

## Common Icon Pairings

| Context | Icon | Notes |
|---------|------|-------|
| Navigation | Home, Package, Coins, Timer, Settings | Main nav items |
| Actions | Plus, Trash, Edit, Copy, Share | CRUD operations |
| Status | Check, X, AlertTriangle, Info | Feedback |
| Arrows | ChevronDown, ChevronRight, ArrowRight | Direction |
| User | User, Users, Shield | Account related |

## Icon Colors

- Default: inherit from text color
- Muted: `text-muted-foreground`
- Gold accent: `text-gw2-gold`
- Success: `text-green-500`
- Error: `text-destructive`

## Animation on Icons

- Loading: `animate-spin` on Loader icons
- Attention: `animate-pulse` sparingly
- Avoid: complex animations on small icons
