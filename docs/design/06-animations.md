# Animation Guidelines

The app uses **moderate animations** - button feedback, card lifts, loading states, progress indicators. Balanced feel.

## Timing & Easing

```css
/* Easing curves */
--ease-default:    cubic-bezier(0.4, 0, 0.2, 1);  /* Standard */
--ease-in:         cubic-bezier(0.4, 0, 1, 1);    /* Accelerate */
--ease-out:        cubic-bezier(0, 0, 0.2, 1);    /* Decelerate */
--ease-in-out:     cubic-bezier(0.4, 0, 0.2, 1);  /* Smooth both */
--ease-bounce:     cubic-bezier(0.34, 1.56, 0.64, 1); /* Playful */

/* Duration scale */
--duration-75:   75ms;   /* Instant feedback */
--duration-100:  100ms;  /* Quick state changes */
--duration-150:  150ms;  /* Button interactions */
--duration-200:  200ms;  /* Standard transitions */
--duration-300:  300ms;  /* Page elements */
--duration-500:  500ms;  /* Complex animations */
--duration-700:  700ms;  /* Slow, deliberate */
--duration-1000: 1000ms; /* Very slow */
```

## Standard Animations

### Button Interactions
```css
.button {
  transition:
    background-color 150ms var(--ease-default),
    box-shadow 150ms var(--ease-default),
    transform 100ms var(--ease-default);
}

.button:active {
  transform: scale(0.98);
}
```

### Card Hover/Lift
```css
.card-interactive {
  transition:
    transform 200ms var(--ease-out),
    box-shadow 200ms var(--ease-out),
    border-color 200ms var(--ease-default);
}

.card-interactive:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
```

### Fade In
```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 200ms var(--ease-out);
}
```

### Loading Spinner
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-spinner {
  animation: spin 1000ms linear infinite;
  border: 4px solid var(--gw2-gold);
  border-top-color: transparent;
  border-radius: var(--radius-full);
}
```

### Glow Pulse (Celebration)
```css
@keyframes glow-pulse {
  0%, 100% {
    box-shadow: 0 0 10px oklch(0.72 0.14 85 / 0.2);
  }
  50% {
    box-shadow: 0 0 20px oklch(0.72 0.14 85 / 0.4);
  }
}

.animate-glow-pulse {
  animation: glow-pulse 2s var(--ease-in-out) infinite;
}
```

### Progress Bar Fill
```css
.progress-bar {
  transition: width 500ms var(--ease-out);
}
```

### List Item Stagger
```css
.list-item {
  animation: fade-in 200ms var(--ease-out) backwards;
}

.list-item:nth-child(1) { animation-delay: 0ms; }
.list-item:nth-child(2) { animation-delay: 50ms; }
.list-item:nth-child(3) { animation-delay: 100ms; }
/* Max 5-10 items for staggering */
```

### Modal/Dialog Entry
```css
@keyframes zoom-in {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.modal-enter {
  animation: zoom-in 200ms var(--ease-out);
}
```

## When NOT to Animate

- **Reduced motion**: Always respect `prefers-reduced-motion`
- **Data tables**: Row highlights only, no movement
- **Large lists**: Avoid staggering more than 5-10 items
- **Frequent updates**: Live data should update without fanfare
- **Error states**: Immediate feedback, no delays
- **Form submission**: Loading states yes, but no celebratory animations on every submit

## Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```
