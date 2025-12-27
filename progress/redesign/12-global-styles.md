# Global Styles Redesign

CSS variables, theme configuration, and global utilities.

## Design References
- All docs in `docs/design/`
- Especially: `docs/design/02-colors.md`, `docs/design/05-borders-shadows.md`

## Files Checklist

### index.css
**Path**: `src/index.css`
**Status**: ⬜ Not Started
**Complexity**: High
**Priority**: 🔴 Critical (Must be done first)

**Current State**:
- Main stylesheet (~635 lines)
- OKLch color definitions
- Theme variables (light/dark)
- Custom utility classes
- Animation keyframes

**Redesign Tasks**:

#### Color Variables
- [ ] Verify primary gold matches `oklch(0.72 0.14 85)`
- [ ] Add gold variants (light, dark, muted) if missing
- [ ] Verify semantic colors (success, warning, error, info)
- [ ] Add coin colors (gold, silver, copper)
- [ ] Add discipline colors (9 crafting disciplines)

#### Typography
- [ ] Add Inter font-family to --font-sans
- [ ] Add JetBrains Mono to --font-mono
- [ ] Verify type scale variables

#### Spacing
- [ ] Verify spacing scale matches design (0.5 through 16)

#### Border Radius
- [ ] Update --radius to 0.25rem (4px base)
- [ ] Verify radius-sm: 2px, radius-md: 4px, radius-lg: 8px

#### Shadows
- [ ] Verify shadow scale (xs, sm, md, lg, xl)
- [ ] Update glow-gold effects
- [ ] Add glow-rarity utility

#### Animations
- [ ] Add/verify --ease-default: cubic-bezier(0.4, 0, 0.2, 1)
- [ ] Add duration variables (75, 100, 150, 200, 300, 500, 700, 1000ms)
- [ ] Verify fade-in keyframe
- [ ] Verify glow-pulse keyframe
- [ ] Add zoom-in keyframe for modals

#### Utility Classes
- [ ] .stat-value styling
- [ ] .stat-label styling
- [ ] .heading-accent styling
- [ ] .item-slot base styling
- [ ] .rarity-* border classes (all 8 rarities)
- [ ] .profession-* color classes (all 9 professions)
- [ ] .glow-gold-sm, .glow-gold, .glow-gold-lg
- [ ] .animate-fade-in
- [ ] .animate-glow-pulse

#### Responsive
- [ ] Verify container max-widths

---

### App.css
**Path**: `src/App.css`
**Status**: ⬜ Not Started
**Complexity**: Low

**Current State**:
- Legacy/minimal styling (~42 lines)
- Possibly placeholder content

**Redesign Tasks**:
- [ ] Review if needed or can be removed
- [ ] Merge any useful styles into index.css
- [ ] Delete if redundant

---

### professionColors.ts
**Path**: `src/lib/professionColors.ts`
**Status**: ⬜ Not Started
**Complexity**: Low

**Current State**:
- Profession color mapping
- Rarity color mapping
- getProfessionColor() and getRarityColor() functions

**Redesign Tasks**:
- [ ] Verify colors match official GW2 wiki colors
- [ ] Ensure consistent with CSS variables
- [ ] Consider adding Tailwind class generators
- [ ] Add TypeScript types for profession/rarity

---

## New Variables to Add

### Coin Colors
```css
--coin-gold: #FFD700;
--coin-silver: #C0C0C0;
--coin-copper: #B87333;
```

### Discipline Colors
```css
--discipline-armorsmith: #8B4513;
--discipline-artificer: #9370DB;
--discipline-chef: #32CD32;
--discipline-huntsman: #DAA520;
--discipline-jeweler: #FF69B4;
--discipline-leatherworker: #D2691E;
--discipline-scribe: #4169E1;
--discipline-tailor: #9932CC;
--discipline-weaponsmith: #708090;
```

### Animation Timing
```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);

--duration-75: 75ms;
--duration-100: 100ms;
--duration-150: 150ms;
--duration-200: 200ms;
--duration-300: 300ms;
--duration-500: 500ms;
```

## Utility Classes to Add/Verify

### Rarity Classes
```css
.rarity-junk { --rarity-color: #828282; }
.rarity-basic { --rarity-color: #FFFFFF; }
.rarity-fine { --rarity-color: #62A4DA; }
.rarity-masterwork { --rarity-color: #1A9306; }
.rarity-rare { --rarity-color: #FCD00B; }
.rarity-exotic { --rarity-color: #FFA405; }
.rarity-ascended { --rarity-color: #FB3E8D; }
.rarity-legendary { --rarity-color: #974EFF; }

.border-rarity { border-color: var(--rarity-color); }
.text-rarity { color: var(--rarity-color); }
.glow-rarity { box-shadow: 0 0 12px var(--rarity-color); }
```

### Item Slot Base
```css
.item-slot {
  @apply relative aspect-square rounded-sm border-2 bg-surface-sunken;
  @apply transition-all duration-200 ease-out;
}

.item-slot:hover {
  @apply scale-105 border-gw2-gold shadow-glow-gold-sm;
}
```

## Implementation Order

1. **Update color variables** - Foundation for everything
2. **Add missing utility classes** - Enable component updates
3. **Verify animations** - Required for interaction updates
4. **Clean up App.css** - Remove redundancy
5. **Sync professionColors.ts** - Ensure consistency

## Progress Summary
- Total: 3 files
- Complete: 0
- In Progress: 0
- Not Started: 3
