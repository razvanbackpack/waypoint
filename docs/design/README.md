# GW2 Companion Design System

A comprehensive design system for the Guild Wars 2 Companion app, inspired by the game's iconic art style and gold accent colors.

---

## Table of Contents

1. [01-philosophy.md](./01-philosophy.md) - Design principles and aesthetic direction
2. [02-colors.md](./02-colors.md) - Color palette, themes, and semantic colors
3. [03-typography.md](./03-typography.md) - Font families, scales, and text styles
4. [04-spacing.md](./04-spacing.md) - Spacing scale, margins, and padding
5. [05-components.md](./05-components.md) - Core UI component specifications
6. [06-cards.md](./06-cards.md) - Card variants and interactive states
7. [07-buttons.md](./07-buttons.md) - Button styles, sizes, and variants
8. [08-forms.md](./08-forms.md) - Form inputs, selects, and validation
9. [09-animations.md](./09-animations.md) - Motion principles and transitions
10. [10-icons.md](./10-icons.md) - Icon usage and GW2-specific iconography
11. [11-implementation.md](./11-implementation.md) - Tailwind CSS setup and utilities

---

## Quick Reference

### Core Design Values

| Property | Value | CSS Variable / Class |
|----------|-------|---------------------|
| **Primary Color (GW2 Gold)** | `oklch(0.72 0.14 85)` | `--gw2-gold` |
| **Base Border Radius** | `4px` (0.25rem) | `--radius` |
| **Card Border Radius** | `8px` (0.5rem) | `rounded-lg` |
| **Standard Transition** | `200ms` | `transition-all duration-200` |
| **Easing Function** | `cubic-bezier(0.4, 0, 0.2, 1)` | `ease` (Tailwind default) |
| **Card Hover Lift** | `translateY(-2px)` | `.card-interactive:hover` |
| **Button Height** | `36px` | `h-9` |
| **Card Padding** | `24px` | `p-6` |
| **Grid Gap** | `16px` | `gap-4` |
| **Focus Ring** | `3px` gold | `ring-ring` |

### Extended Gold Palette

| Variant | Value | Usage |
|---------|-------|-------|
| Gold | `oklch(0.72 0.14 85)` | Primary accents, highlights |
| Gold Light | `oklch(0.82 0.10 85)` | Hover states, backgrounds |
| Gold Dark | `oklch(0.55 0.15 85)` | Active states, pressed |
| Gold Muted | `oklch(0.65 0.06 85)` | Subtle accents, borders |

---

## Copy-Paste Tailwind Classes

### Buttons

```html
<!-- Gold Primary Button -->
<button class="bg-primary text-primary-foreground hover:bg-primary/90">
  Save Changes
</button>

<!-- GW2 Red Button -->
<button class="btn-gw2-red">
  Delete Item
</button>

<!-- Secondary Button -->
<button class="bg-secondary text-secondary-foreground hover:bg-secondary/80">
  Cancel
</button>
```

### Cards

```html
<!-- Interactive Card (lifts on hover) -->
<div class="card-interactive hover:glow-gold rounded-lg bg-card p-6">
  Card content
</div>

<!-- Featured Card (gold border accent) -->
<div class="card-featured rounded-lg bg-card p-6">
  Featured content
</div>

<!-- Basic Card -->
<div class="rounded-lg border bg-card p-6">
  Basic card content
</div>
```

### Text Styles

```html
<!-- Gold Accent Text -->
<span class="text-gw2-gold">Gold text</span>

<!-- Stat Value -->
<span class="stat-value">1,234</span>

<!-- Stat Label -->
<span class="stat-label">Total Gold</span>

<!-- Muted Text -->
<span class="text-muted-foreground">Secondary info</span>
```

### Animations

```html
<!-- Fade In Animation -->
<div class="animate-fade-in">
  Content fades in
</div>

<!-- Gold Glow Pulse -->
<div class="animate-glow-pulse">
  Pulsing glow effect
</div>

<!-- Loading Spinner -->
<div class="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
```

### Glow Effects

```html
<!-- Gold Glow Variants -->
<div class="glow-gold-sm">Small glow</div>
<div class="glow-gold">Medium glow</div>
<div class="glow-gold-lg">Large glow</div>
```

### Item Slots

```html
<!-- Empty Slot -->
<div class="item-slot"></div>

<!-- Slot with Rarity -->
<div class="item-slot has-item rarity-legendary">
  <img src="item.png" alt="Item" />
</div>
```

### Rarity Classes

```html
<!-- Apply rarity color -->
<div class="rarity-legendary text-rarity">Legendary Item</div>
<div class="rarity-ascended border-rarity border-2">Ascended Border</div>
<div class="rarity-exotic glow-rarity">Exotic with Glow</div>
```

Available rarity classes: `rarity-junk`, `rarity-basic`, `rarity-fine`, `rarity-masterwork`, `rarity-rare`, `rarity-exotic`, `rarity-ascended`, `rarity-legendary`

### Profession Classes

```html
<!-- Apply profession color -->
<div class="profession-guardian text-profession">Guardian</div>
<div class="profession-necromancer bg-profession">Necromancer</div>
```

Available: `profession-guardian`, `profession-revenant`, `profession-warrior`, `profession-engineer`, `profession-ranger`, `profession-thief`, `profession-elementalist`, `profession-mesmer`, `profession-necromancer`

---

## Design Philosophy

### Painterly Blend Aesthetic

The design draws inspiration from Guild Wars 2's distinctive art style:

- **Soft Gradients** - Subtle background transitions that evoke watercolor techniques
- **Warm Gold Accents** - The iconic GW2 gold (`oklch(0.72 0.14 85)`) as the primary accent
- **Parchment Light Theme** - Warm, cream-tinted backgrounds in light mode
- **Near-Black Dark Theme** - Deep blacks with gold highlights for immersive dark mode

### Animation Philosophy

Moderate, purposeful animations that enhance rather than distract:

- **Button Feedback** - Subtle scale and shadow changes on interaction
- **Card Lifts** - Gentle `translateY(-2px)` on hover to indicate interactivity
- **Loading States** - Smooth spinners and skeleton loaders
- **Fade Transitions** - 200ms fade-in for content appearing
- **Glow Pulses** - Reserved for important elements or notifications

### Density Balance

A comfortable, balanced approach to information density:

- **Card Padding** - 24px for breathing room
- **Grid Gaps** - 16px standard spacing between elements
- **Touch Targets** - Minimum 36px for interactive elements
- **Readable Line Lengths** - Content constrained for readability

### Corner Radius Philosophy

Modern but not too rounded - functional corners that suggest interaction:

- **Base Radius** - `4px` (0.25rem) for small elements
- **Cards/Containers** - `8px` (0.5rem) for larger surfaces
- **Pills/Tags** - `9999px` for fully rounded elements
- **Item Slots** - `4px` to match GW2 inventory aesthetic

---

## Theme Support

The design system fully supports light and dark modes:

```css
/* Automatic theme switching */
.dark {
  /* Dark mode variables applied automatically */
}
```

All color utilities and components respect the current theme through CSS custom properties.

---

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Uses `oklch()` color space with fallbacks where needed
- CSS custom properties for dynamic theming
- Tailwind CSS v4 with modern CSS features
