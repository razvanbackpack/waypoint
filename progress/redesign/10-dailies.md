# Dailies Feature Redesign

Wizard's Vault and daily objective components.

## Design References
- Colors: `docs/design/02-colors.md`
- Components: `docs/design/07-components.md` (progress bars, cards)
- Animations: `docs/design/06-animations.md`

## Components Checklist

### ProgressCard (in Dailies.tsx)
**Path**: Used in `src/pages/Dailies.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Shows objective progress
- Custom gradient backgrounds (gw2-gold/10)
- Animated progress bars

**Redesign Tasks**:
- [ ] Card matches design with gold gradient for featured
- [ ] Progress bar uses Progress component
- [ ] Progress fill with gold gradient
- [ ] Percentage/count in stat-value style
- [ ] Animation on progress update (500ms ease-out)

---

### ObjectiveCard (in Dailies.tsx)
**Path**: Used in `src/pages/Dailies.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Individual objective display
- Complete/incomplete states

**Redesign Tasks**:
- [ ] Card interactive variant
- [ ] Complete state: green border/glow, checkmark icon
- [ ] Incomplete state: default styling
- [ ] Objective text styling
- [ ] Reward display (astral acclaim icon + count)
- [ ] Progress bar if partial

---

### MetaRewardCard (in Dailies.tsx)
**Path**: Used in `src/pages/Dailies.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Shows meta reward progress
- Special styling for rewards

**Redesign Tasks**:
- [ ] Featured card variant
- [ ] Gold border and gradient
- [ ] Reward tiers display
- [ ] Current tier highlighted
- [ ] Progress toward next tier

---

### DailyCard.tsx
**Path**: `src/components/dailies/DailyCard.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Current State**:
- Simple daily objective card

**Redesign Tasks**:
- [ ] Match ObjectiveCard pattern
- [ ] Checkbox/circle icons
- [ ] Complete state styling

---

### DailyCategory.tsx
**Path**: `src/components/dailies/DailyCategory.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Current State**:
- Category grouping for dailies

**Redesign Tasks**:
- [ ] Category header with heading-accent
- [ ] Collapse/expand functionality
- [ ] Progress summary per category

---

## Astral Acclaim Display

Special currency display pattern:

```tsx
<span className="inline-flex items-center gap-1">
  <span className="text-gw2-gold font-semibold">{amount}</span>
  <AstralAcclaimIcon className="h-4 w-4 text-gw2-gold" />
</span>
```

## Objective States

```tsx
// Complete
<Card className="border-green-500/30 bg-green-500/5">
  <CheckCircle2 className="h-5 w-5 text-green-500" />
  <span className="line-through text-muted-foreground">{objective.name}</span>
  <span className="text-green-500">+{objective.reward}</span>
</Card>

// In Progress
<Card variant="interactive">
  <Circle className="h-5 w-5 text-muted-foreground" />
  <span>{objective.name}</span>
  <Progress value={progress} max={objective.goal} />
</Card>

// Locked/Unavailable
<Card className="opacity-50">
  <Lock className="h-5 w-5 text-muted-foreground" />
  <span className="text-muted-foreground">{objective.name}</span>
</Card>
```

## Progress Summary
- Total: 5 components
- Complete: 0
- In Progress: 0
- Not Started: 5
