# Layout Components Redesign

App shell, navigation, and structural components.

## Design References
- Components: `docs/design/07-components.md`
- Animations: `docs/design/06-animations.md`
- Responsive: `docs/design/09-responsive.md`

## Components Checklist

### Layout.tsx
**Path**: `src/components/layout/Layout.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Current State**:
- Main layout wrapper
- Contains Navigation component
- min-h-screen, container, padding

**Redesign Tasks**:
- [ ] Verify container max-width matches design (1280px)
- [ ] Update padding to responsive scale (px-4 md:px-6 lg:px-8)
- [ ] Background color uses design token
- [ ] Add smooth page transition container if needed

---

### Navigation.tsx
**Path**: `src/components/layout/Navigation.tsx`
**Status**: ⬜ Not Started
**Complexity**: High

**Current State**:
- Sticky top nav with logo
- Nav links with icon buttons
- Character selector dropdown
- Theme toggle
- Connection status indicator
- Mobile hamburger menu

**Redesign Tasks**:
- [ ] Height: 56px
- [ ] Background: --card color
- [ ] Border-bottom: 2px solid oklch(0.72 0.14 85 / 0.3)
- [ ] Logo "Waypoint" in gold color
- [ ] Active nav item styling:
  - [ ] Text color: gold
  - [ ] Gold underline with subtle glow
  - [ ] Background: gold at 10% opacity
- [ ] Nav items: icon + label on desktop, icon-only on tablet
- [ ] Character selector matches Select component styling
- [ ] Connection status: green/red dot with proper colors
- [ ] Mobile menu:
  - [ ] Full-width slide-down
  - [ ] 200ms fade-in animation
  - [ ] 44px touch targets

---

### ApiKeyDialog.tsx
**Path**: `src/components/layout/ApiKeyDialog.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Modal dialog for API key configuration
- Uses Dialog primitives from Radix

**Redesign Tasks**:
- [ ] Dialog matches updated Dialog component styling
- [ ] Border-radius 8px
- [ ] Input styling matches design
- [ ] Button uses primary gold variant
- [ ] Key icon styling
- [ ] Add zoom-in animation

---

### ThemeToggle.tsx
**Path**: `src/components/layout/ThemeToggle.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Current State**:
- Simple button with Sun/Moon icons
- Uses ghost variant

**Redesign Tasks**:
- [ ] Button matches ghost variant from design
- [ ] Icon size 20px (h-5 w-5)
- [ ] Add subtle rotation animation on toggle (optional)
- [ ] Hover state with gold tint

---

## Key Navigation Patterns

### Desktop Nav (lg+)
```
[Logo] [Home] [Trading Post] [Crafting] [Timers] [Dailies] [Settings] | [Character Select] [Theme] [Status]
```

### Tablet Nav (md-lg)
```
[Logo] [Icons only...] | [Character] [Theme] [Status]
```

### Mobile Nav (<md)
```
[Logo] [Hamburger]
[Expanded menu with full labels, 44px touch targets]
```

## Progress Summary
- Total: 4 components
- Complete: 0
- In Progress: 0
- Not Started: 4
