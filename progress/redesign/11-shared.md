# Shared Components Redesign

Components used across multiple features.

## Design References
- Components: `docs/design/07-components.md`
- Colors: `docs/design/02-colors.md`
- Icons: `docs/design/08-icons.md`

## Components Checklist

### ItemPopover.tsx
**Path**: `src/components/shared/ItemPopover.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Popover showing detailed item info
- Used in CharacterEquipment and other places

**Redesign Tasks**:
- [ ] Uses HoverCard or Popover component
- [ ] Item name in rarity color
- [ ] Item icon with rarity border
- [ ] Stats section with proper layout:
  - Stat names: muted text
  - Stat values: bold
- [ ] Attributes section
- [ ] Description in normal text
- [ ] Upgrade slots display
- [ ] Infusion slots display
- [ ] "Soulbound"/"Account Bound" badges
- [ ] Price display with CoinDisplay
- [ ] Border-radius: 4px
- [ ] Shadow: shadow-xl
- [ ] Entry animation: 150ms fade-in

---

### CoinDisplay.tsx
**Path**: `src/components/shared/CoinDisplay.tsx` or in trading-post
**Status**: ⬜ Not Started
**Complexity**: Low

**Current State**:
- Shows gold/silver/copper values
- May have inline color hex values

**Redesign Tasks**:
- [ ] Centralized coin colors:
  - Gold: #FFD700 or oklch equivalent
  - Silver: #C0C0C0
  - Copper: #B87333
- [ ] Monospace font for values
- [ ] Proper spacing between coin types
- [ ] Size variants (sm, md, lg)
- [ ] Compact mode (icons only, tooltip for full value)

---

### LoadingSpinner.tsx (if exists)
**Path**: `src/components/shared/LoadingSpinner.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Redesign Tasks**:
- [ ] Gold spinner color
- [ ] Size variants
- [ ] animate-spin animation
- [ ] Optional loading text below

---

### EmptyState.tsx (if exists or should create)
**Path**: `src/components/shared/EmptyState.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Redesign Tasks**:
- [ ] Centered layout
- [ ] Icon (xl size, muted color)
- [ ] Title text (lg, semibold)
- [ ] Description (muted)
- [ ] Optional action button

---

### ErrorState.tsx (if exists or should create)
**Path**: `src/components/shared/ErrorState.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Redesign Tasks**:
- [ ] Destructive color scheme
- [ ] AlertTriangle icon
- [ ] Error message display
- [ ] Retry button

---

## Shared Patterns

### Item Name with Rarity

```tsx
<span className={`font-medium text-rarity-${item.rarity}`}>
  {item.name}
</span>
```

### Coin Value

```tsx
<CoinDisplay
  value={12345}
  size="md"
  showZero={false}
/>
// Renders: "1g 23s 45c" with colored icons
```

### Loading State

```tsx
<div className="flex items-center justify-center p-8">
  <div className="h-8 w-8 animate-spin rounded-full border-4 border-gw2-gold border-t-transparent" />
</div>
```

### Empty State

```tsx
<div className="text-center py-12">
  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
  <h3 className="text-lg font-semibold">No items found</h3>
  <p className="text-muted-foreground mt-1">
    Try adjusting your filters
  </p>
</div>
```

## Progress Summary
- Total: 5 components (some may need creation)
- Complete: 0
- In Progress: 0
- Not Started: 5
