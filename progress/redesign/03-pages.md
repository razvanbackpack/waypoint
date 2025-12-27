# Pages Redesign

All page-level components with their layout and styling needs.

## Design References
- Spacing: `docs/design/04-spacing-layout.md`
- Components: `docs/design/07-components.md`
- Responsive: `docs/design/09-responsive.md`

## Pages Checklist

### Characters.tsx (Home)
**Path**: `src/pages/Characters.tsx`
**Status**: ⬜ Not Started
**Complexity**: High
**Priority**: 🔴 Critical (Landing page)

**Current State**:
- Character overview with tabs
- Equipment, inventory, bank views
- Inline profession color styles
- Custom badge styles

**Redesign Tasks**:
- [ ] Page header with proper typography (text-2xl md:text-3xl)
- [ ] Use profession colors from centralized system
- [ ] Tabs match design component
- [ ] Grid layout with bento patterns
- [ ] Card spacing standardized (gap-4 lg:gap-6)
- [ ] Character badges use Badge component
- [ ] Equipment section uses ItemCard properly
- [ ] Responsive layout (stack on mobile)

---

### TradingPost.tsx
**Path**: `src/pages/TradingPost.tsx`
**Status**: ⬜ Not Started
**Complexity**: High
**Priority**: 🟡 High

**Current State**:
- Multiple tabs: Search, Watchlist, Calculator
- Inline rarity colors (many hex values)
- Card variants (featured/interactive)
- Colored price tables

**Redesign Tasks**:
- [ ] Page header styling
- [ ] Tabs component alignment
- [ ] Replace inline rarity hex colors with design tokens
- [ ] Price displays use CoinDisplay with proper gold/silver/copper
- [ ] Tables match Table component design
- [ ] Featured/interactive cards use proper variants
- [ ] Profit/loss colors: green-500, destructive
- [ ] Search input with proper focus states

---

### Dailies.tsx
**Path**: `src/pages/Dailies.tsx`
**Status**: ⬜ Not Started
**Complexity**: High
**Priority**: 🟡 High

**Current State**:
- Wizard's Vault objectives
- Custom gradient backgrounds (gw2-gold/10)
- Animated progress bars
- Badge variants

**Redesign Tasks**:
- [ ] Page header with timer display
- [ ] Gradient backgrounds use design gradients
- [ ] Progress bars match Progress component
- [ ] Objective cards with proper card styling
- [ ] Badge variants (astral acclaim, special currency)
- [ ] Tabs for daily/weekly/special
- [ ] Animations: progress fill, card hover

---

### Achievements.tsx
**Path**: `src/pages/Achievements.tsx`
**Status**: ⬜ Not Started
**Complexity**: High
**Priority**: 🟢 Medium

**Current State**:
- Browse/filter achievements
- Grid layout with cards
- Category browser sidebar

**Redesign Tasks**:
- [ ] Two-column layout (sidebar + content)
- [ ] Category browser tree styling
- [ ] Achievement cards with progress
- [ ] Search/filter input styling
- [ ] Tabs for categories
- [ ] Complete state: green border/glow
- [ ] Locked state: muted/disabled styling

---

### Inventory.tsx
**Path**: `src/pages/Inventory.tsx`
**Status**: ⬜ Not Started
**Complexity**: High
**Priority**: 🟢 Medium

**Current State**:
- Bank, materials, character inventory tabs
- Inline #C9A227 gold color
- Card layout with grids

**Redesign Tasks**:
- [ ] Replace inline gold with design token
- [ ] Tabs match design
- [ ] Item grid uses ItemCard component
- [ ] Rarity colors from centralized system
- [ ] CoinDisplay for values
- [ ] Bank tab navigation styling
- [ ] Material categories with headers

---

### Timers.tsx
**Path**: `src/pages/Timers.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium
**Priority**: 🟢 Medium

**Current State**:
- World boss/meta event timers
- Grid layout with sidebar

**Redesign Tasks**:
- [ ] Two-column layout (main + sidebar)
- [ ] EventTimer table styling
- [ ] EventSidebar card styling
- [ ] Timer status colors (active, upcoming, completed)
- [ ] Responsive: stack on mobile

---

### Crafting.tsx
**Path**: `src/pages/Crafting.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium
**Priority**: 🟢 Medium

**Current State**:
- Recipe browser with search
- Card + featured variant
- Simple flex layout

**Redesign Tasks**:
- [ ] Page header with discipline selector
- [ ] Search input styling
- [ ] Featured card for selected recipe
- [ ] RecipeBrowser styling (delegated)
- [ ] Discipline colors match design

---

### Settings.tsx
**Path**: `src/pages/Settings.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium
**Priority**: 🟡 High

**Current State**:
- API key configuration
- Backup/restore functionality
- Data storage info

**Redesign Tasks**:
- [ ] Page header styling
- [ ] Settings sections with cards
- [ ] API key input + dialog button
- [ ] Export/import buttons with proper variants
- [ ] Info cards for storage statistics
- [ ] Danger zone (destructive actions) styling

---

## Page Layout Pattern

All pages should follow:
```tsx
<div className="container mx-auto px-4 py-6 md:py-8">
  <header className="mb-6 md:mb-8">
    <h1 className="text-2xl md:text-3xl font-bold">Page Title</h1>
    <p className="text-muted-foreground mt-1">Description</p>
  </header>

  <main>
    {/* Page content */}
  </main>
</div>
```

## Progress Summary
- Total: 8 pages
- Complete: 0
- In Progress: 0
- Not Started: 8
