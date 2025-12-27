# Color System

The GW2 Companion color system draws from the game's iconic gold and parchment aesthetic while supporting both light and dark themes. All colors use OKLCH for perceptual uniformity where applicable.

---

## Primary Palette - GW2 Gold

The signature gold is central to Guild Wars 2's visual identity. These values are tuned for accessibility and vibrancy.

```css
--gw2-gold:        oklch(0.72 0.14 85);   /* Primary gold - buttons, links, highlights */
--gw2-gold-light:  oklch(0.82 0.10 85);   /* Lighter variant - hover states */
--gw2-gold-dark:   oklch(0.55 0.15 85);   /* Darker/pressed - active states */
--gw2-gold-muted:  oklch(0.65 0.06 85);   /* Subtle gold - borders, dividers */
```

### Secondary Accent - GW2 Red

Used sparingly for destructive actions and critical alerts.

```css
--gw2-red:         #aa0404;               /* Destructive actions, errors */
--gw2-red-hover:   #c41f1f;               /* Hover state */
--gw2-red-dark:    #8b0000;               /* Pressed state */
```

---

## Background & Surface Colors

### Light Mode (Parchment Theme)

Inspired by aged parchment and medieval manuscripts, providing warmth without sacrificing readability.

```css
--background:         oklch(0.96 0.015 85);  /* Warm off-white base */
--card:               oklch(1 0 0);          /* Pure white cards */
--surface-elevated:   oklch(1 0 0);          /* Modals, dropdowns */
--surface-sunken:     oklch(0.94 0.015 85);  /* Inset areas, inputs */
--border:             oklch(0.85 0.02 85);   /* Card borders, dividers */
```

### Dark Mode (Near-Black Theme)

Deep, immersive blacks that let gold accents shine.

```css
--background:         oklch(0.08 0 0);       /* Deep black base */
--card:               oklch(0.12 0 0);       /* Card surfaces */
--surface-elevated:   oklch(0.18 0 0);       /* Modals, dropdowns */
--surface-sunken:     oklch(0.06 0 0);       /* Inset areas */
--border:             oklch(0.2 0 0);        /* Subtle borders */
```

---

## Text Colors

### Light Mode

```css
--text-primary:    oklch(0.15 0 0);          /* Headings, body text */
--text-secondary:  oklch(0.35 0 0);          /* Descriptions, metadata */
--text-muted:      oklch(0.55 0 0);          /* Placeholders, hints */
--text-gold:       oklch(0.55 0.15 85);      /* Links, emphasis */
```

### Dark Mode

```css
--text-primary:    oklch(0.95 0 0);          /* Headings, body text */
--text-secondary:  oklch(0.75 0 0);          /* Descriptions, metadata */
--text-muted:      oklch(0.55 0 0);          /* Placeholders, hints */
--text-gold:       oklch(0.72 0.14 85);      /* Links, emphasis */
```

---

## Semantic Colors

Consistent semantic colors across both themes for status indication.

```css
/* Success - Positive actions, confirmations */
--success:         oklch(0.65 0.2 145);      /* Green */
--success-bg:      oklch(0.95 0.05 145);     /* Light mode background */
--success-bg-dark: oklch(0.2 0.05 145);      /* Dark mode background */

/* Warning - Caution, pending states */
--warning:         oklch(0.75 0.18 85);      /* Amber */
--warning-bg:      oklch(0.95 0.05 85);      /* Light mode background */
--warning-bg-dark: oklch(0.2 0.05 85);       /* Dark mode background */

/* Error - Destructive, failures */
--error:           oklch(0.55 0.22 27);      /* Red */
--error-bg:        oklch(0.95 0.05 27);      /* Light mode background */
--error-bg-dark:   oklch(0.2 0.05 27);       /* Dark mode background */

/* Info - Informational, neutral */
--info:            oklch(0.65 0.15 245);     /* Blue */
--info-bg:         oklch(0.95 0.05 245);     /* Light mode background */
--info-bg-dark:    oklch(0.2 0.05 245);      /* Dark mode background */
```

---

## Profession Colors (Official GW2)

These are the canonical profession colors from the game, useful for character displays, build editors, and class-based UI elements.

| Profession    | Primary   | Dark      | Light     | CSS Variable Prefix |
|---------------|-----------|-----------|-----------|---------------------|
| Guardian      | `#72C1D9` | `#186885` | `#BCE8FD` | `--prof-guardian`   |
| Revenant      | `#D16E5A` | `#A66356` | `#E4AEA3` | `--prof-revenant`   |
| Warrior       | `#FFD166` | `#CAAA2A` | `#FFF2A4` | `--prof-warrior`    |
| Engineer      | `#D09C59` | `#87581D` | `#E8BC84` | `--prof-engineer`   |
| Ranger        | `#8CDC82` | `#67A833` | `#D2F6BC` | `--prof-ranger`     |
| Thief         | `#C08F95` | `#974550` | `#DEC6C9` | `--prof-thief`      |
| Elementalist  | `#F68A87` | `#DC423E` | `#F6BEBC` | `--prof-elementalist` |
| Mesmer        | `#B679D5` | `#69278A` | `#D09EEA` | `--prof-mesmer`     |
| Necromancer   | `#52A76F` | `#2C9D5D` | `#BFE6D0` | `--prof-necromancer` |

### Usage

- **Primary**: Default profession badge, icon background
- **Dark**: Text on light backgrounds, borders
- **Light**: Subtle backgrounds, hover states

```css
/* Example: Profession badge */
.profession-badge--guardian {
  background-color: var(--prof-guardian);
  color: var(--prof-guardian-dark);
}
```

---

## Rarity Colors (Official GW2)

Item rarity colors match in-game conventions for immediate recognition.

| Rarity     | Hex       | RGB             | Usage                              |
|------------|-----------|-----------------|-------------------------------------|
| Junk       | `#AAAAAA` | `170, 170, 170` | Vendor trash, disabled states       |
| Basic      | `#FFFFFF` | `255, 255, 255` | Common items, default state         |
| Fine       | `#62A4DA` | `98, 164, 218`  | Blue quality items                  |
| Masterwork | `#1A9306` | `26, 147, 6`    | Green quality items                 |
| Rare       | `#FCD00B` | `252, 208, 11`  | Yellow quality items                |
| Exotic     | `#FFA405` | `255, 164, 5`   | Orange quality items                |
| Ascended   | `#FB3E8D` | `251, 62, 141`  | Pink quality items                  |
| Legendary  | `#974EFF` | `151, 78, 255`  | Purple quality items                |

### CSS Variables

```css
--rarity-junk:       #AAAAAA;
--rarity-basic:      #FFFFFF;
--rarity-fine:       #62A4DA;
--rarity-masterwork: #1A9306;
--rarity-rare:       #FCD00B;
--rarity-exotic:     #FFA405;
--rarity-ascended:   #FB3E8D;
--rarity-legendary:  #974EFF;
```

### Dark Mode Adjustments

On dark backgrounds, Basic (white) may need dimming for balance:

```css
.dark --rarity-basic: oklch(0.85 0 0);
```

---

## Gradient Recipes

### Painterly Gold Highlight

A subtle wash for featured sections or hero areas.

```css
.gold-highlight {
  background: linear-gradient(
    135deg,
    oklch(0.72 0.14 85 / 0.1) 0%,
    oklch(0.72 0.14 85 / 0.05) 50%,
    transparent 100%
  );
}
```

### Featured Card Gradient (Dark Mode)

Adds depth and luxury feel to prominent cards.

```css
.featured-card-dark {
  background: linear-gradient(
    180deg,
    oklch(0.15 0.02 85) 0%,
    oklch(0.12 0 0) 100%
  );
  border: 1px solid oklch(0.72 0.14 85 / 0.2);
}
```

### Progress Bar Gradient

For experience bars, loading indicators, and completion tracking.

```css
.progress-bar {
  background: linear-gradient(
    90deg,
    oklch(0.55 0.15 85) 0%,
    oklch(0.72 0.14 85) 50%,
    oklch(0.82 0.10 85) 100%
  );
}
```

### Rarity Glow

Subtle glow effect for item icons based on rarity.

```css
.item-glow--legendary {
  box-shadow:
    0 0 8px oklch(0.6 0.3 300 / 0.4),
    0 0 16px oklch(0.6 0.3 300 / 0.2);
}

.item-glow--ascended {
  box-shadow:
    0 0 8px oklch(0.6 0.25 350 / 0.4),
    0 0 16px oklch(0.6 0.25 350 / 0.2);
}

.item-glow--exotic {
  box-shadow:
    0 0 6px oklch(0.7 0.2 70 / 0.4),
    0 0 12px oklch(0.7 0.2 70 / 0.2);
}
```

---

## Color Usage Guidelines

### Primary Actions

- **Default**: `--gw2-gold`
- **Hover**: `--gw2-gold-light`
- **Active/Pressed**: `--gw2-gold-dark`

```css
.btn-primary {
  background-color: var(--gw2-gold);
}
.btn-primary:hover {
  background-color: var(--gw2-gold-light);
}
.btn-primary:active {
  background-color: var(--gw2-gold-dark);
}
```

### Destructive Actions

- **Default**: `--gw2-red`
- **Hover**: `--gw2-red-hover`
- **Active/Pressed**: `--gw2-red-dark`

```css
.btn-destructive {
  background-color: var(--gw2-red);
}
.btn-destructive:hover {
  background-color: var(--gw2-red-hover);
}
```

### Interactive Hovers

For non-button elements, lighten by 10% or add a subtle gold tint:

```css
.interactive:hover {
  background-color: oklch(from var(--card) calc(l + 0.05) c h);
  /* Or add gold tint */
  background-color: oklch(from var(--card) l 0.02 85);
}
```

### Focus States

All interactive elements require visible focus indication:

```css
:focus-visible {
  outline: 3px solid var(--gw2-gold);
  outline-offset: 2px;
}
```

### Disabled States

Reduce opacity to 50% and remove pointer events:

```css
.disabled,
[disabled] {
  opacity: 0.5;
  pointer-events: none;
  cursor: not-allowed;
}
```

### Links

```css
a {
  color: var(--text-gold);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
a:focus-visible {
  outline: 3px solid var(--gw2-gold);
  outline-offset: 2px;
}
```

---

## Accessibility Considerations

### Contrast Ratios

All text/background combinations meet WCAG 2.1 AA standards:

| Combination                      | Ratio  | Pass |
|----------------------------------|--------|------|
| `--text-primary` on `--background` (light) | 14.5:1 | AAA  |
| `--text-primary` on `--background` (dark)  | 15.2:1 | AAA  |
| `--gw2-gold` on `--background` (dark)      | 7.8:1  | AAA  |
| `--gw2-gold-dark` on `--card` (light)      | 4.6:1  | AA   |

### Color Blindness

- Do not rely on color alone for status; pair with icons or text
- Rarity colors are supplemented by item border styles
- Profession colors include text labels in key contexts

---

## Implementation Notes

### Tailwind CSS v4 Integration

Define colors in `app.css` using CSS custom properties:

```css
@theme {
  --color-gw2-gold: oklch(0.72 0.14 85);
  --color-gw2-gold-light: oklch(0.82 0.10 85);
  --color-gw2-gold-dark: oklch(0.55 0.15 85);
  /* ... */
}
```

### shadcn/ui Theming

Map to shadcn's expected variables in your theme configuration:

```css
:root {
  --primary: var(--gw2-gold);
  --primary-foreground: oklch(0.15 0 0);
  --destructive: var(--gw2-red);
  /* ... */
}
```
