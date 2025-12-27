# Design Philosophy

## Core Principles

### 1. Painterly & Authentic

Embrace GW2's distinctive watercolor-inspired art direction. The game's visual identity is built on soft gradients, warm undertones, and a sense of hand-crafted artistry that sets it apart from other MMOs.

- **Soft gradients over hard edges** - Transitions should feel natural and organic
- **Warm undertones** - Even cool colors should carry subtle warmth
- **Color as emotional language**:
  - Golds for accomplishment and reward
  - Soft greens for progress and growth
  - Deep reds for important actions and warnings
- Reference GW2's European graphic novel (Bande Dessinée) influences in illustration and composition

### 2. Lively but Purposeful

Animations should feel responsive and rewarding, never distracting. Motion is a tool for communication, not decoration.

- Every animation serves a purpose: feedback, state change, or guiding attention
- Moderate animation level throughout the interface:
  - Button feedback on interaction
  - Card lifts on hover
  - Smooth loading states
  - Progress indicators that feel alive
- Avoid gratuitous motion that delays user action

### 3. Compact but Comfortable

Players are accustomed to dense game UIs. Honor that expectation while ensuring the interface remains approachable.

- Dense information display balanced with breathing room
- Players need data at a glance without feeling overwhelmed
- Balanced density: high information value per screen area, but with clear visual hierarchy
- Whitespace is a tool, not wasted space

### 4. GW2 Gold is the Signature

The warm gold accent is the soul of GW2 Companion's visual identity.

- **Primary gold**: `oklch(0.72 0.14 85)`
- Use for primary actions, highlights, and moments of celebration
- Should evoke the feeling of finding treasure or achieving something meaningful
- Reserve gold for intentional emphasis; overuse dilutes its impact

---

## Design Tenets

1. **Clarity over decoration** - UI chrome should fade into the background; content is king. Remove anything that does not serve the user's goals.

2. **Consistency breeds familiarity** - Use the same patterns everywhere. Users should never wonder how something works if they have seen a similar element before.

3. **Feedback is respect** - Always acknowledge user actions. A button press, a saved setting, a completed action: all deserve confirmation.

4. **Dark mode is the default mindset** - Many gamers prefer dark interfaces, especially during extended sessions. Design dark-first, then adapt for light mode.

---

## Modern but Not Too Rounded

The aesthetic should feel contemporary and polished, but avoid the ultra-rounded, bubbly trends that dominate consumer apps. GW2's world is one of swords, magic, and ancient architecture. Crisp, intentional edges reinforce that identity.

- **Base radius**: `4px` (buttons, inputs, small elements)
- **Card radius**: `8px` (cards, modals, larger containers)
- Avoid border-radius values above 12px for functional UI elements
- Rounded corners should suggest approachability, not softness
