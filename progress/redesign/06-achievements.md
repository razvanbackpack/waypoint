# Achievements Feature Redesign

Achievement browsing, tracking, and display components.

## Design References
- Colors: `docs/design/02-colors.md` (semantic colors)
- Components: `docs/design/07-components.md` (cards, progress)
- Animations: `docs/design/06-animations.md`

## Components Checklist

### AchievementCard.tsx
**Path**: `src/components/achievements/AchievementCard.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Single achievement display
- Card variant
- border-green-500/30 when complete
- Icon + text layout

**Redesign Tasks**:
- [ ] Card uses interactive variant
- [ ] Complete state: green-500/30 border, subtle green glow
- [ ] Incomplete state: default border
- [ ] Locked state: muted styling, Lock icon
- [ ] Trophy/Star icon for rewards
- [ ] Progress bar integration
- [ ] Hover effect with card lift

---

### AchievementProgress.tsx
**Path**: `src/components/achievements/AchievementProgress.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Current State**:
- Progress display (x/y format or percentage)

**Redesign Tasks**:
- [ ] Progress bar uses Progress component
- [ ] Percentage text styling
- [ ] Gold fill for progress
- [ ] Complete state: full green

---

### DailyAchievements.tsx
**Path**: `src/components/achievements/DailyAchievements.tsx`
**Status**: ⬜ Not Started
**Complexity**: High

**Current State**:
- Daily objectives list with checkboxes
- Tabs layout
- Checked/unchecked circle icons
- green-500 styling for complete

**Redesign Tasks**:
- [ ] Tabs match design
- [ ] Check icons: CheckCircle2 (complete), Circle (incomplete)
- [ ] Complete: green-500 text and icon
- [ ] Incomplete: muted-foreground
- [ ] List items with proper spacing
- [ ] Category headers with heading-accent
- [ ] Animation on completion (optional checkmark bounce)

---

### CategoryBrowser.tsx
**Path**: `src/components/achievements/CategoryBrowser.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Tree browser for categories
- Button variants (ghost/secondary)
- ChevronDown/Right expansion icons

**Redesign Tasks**:
- [ ] Tree indent styling (pl-4 per level)
- [ ] Expand/collapse icons with rotation animation
- [ ] Active category: gold text, gold left border
- [ ] Hover: ghost button styling
- [ ] Category count badges
- [ ] Progress indicator per category

---

### AchievementObjectiveCard.tsx
**Path**: `src/components/achievements/AchievementObjectiveCard.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Current State**:
- Individual objective display

**Redesign Tasks**:
- [ ] Checkbox/check icon styling
- [ ] Objective text styling
- [ ] Complete state styling

---

### DailyResetTimer.tsx
**Path**: `src/components/achievements/DailyResetTimer.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Current State**:
- Countdown to daily reset

**Redesign Tasks**:
- [ ] Timer uses monospace font
- [ ] Badge or inline styling
- [ ] Clock icon
- [ ] Urgent state (< 1 hour): amber/warning color

---

### WeeklyResetTimer.tsx
**Path**: `src/components/achievements/WeeklyResetTimer.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Redesign Tasks**:
- [ ] Same pattern as DailyResetTimer
- [ ] Different icon or label

---

### MonthlyResetTimer.tsx
**Path**: `src/components/achievements/MonthlyResetTimer.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Redesign Tasks**:
- [ ] Same pattern as DailyResetTimer
- [ ] Different icon or label

---

## Achievement State Patterns

### Complete
```tsx
<Card className="border-green-500/30 bg-green-500/5">
  <CheckCircle2 className="text-green-500" />
  {/* content */}
</Card>
```

### Incomplete
```tsx
<Card variant="interactive">
  <Circle className="text-muted-foreground" />
  {/* content */}
</Card>
```

### Locked
```tsx
<Card className="opacity-60">
  <Lock className="text-muted-foreground" />
  {/* content */}
</Card>
```

## Progress Summary
- Total: 8 components
- Complete: 0
- In Progress: 0
- Not Started: 8
