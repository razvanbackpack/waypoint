# Crafting Feature Redesign

Recipe browser and crafting-related components.

## Design References
- Colors: `docs/design/02-colors.md` (rarity colors, custom discipline colors)
- Components: `docs/design/07-components.md` (tables, cards, popovers)
- Typography: `docs/design/03-typography.md`

## Components Checklist

### RecipeBrowser.tsx
**Path**: `src/components/crafting/RecipeBrowser.tsx`
**Status**: ⬜ Not Started
**Complexity**: Very High

**Current State**:
- Comprehensive recipe search with multi-select filters
- Complex filter UI with popovers
- Table styling
- Discipline-specific color scheme (DISCIPLINE_COLORS map)
- Ingredient hover cards
- Profession colors

**Redesign Tasks**:
- [ ] Search input matches design
- [ ] Filter popovers match Popover component
- [ ] Multi-select checkboxes styling
- [ ] Discipline colors:
  - Armorsmith: #8B4513 (brown)
  - Artificer: #9370DB (purple)
  - Chef: #32CD32 (green)
  - Huntsman: #DAA520 (goldenrod)
  - Jeweler: #FF69B4 (pink)
  - Leatherworker: #D2691E (chocolate)
  - Scribe: #4169E1 (royal blue)
  - Tailor: #9932CC (dark orchid)
  - Weaponsmith: #708090 (slate gray)
- [ ] Table matches Table component
- [ ] Ingredient hover uses HoverCard
- [ ] Rarity colors from design tokens
- [ ] Rating/level display styling
- [ ] Clear filters button
- [ ] Empty state styling
- [ ] Loading state with spinner

---

### RecipeCard.tsx
**Path**: `src/components/crafting/RecipeCard.tsx`
**Status**: ⬜ Not Started
**Complexity**: Medium

**Current State**:
- Individual recipe display

**Redesign Tasks**:
- [ ] Card interactive variant
- [ ] Recipe name in rarity color
- [ ] Discipline badge with discipline color
- [ ] Ingredient list with item icons
- [ ] Crafting level requirement
- [ ] Output item with rarity border
- [ ] Hover state

---

## Discipline Color Variables

Add to CSS or Tailwind config:

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

## Recipe Display Pattern

```tsx
<Card variant="interactive" className="hover:glow-gold-sm">
  <div className="flex items-start gap-4">
    <ItemSlot item={outputItem} size="lg" />
    <div className="flex-1">
      <h3 className={`font-medium text-rarity-${outputItem.rarity}`}>
        {recipe.name}
      </h3>
      <Badge
        style={{ backgroundColor: disciplineColors[recipe.discipline] }}
        className="text-white"
      >
        {recipe.discipline}
      </Badge>
      <p className="text-sm text-muted-foreground mt-1">
        Level {recipe.rating}
      </p>
    </div>
  </div>
  <div className="mt-3 flex gap-2">
    {recipe.ingredients.map(ing => (
      <ItemSlot key={ing.id} item={ing} size="sm" />
    ))}
  </div>
</Card>
```

## Progress Summary
- Total: 2 components
- Complete: 0
- In Progress: 0
- Not Started: 2
