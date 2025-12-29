# Timers Feature Redesign

World boss and meta event timer components.

## Design References
- Colors: `docs/design/02-colors.md` (semantic colors)
- Components: `docs/design/07-components.md` (tables, cards)
- Animations: `docs/design/06-animations.md`

## Components Checklist

### EventTimer.tsx
**Path**: `src/components/timers/EventTimer.tsx`
**Status**: ⬜ Not Started
**Complexity**: Very High

**Current State**:
- Event table with filters
- Collapsible sections
- Multiple color schemes for status (green/yellow/red/blue)
- Row highlighting
- Badge colors
- Sticky header
- Star icon for favorites

**Redesign Tasks**:
- [ ] Table matches Table component design
- [ ] Status colors standardized:
  - Active/Now: green-500 background tint, green text
  - Upcoming (< 15 min): amber-500/warning color
  - Future: default styling
  - Completed: muted, strikethrough optional
- [ ] Row hover states with subtle gold tint
- [ ] Sticky header with proper shadow
- [ ] Collapse/expand with chevron rotation animation
- [ ] Star/favorite toggle with gold color when active
- [ ] Filter dropdowns match Select component
- [ ] Search input matches design
- [ ] Time countdown in monospace font
- [ ] Badge for event type (World Boss, Meta, etc.)
- [ ] Responsive: table → card layout on mobile

---

### EventSidebar.tsx
**Path**: `src/components/timers/EventSidebar.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Sidebar showing next events
- Event cards

**Redesign Tasks**:
- [ ] Sidebar card styling
- [ ] "Up Next" heading with heading-accent
- [ ] Event cards with time countdown
- [ ] Active event highlighted with gold border
- [ ] Smooth transition when event changes

---

### EventCard.tsx
**Path**: `src/components/timers/EventCard.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Individual event display card

**Redesign Tasks**:
- [ ] Card interactive variant
- [ ] Event name typography
- [ ] Time display in monospace
- [ ] Status indicator (color dot or badge)
- [ ] Map/waypoint info styling
- [ ] Hover state with lift

---

## Status Color System

```tsx
const statusColors = {
  active: {
    bg: 'bg-green-500/10',
    text: 'text-green-500',
    border: 'border-green-500/30'
  },
  upcoming: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-500',
    border: 'border-amber-500/30'
  },
  future: {
    bg: 'bg-transparent',
    text: 'text-foreground',
    border: 'border-transparent'
  },
  completed: {
    bg: 'bg-muted/50',
    text: 'text-muted-foreground',
    border: 'border-muted'
  }
}
```

## Time Display Pattern

```tsx
<span className="font-mono text-sm tabular-nums">
  {hours > 0 && `${hours}h `}
  {minutes}m {seconds}s
</span>
```

## Progress Summary
- Total: 3 components
- Complete: 0
- In Progress: 0
- Not Started: 3
