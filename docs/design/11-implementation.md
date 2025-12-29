# Implementation Notes

## Tech Stack

- React 19 + TypeScript
- Tailwind CSS v4 (with OKLch colors)
- shadcn/ui components (Radix UI primitives)
- Class Variance Authority (CVA) for component variants

## Tailwind Class Patterns

### Using the cn() Utility

```tsx
import { cn } from "@/lib/utils"

function Component({ className, variant, ...props }) {
  return (
    <div
      className={cn(
        "base-classes here",
        variant === "featured" && "variant-classes",
        className
      )}
      {...props}
    />
  )
}
```

### Conditional Classes

```tsx
<div className={cn(
  "p-4 rounded-lg",
  isActive && "border-gw2-gold bg-gw2-gold/10",
  isDisabled && "opacity-50 pointer-events-none"
)} />
```

## CSS Variable Naming

```css
/* Semantic naming */
--color-[semantic]-[variant]
  --color-primary
  --color-primary-foreground
  --color-destructive

/* Component-specific */
--[component]-[property]
  --card-padding
  --button-height

/* Scale values */
--[property]-[scale]
  --shadow-sm
  --radius-lg
  --space-4
```

## Class Variance Authority (CVA)

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  // Base classes
  "inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        default: "h-9 px-4",
        lg: "h-10 px-6",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  // ... other props
}

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
}
```

## Component Composition

### Compound Components

```tsx
// Card compound component
<Card variant="featured">
  <CardHeader>
    <CardTitle />
    <CardDescription />
    <CardAction />
  </CardHeader>
  <CardContent />
  <CardFooter />
</Card>
```

### Slot Pattern

```tsx
// Using Radix Slot for composition
import { Slot } from "@radix-ui/react-slot"

interface ButtonProps {
  asChild?: boolean
  children: React.ReactNode
}

function Button({ asChild, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button"
  return <Comp {...props} />
}

// Usage
<Button asChild>
  <Link href="/path">Link styled as button</Link>
</Button>
```

## File Organization

```
src/
  components/
    ui/           # Base shadcn/ui components
      button.tsx
      card.tsx
      input.tsx
      ...
    layout/       # Layout components
      Navigation.tsx
      Layout.tsx
    [feature]/    # Feature-specific components
      trading-post/
      characters/
      inventory/
    shared/       # Shared across features
      ItemPopover.tsx
      PriceDisplay.tsx

  lib/
    utils.ts      # cn() and utilities
    professionColors.ts

  hooks/
    useTheme.ts
    useViewMode.ts

  styles/
    index.css     # Global styles, CSS variables
```

## Design Token Integration

CSS variables defined in `src/index.css` are used throughout:

```css
/* In index.css */
:root {
  --gw2-gold: oklch(0.72 0.14 85);
  --radius-lg: 0.5rem;
}

/* In components via Tailwind */
.custom-class {
  @apply rounded-lg border-gw2-gold;
}

/* Or inline */
<div className="rounded-lg border-gw2-gold" />
```

## Adding New Components

1. Create in appropriate directory (`ui/` for base, `[feature]/` for specific)
2. Use CVA for variants if needed
3. Accept `className` prop for customization
4. Use `cn()` for class merging
5. Follow existing naming patterns
6. Export from component index if shared
