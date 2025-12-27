# Trading Post Feature Redesign

Trading post search, price displays, watchlist, and profit calculator.

## Design References
- Colors: `docs/design/02-colors.md` (rarity colors, semantic colors)
- Components: `docs/design/07-components.md` (cards, tables, inputs)
- Typography: `docs/design/03-typography.md` (stat values)

## Components Checklist

### ItemSearch.tsx
**Path**: `src/components/trading-post/ItemSearch.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Search input with autocomplete
- Item results display

**Redesign Tasks**:
- [ ] Search input matches design (36px height, 4px radius, gold focus)
- [ ] Results dropdown styling
- [ ] Item result rows with rarity colors
- [ ] Loading state with spinner
- [ ] Empty state message styling

---

### PriceDisplay.tsx / CoinDisplay.tsx
**Path**: `src/components/trading-post/PriceDisplay.tsx`
**Status**: ⬜ Not Started
**Complexity**: Low

**Current State**:
- Shows buy/sell prices with coin icons
- Inline color styles: #FFD700 gold, #C0C0C0 silver, #B87333 copper

**Redesign Tasks**:
- [ ] Replace inline colors with CSS variables:
  - Gold coin: oklch(0.8 0.15 85) or #FFD700
  - Silver coin: oklch(0.75 0 0) or #C0C0C0
  - Copper coin: oklch(0.55 0.1 50) or #B87333
- [ ] Coin icon sizing consistent (12-16px)
- [ ] Value text uses monospace font
- [ ] Proper spacing between coin types
- [ ] Consider creating coin color CSS variables

---

### Watchlist.tsx
**Path**: `src/components/trading-post/Watchlist.tsx`
**Status**: ⬜ Not Started
**Complexity**: High

**Current State**:
- Watched items price table
- Auto-refresh functionality
- Green/red text for profit
- Badge styling

**Redesign Tasks**:
- [ ] Table matches Table component design
- [ ] Rarity column colors from design tokens
- [ ] Profit positive: text-green-500 (success)
- [ ] Profit negative: text-destructive (red)
- [ ] Remove button with destructive ghost variant
- [ ] Row hover states
- [ ] Auto-refresh indicator styling
- [ ] Empty state card

---

### ProfitCalculator.tsx
**Path**: `src/components/trading-post/ProfitCalculator.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Calculate trading post profits
- Grid layout
- Green/red text for profit/loss
- Destructive alert box styling

**Redesign Tasks**:
- [ ] Card with featured variant for results
- [ ] Input fields match design
- [ ] Result values use stat-value styling
- [ ] Profit: text-green-500, gold glow
- [ ] Loss: text-destructive
- [ ] Tax info in muted text
- [ ] CoinDisplay integration

---

## Coin Color System

Create standardized coin colors:

```css
/* In index.css or Tailwind config */
--coin-gold: #FFD700;
--coin-silver: #C0C0C0;
--coin-copper: #B87333;
```

```tsx
// CoinDisplay component pattern
<span className="inline-flex items-center gap-1 font-mono">
  {gold > 0 && (
    <>
      <span className="text-coin-gold">{gold}</span>
      <GoldCoinIcon className="h-4 w-4" />
    </>
  )}
  {/* ... silver, copper ... */}
</span>
```

## Profit/Loss Pattern

```tsx
<span className={cn(
  "font-semibold",
  profit > 0 && "text-green-500",
  profit < 0 && "text-destructive",
  profit === 0 && "text-muted-foreground"
)}>
  {profit > 0 ? '+' : ''}{formatProfit(profit)}
</span>
```

## Progress Summary
- Total: 4 components
- Complete: 0
- In Progress: 0
- Not Started: 4
