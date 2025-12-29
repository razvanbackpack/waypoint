# Characters Feature Redesign

Character display, equipment, inventory, and related components.

## Design References
- Colors: `docs/design/02-colors.md` (profession colors section)
- Components: `docs/design/07-components.md` (item slots, stat displays)
- Icons: `docs/design/08-icons.md`

## Components Checklist

### CharacterEquipment.tsx
**Path**: `src/components/characters/CharacterEquipment.tsx`
**Status**: ⬜ Not Started
**Complexity**: High

**Current State**:
- Equipment grid display by slot category
- Rarity-based borders using inline getRarityColor()
- 2-column grid layout
- Hover states

**Redesign Tasks**:
- [ ] Replace getRarityColor() inline styles with CSS classes
- [ ] Use rarity-* classes from design system
- [ ] Item slots: 56px (md), 4px border-radius
- [ ] Hover: scale(1.05), gold border, glow effect
- [ ] Equipment categories with heading-accent style
- [ ] Grid gap: 8px between slots
- [ ] Empty slot styling (muted background)

---

### CharacterInventory.tsx
**Path**: `src/components/characters/CharacterInventory.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Character bag display
- Item grid similar to equipment

**Redesign Tasks**:
- [ ] Bag tabs/sections with proper dividers
- [ ] Item slots match design (56px, 4px radius)
- [ ] Rarity colors from design tokens
- [ ] Count badges positioned correctly
- [ ] Empty slots with subtle background

---

### CharacterBank.tsx
**Path**: `src/components/characters/CharacterBank.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Bank tab display
- Similar to inventory grid

**Redesign Tasks**:
- [ ] Bank tab navigation styling
- [ ] Item grid layout (responsive columns)
- [ ] Rarity borders using design tokens
- [ ] Tab indicators for bank tabs

---

### CharacterOverview.tsx
**Path**: `src/components/characters/CharacterOverview.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Character stats and info display
- Profession styling

**Redesign Tasks**:
- [ ] Use profession colors from professionColors.ts via design tokens
- [ ] Stat cards use StatCard component
- [ ] Character name/title typography
- [ ] Level badge styling
- [ ] Guild info display

---

### CharacterAchievements.tsx
**Path**: `src/components/characters/CharacterAchievements.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Current State**:
- Character-specific achievements

**Redesign Tasks**:
- [ ] Achievement list styling
- [ ] Progress indicators
- [ ] Complete/incomplete states

---

## Profession Color Usage

All profession colors should use the centralized system:

```tsx
// From src/lib/professionColors.ts
import { getProfessionColor } from '@/lib/professionColors'

// Usage in components
<div style={{ borderColor: getProfessionColor(profession, 'primary') }}>
```

Or via Tailwind classes if available:
```tsx
<div className="border-profession-guardian" />
```

## Item Slot Pattern

Standard item slot styling:
```tsx
<div className={cn(
  "aspect-square w-14 rounded-sm border-2 bg-surface-sunken",
  "transition-all duration-200",
  "hover:scale-105 hover:border-gw2-gold hover:glow-gold-sm",
  hasItem && `border-rarity-${rarity}`
)}>
  {item && <img src={item.icon} alt={item.name} />}
  {count > 1 && <span className="item-count-badge">{count}</span>}
</div>
```

## Progress Summary
- Total: 5 components
- Complete: 0
- In Progress: 0
- Not Started: 5
