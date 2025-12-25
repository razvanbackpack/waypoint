# Wizard's Vault

**Last Updated:** 2025-12-24
**Source:** [GW2 Wiki - Wizard's Vault](https://wiki.guildwars2.com/wiki/API:2/wizardsvault)

## 1. Overview

The Wizard's Vault is Guild Wars 2's daily/weekly objective and reward system that replaced the daily achievements system in late 2023. These API endpoints were added in February 2024.

The system consists of:
- **Objectives**: Daily, weekly, and special tasks that award Astral Acclaim
- **Listings**: Rewards that can be purchased with Astral Acclaim
- **Seasons**: Time-limited periods with specific objectives and rewards
- **Meta Progress**: Track completion of multiple objectives for bonus rewards

## 2. /v2/wizardsvault

**Authentication:** Not required
**Endpoint:** `https://api.guildwars2.com/v2/wizardsvault`

Returns information about the current Wizard's Vault season.

### Response Example

```json
{
  "title": "The Realm of Dreams Season",
  "start": "2022-11-07T17:00:00Z",
  "end": "2024-05-14T16:00:00Z",
  "listings": [1, 2, 3, 4, 5],
  "objectives": [1, 2, 3, 4, 5]
}
```

### Fields

- `title` (string): Name of the current season
- `start` (ISO-8601): Season start date/time
- `end` (ISO-8601): Season end date/time
- `listings` (array): IDs of all available reward listings
- `objectives` (array): IDs of all available objectives

## 3. /v2/wizardsvault/listings

**Authentication:** Not required
**Endpoint:** `https://api.guildwars2.com/v2/wizardsvault/listings`

Returns all reward listings available for purchase with Astral Acclaim.

### Bulk Expansion

Supports standard bulk expansion:
- `?ids=1,2,3` - Get specific listings
- `?ids=all` - Get all listings

### Response Example

```json
{
  "id": 1,
  "item_id": 12345,
  "item_count": 1,
  "type": "Featured",
  "cost": 150
}
```

### Fields

- `id` (number): Unique listing identifier
- `item_id` (number): The item being sold (matches /v2/items)
- `item_count` (number): Quantity of the item
- `type` (string): Listing category
  - `Featured` - Highlighted/special rewards
  - `Normal` - Standard rewards
  - `Legacy` - Previous season rewards
- `cost` (number): Price in Astral Acclaim

## 4. /v2/wizardsvault/objectives

**Authentication:** Not required
**Endpoint:** `https://api.guildwars2.com/v2/wizardsvault/objectives`

Returns all available objectives that can award Astral Acclaim.

### Bulk Expansion

Supports standard bulk expansion:
- `?ids=1,2,3` - Get specific objectives
- `?ids=all` - Get all objectives

### Response Example

```json
{
  "id": 1,
  "title": "Daily Completionist",
  "track": "PvE",
  "acclaim": 10
}
```

### Fields

- `id` (number): Unique objective identifier
- `title` (string): Display name of the objective
- `track` (string): Game mode category
  - `PvE` - Player vs Environment
  - `PvP` - Player vs Player
  - `WvW` - World vs World
- `acclaim` (number): Astral Acclaim reward for completing this objective

## 5. Account Endpoints (Authenticated)

All account endpoints require authentication and the following scopes:
- `account` - Access to account data
- `progression` - Access to progression/achievement data

### /v2/account/wizardsvault/daily

**Authentication:** Required (account, progression scopes)
**Endpoint:** `https://api.guildwars2.com/v2/account/wizardsvault/daily`

Returns the account's progress on daily objectives.

#### Response Example

```json
{
  "meta_progress_current": 3,
  "meta_progress_complete": 4,
  "meta_reward_item_id": 12345,
  "meta_reward_astral": 20,
  "meta_reward_claimed": false,
  "objectives": [
    {
      "id": 1,
      "title": "Daily Completionist",
      "track": "PvE",
      "acclaim": 10,
      "progress_current": 1,
      "progress_complete": 1,
      "claimed": true
    },
    {
      "id": 2,
      "title": "Daily Vista Viewer",
      "track": "PvE",
      "acclaim": 5,
      "progress_current": 3,
      "progress_complete": 5,
      "claimed": false
    }
  ]
}
```

#### Fields

**Meta Progress:**
- `meta_progress_current` (number): Number of daily objectives completed
- `meta_progress_complete` (number): Total objectives needed for meta reward
- `meta_reward_item_id` (number): Item ID of the bonus reward
- `meta_reward_astral` (number): Bonus Astral Acclaim for completing meta
- `meta_reward_claimed` (boolean): Whether the meta reward has been claimed

**Objectives Array:**
- `id` (number): Objective ID (matches /v2/wizardsvault/objectives)
- `title` (string): Objective name
- `track` (string): Game mode (PvE, PvP, WvW)
- `acclaim` (number): Astral Acclaim reward
- `progress_current` (number): Current progress value
- `progress_complete` (number): Progress needed to complete
- `claimed` (boolean): Whether the reward has been claimed

### /v2/account/wizardsvault/weekly

**Authentication:** Required (account, progression scopes)
**Endpoint:** `https://api.guildwars2.com/v2/account/wizardsvault/weekly`

Returns the account's progress on weekly objectives. Uses the same response structure as the daily endpoint.

### /v2/account/wizardsvault/special

**Authentication:** Required (account, progression scopes)
**Endpoint:** `https://api.guildwars2.com/v2/account/wizardsvault/special`

Returns the account's progress on special/bonus objectives. Uses the same response structure as the daily endpoint.

### /v2/account/wizardsvault/listings

**Authentication:** Required (account, progression scopes)
**Endpoint:** `https://api.guildwars2.com/v2/account/wizardsvault/listings`

Returns an array of listing IDs that the account has purchased.

#### Response Example

```json
[1, 5, 12, 23, 45]
```

## 6. Reset Times

Understanding when objectives reset is crucial for tracking:

- **Daily Objectives**: Reset at 00:00 UTC every day
- **Weekly Objectives**: Reset at 07:30 UTC every Monday

Note: These times align with Guild Wars 2's standard daily and weekly reset schedules.

## 7. Astral Acclaim

Astral Acclaim is the currency earned from completing Wizard's Vault objectives and spent on reward listings.

### Key Points

- Earned by completing daily, weekly, and special objectives
- Spent on items from the Wizard's Vault listings
- Can be tracked via `/v2/account/wallet` endpoint
- Currency ID may vary by season (check wallet endpoint for current ID)
- Does not expire but may have seasonal spending limitations

### Tracking Astral Acclaim

To get the current Astral Acclaim balance:

1. Call `/v2/account/wallet` with authentication
2. Look for the Astral Acclaim currency entry
3. The `value` field shows the current balance

Example wallet entry:
```json
{
  "id": 7,
  "value": 850
}
```

Note: The currency ID for Astral Acclaim should be verified via the wallet endpoint as it may change between seasons.

## 8. Implementation Notes

### Caching Recommendations

- **Season info** (`/v2/wizardsvault`): Cache until season end date
- **Listings**: Cache for 1 hour, refresh when season changes
- **Objectives**: Cache for 1 hour, refresh when season changes
- **Account daily**: Refresh after daily reset (00:00 UTC)
- **Account weekly**: Refresh after weekly reset (Monday 07:30 UTC)
- **Account special**: Refresh every 15-30 minutes

### Error Handling

- Returns standard GW2 API error responses
- Account endpoints return 403 if missing required scopes
- Invalid IDs return 404 errors

### Best Practices

1. **Check season dates** before displaying objectives
2. **Handle claimed status** to show what rewards are available
3. **Display progress** with clear current/complete values
4. **Group by track** (PvE/PvP/WvW) for better UX
5. **Show reset times** so users know when objectives refresh
6. **Cache appropriately** to reduce API calls

### Related Endpoints

- `/v2/items` - Get item details for listings
- `/v2/account/wallet` - Track Astral Acclaim balance
- `/v2/achievements` - Legacy daily achievements system

## 9. Example Use Cases

### Daily Objective Tracker

```typescript
// Fetch daily objectives with progress
const dailyData = await fetch('https://api.guildwars2.com/v2/account/wizardsvault/daily', {
  headers: { 'Authorization': `Bearer ${apiKey}` }
});

// Display unclaimed objectives
const unclaimed = dailyData.objectives.filter(obj =>
  obj.progress_current >= obj.progress_complete && !obj.claimed
);

// Check if meta reward is available
if (dailyData.meta_progress_current >= dailyData.meta_progress_complete
    && !dailyData.meta_reward_claimed) {
  console.log('Meta reward ready to claim!');
}
```

### Listing Browser

```typescript
// Get all available listings
const listings = await fetch('https://api.guildwars2.com/v2/wizardsvault/listings?ids=all');

// Group by type
const featured = listings.filter(l => l.type === 'Featured');
const normal = listings.filter(l => l.type === 'Normal');
const legacy = listings.filter(l => l.type === 'Legacy');

// Get item details
const itemIds = listings.map(l => l.item_id).join(',');
const items = await fetch(`https://api.guildwars2.com/v2/items?ids=${itemIds}`);
```

### Progress Dashboard

```typescript
// Fetch all objective progress
const [daily, weekly, special] = await Promise.all([
  fetch('https://api.guildwars2.com/v2/account/wizardsvault/daily', { headers }),
  fetch('https://api.guildwars2.com/v2/account/wizardsvault/weekly', { headers }),
  fetch('https://api.guildwars2.com/v2/account/wizardsvault/special', { headers })
]);

// Calculate total acclaim available
const totalAvailable =
  daily.objectives.filter(o => !o.claimed).reduce((sum, o) => sum + o.acclaim, 0) +
  weekly.objectives.filter(o => !o.claimed).reduce((sum, o) => sum + o.acclaim, 0) +
  special.objectives.filter(o => !o.claimed).reduce((sum, o) => sum + o.acclaim, 0);
```
