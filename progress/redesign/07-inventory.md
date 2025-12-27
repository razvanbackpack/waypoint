# Inventory Feature Redesign

Bank, materials, and inventory display components.

## Design References
- Colors: `docs/design/02-colors.md` (rarity colors)
- Components: `docs/design/07-components.md` (item slots)
- Spacing: `docs/design/04-spacing-layout.md`

## Components Checklist

### BankView.tsx
**Path**: `src/components/inventory/BankView.tsx`
**Status**: ⬜ Not Started
**Complexity**: High

**Current State**:
- Bank slots grid display
- Rarity-based borders (inline hex colors)
- grid-cols-8/12/16 responsive
- Hover scale effect
- Count badge overlay

**Redesign Tasks**:
- [ ] Replace inline rarity hex colors with CSS classes
- [ ] Item slot size: 56px (md)
- [ ] Border-radius: 4px
- [ ] Grid responsive: grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12
- [ ] Gap: 8px (gap-2)
- [ ] Hover: scale(1.05), gold border, glow-gold-sm
- [ ] Count badge: bottom-right, small text, semi-transparent bg
- [ ] Empty slot: surface-sunken background, muted border
- [ ] Bank tab navigation styling

---

### MaterialStorage.tsx
**Path**: `src/components/inventory/MaterialStorage.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Material categories display
- Similar grid to bank

**Redesign Tasks**:
- [ ] Category headers with heading-accent style
- [ ] Material slots match item slot design
- [ ] Stack count display (potentially larger for materials)
- [ ] Category collapse/expand (optional)
- [ ] Search/filter functionality styling

---

### CharacterInventory.tsx
**Path**: `src/components/inventory/CharacterInventory.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Per-character bag display

**Redesign Tasks**:
- [ ] Bag section headers
- [ ] Item slots match design
- [ ] Bag capacity indicator
- [ ] Empty bag styling

---

### ItemTooltip.tsx
**Path**: `src/components/inventory/ItemTooltip.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Hover tooltip for items
- Shows item details

**Redesign Tasks**:
- [ ] Tooltip uses Popover or HoverCard component
- [ ] Item name in rarity color
- [ ] Item type and level in muted text
- [ ] Stats section with proper formatting
- [ ] Description in regular text
- [ ] Price display with CoinDisplay
- [ ] Border-radius: 4px
- [ ] Shadow: shadow-xl
- [ ] Animation: 150ms fade-in

---

### ApiKeySetup.tsx
**Path**: `src/components/inventory/ApiKeySetup.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Current State**:
- Prompt to set up API key

**Redesign Tasks**:
- [ ] Card with info styling
- [ ] Key icon
- [ ] Button to open ApiKeyDialog
- [ ] Helpful text styling

---

## Item Slot Standard

All inventory components should use consistent item slot styling:

```tsx
const itemSlotClasses = cn(
  // Base
  "relative aspect-square rounded-sm border-2 bg-surface-sunken",
  "transition-all duration-200 ease-out",
  // Sizes
  size === 'sm' && "w-10",    // 40px
  size === 'md' && "w-14",    // 56px
  size === 'lg' && "w-18",    // 72px
  // States
  !item && "border-muted",
  item && `border-rarity-${item.rarity}`,
  // Hover
  "hover:scale-105 hover:border-gw2-gold hover:shadow-glow-gold-sm"
)
```

## Count Badge Pattern

```tsx
{count > 1 && (
  <span className={cn(
    "absolute bottom-0.5 right-0.5",
    "min-w-[1.25rem] px-1 py-0.5",
    "text-xs font-medium text-center",
    "bg-black/70 text-white rounded-sm"
  )}>
    {count > 999 ? '999+' : count}
  </span>
)}
```

## Progress Summary
- Total: 5 components
- Complete: 0
- In Progress: 0
- Not Started: 5
