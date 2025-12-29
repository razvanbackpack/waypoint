# UI Components Redesign

Base shadcn/ui components that need design system alignment.

## Design References
- Colors: `docs/design/02-colors.md`
- Typography: `docs/design/03-typography.md`
- Borders/Shadows: `docs/design/05-borders-shadows.md`
- Components: `docs/design/07-components.md`

## Components Checklist

### button.tsx
**Path**: `src/components/ui/button.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- CVA with variants: default, destructive, outline, secondary, ghost, link
- Sizes: sm, default, lg, icon variants

**Redesign Tasks**:
- [ ] Verify gold primary color matches `oklch(0.72 0.14 85)`
- [ ] Update border-radius to 4px (radius-md)
- [ ] Add 150ms transition for hover states
- [ ] Implement scale(0.98) on active
- [ ] Verify focus ring is 3px gold
- [ ] Check all size heights match design (sm=32px, default=36px, lg=40px)

---

### card.tsx
**Path**: `src/components/ui/card.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Current State**:
- CVA variants: default, interactive, featured, elevated
- Has glow prop

**Redesign Tasks**:
- [ ] Verify border-radius is 8px (radius-lg)
- [ ] Update interactive hover to translateY(-2px) + shadow-lg
- [ ] Verify featured variant has gold border at 50% opacity
- [ ] Add 200ms transition timing
- [ ] Standardize padding to 24px (p-6)

---

### input.tsx
**Path**: `src/components/ui/input.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Redesign Tasks**:
- [ ] Height should be 36px
- [ ] Border-radius 4px
- [ ] Focus: gold border + 3px gold ring at 20% opacity
- [ ] Add 200ms transition on focus

---

### badge.tsx
**Path**: `src/components/ui/badge.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Redesign Tasks**:
- [ ] Border-radius 4px
- [ ] Verify variants use correct semantic colors
- [ ] Add letter-spacing: 0.05em (tracking-wide)

---

### tabs.tsx
**Path**: `src/components/ui/tabs.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Redesign Tasks**:
- [ ] Container radius 8px
- [ ] Active tab should have gold indicator
- [ ] Add smooth transition on tab change
- [ ] Verify spacing matches design system

---

### table.tsx
**Path**: `src/components/ui/table.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Redesign Tasks**:
- [ ] Verify hover states
- [ ] Check border colors use design tokens
- [ ] Add subtle row transitions

---

### dialog.tsx
**Path**: `src/components/ui/dialog.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Redesign Tasks**:
- [ ] Content border-radius 8px
- [ ] Add zoom-in animation (scale 0.95 → 1)
- [ ] Verify overlay opacity
- [ ] Shadow should be shadow-xl

---

### select.tsx
**Path**: `src/components/ui/select.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Redesign Tasks**:
- [ ] Trigger border-radius 4px
- [ ] Content border-radius 8px
- [ ] Focus ring matches input style
- [ ] Add item hover states

---

### popover.tsx
**Path**: `src/components/ui/popover.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Redesign Tasks**:
- [ ] Border-radius 4px
- [ ] Shadow shadow-xl
- [ ] Add fade-in animation

---

### hover-card.tsx
**Path**: `src/components/ui/hover-card.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Redesign Tasks**:
- [ ] Match popover styling
- [ ] 150ms entry animation

---

### dropdown-menu.tsx
**Path**: `src/components/ui/dropdown-menu.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Redesign Tasks**:
- [ ] Content border-radius 8px
- [ ] Item hover states with gold tint
- [ ] Separator styling
- [ ] Add animations

---

### progress.tsx
**Path**: `src/components/ui/progress.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Redesign Tasks**:
- [ ] Border-radius full (9999px)
- [ ] Fill should use gold gradient
- [ ] Add 500ms transition on width change

---

### stat-card.tsx
**Path**: `src/components/ui/stat-card.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Redesign Tasks**:
- [ ] Value text should be gold color
- [ ] Label should be uppercase, tracking-wide, muted
- [ ] Icon container 10% primary background
- [ ] Verify variants match design

---

### item-card.tsx
**Path**: `src/components/ui/item-card.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Redesign Tasks**:
- [ ] Border-radius 4px (sm)
- [ ] Rarity borders use centralized color variables
- [ ] Hover: scale(1.05) + gold border + glow
- [ ] Verify size variants (sm=40px, md=56px, lg=72px)

---

## Progress Summary
- Total: 14 components
- Complete: 0
- In Progress: 0
- Not Started: 14
