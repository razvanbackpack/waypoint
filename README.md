# Waypoint

GW2 companion app. Track events, browse recipes, manage characters, check dailies.

## What it does

- **Event Timers** - World bosses, metas, invasions with countdown timers
- **Recipes** - Browse all crafting recipes, filter by discipline/level, pin favorites
- **Characters** - View inventory, equipment, bank across all characters
- **Wizard's Vault** - Daily/weekly objectives tracker
- **Trading Post** - Price lookups, profit calculator, watchlist

## Tech

- React 19 + TypeScript + Vite
- Tailwind CSS
- Zustand for state

## Run it

```bash
npm install
npm run dev
```

App runs at http://localhost:5173

## Structure

```
src/
├── api/          # GW2 API client & hooks
├── components/   # UI components by feature
├── pages/        # Route pages
├── data/         # Static data (event schedules)
├── store/        # Zustand stores
└── index.css     # Theme & global styles
```

## API Key

Go to Settings, paste your GW2 API key. Stored in localStorage, never sent anywhere except api.guildwars2.com.
