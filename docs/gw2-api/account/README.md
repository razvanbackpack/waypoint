# Account Endpoints

**Last Updated:** 2025-12-24
**Source:** [GW2 Wiki - Account](https://wiki.guildwars2.com/wiki/API:2/account)

---

## 1. /v2/account

Main account info endpoint. Requires `account` scope.

**Authentication:** Required
**Scopes:** account (required), guilds, progression, builds

### Response Fields

| Field | Type | Description | Requirements |
|-------|------|-------------|--------------|
| id | string | Unique account GUID | - |
| name | string | Account name with suffix | - |
| age | number | Account age in seconds | - |
| world | number | Home world ID | - |
| created | string | ISO-8601 creation date | - |
| commander | boolean | Commander's Compendium owned | - |
| guilds | array | Guild IDs | - |
| guild_leader | array | Led guild IDs | guilds scope |
| access | array | Content ownership (PlayForFree, GuildWars2, HeartOfThorns, PathOfFire, EndOfDragons, SecretsOfTheObscure, JanthirWilds) | - |
| fractal_level | number | Fractal level | progression |
| daily_ap | number | Daily achievement points | progression |
| monthly_ap | number | Monthly achievement points | progression |
| wvw | object | WvW data (team_id, rank) | progression |
| last_modified | string | Last change timestamp | schema 2019-02-21+ |
| build_storage_slots | number | Build storage slots | builds scope |

### Example Response

```json
{
  "id": "account-guid-here",
  "name": "Account.1234",
  "age": 12345678,
  "world": 1008,
  "created": "2012-08-28T00:00:00Z",
  "commander": true,
  "guilds": ["guild-guid-1", "guild-guid-2"],
  "guild_leader": ["guild-guid-1"],
  "access": ["GuildWars2", "HeartOfThorns", "PathOfFire", "EndOfDragons"],
  "fractal_level": 100,
  "daily_ap": 5000,
  "monthly_ap": 1000,
  "wvw": {
    "team_id": 1,
    "rank": 150
  },
  "last_modified": "2025-12-24T10:30:00Z",
  "build_storage_slots": 8
}
```

---

## 2. /v2/account/bank

Returns the contents of the account bank.

**Authentication:** Required
**Scopes:** account, inventories

### Response

Returns an array of bank slots. Each slot can be:
- `null` for empty slots
- An item object with the following fields:

| Field | Type | Description |
|-------|------|-------------|
| id | number | Item ID |
| count | number | Stack count |
| charges | number | Remaining charges (if applicable) |
| skin | number | Applied skin ID |
| dyes | array | Applied dye IDs |
| upgrades | array | Upgrade component IDs |
| upgrade_slot_indices | array | Indices of upgrade slots |
| infusions | array | Infusion IDs |
| binding | string | Binding type (Account/Character) |
| bound_to | string | Character name if Character bound |
| stats | object | Selectable stats info |

### Example Response

```json
[
  null,
  {
    "id": 46762,
    "count": 250,
    "binding": "Account"
  },
  {
    "id": 12345,
    "count": 1,
    "skin": 4356,
    "upgrades": [24615],
    "binding": "Character",
    "bound_to": "Character Name"
  }
]
```

---

## 3. /v2/account/materials

Returns ALL materials in the material storage, including those with count 0.

**Authentication:** Required
**Scopes:** account, inventories

### Response

Returns an array of material storage items:

| Field | Type | Description |
|-------|------|-------------|
| id | number | Item ID |
| category | number | Material category ID |
| binding | string | Binding type |
| count | number | Quantity stored (can be 0) |

### Example Response

```json
[
  {
    "id": 19697,
    "category": 5,
    "binding": "Account",
    "count": 250
  },
  {
    "id": 19698,
    "category": 5,
    "binding": "Account",
    "count": 0
  }
]
```

---

## 4. /v2/account/wallet

Returns all currencies owned by the account.

**Authentication:** Required
**Scopes:** account, wallet

### Response

Returns an array of currency entries:

| Field | Type | Description |
|-------|------|-------------|
| id | number | Currency ID |
| value | number | Amount owned |

Use `/v2/currencies` endpoint to resolve currency IDs to names and icons.

### Example Response

```json
[
  {
    "id": 1,
    "value": 123456789
  },
  {
    "id": 4,
    "value": 5000
  },
  {
    "id": 23,
    "value": 100
  }
]
```

---

## 5. /v2/account/achievements

Returns the player's achievement progress.

**Authentication:** Required
**Scopes:** account, progression

### Response

Returns an array of achievement progress entries:

| Field | Type | Description |
|-------|------|-------------|
| id | number | Achievement ID |
| bits | array | Progress details for tiered achievements |
| current | number | Current progress |
| max | number | Maximum progress needed |
| done | boolean | Completion status |
| repeated | number | Times repeated (for repeatable achievements) |
| unlocked | boolean | Whether achievement is unlocked |

### Example Response

```json
[
  {
    "id": 1,
    "bits": [0, 1, 2, 5],
    "current": 4,
    "max": 10,
    "done": false,
    "unlocked": true
  },
  {
    "id": 2,
    "done": true,
    "unlocked": true
  }
]
```

---

## 6. Other Account Endpoints

### Build Storage & Templates
- **`/v2/account/buildstorage`** - Saved build templates (requires: account, builds, characters)

### Daily Progress
- **`/v2/account/dailycrafting`** - Daily crafting items completed today (requires: account, progression, unlocks)
- **`/v2/account/dungeons`** - Completed dungeon paths today (requires: account, progression)
- **`/v2/account/mapchests`** - Completed map chests today (requires: account, progression)
- **`/v2/account/worldbosses`** - Killed world bosses today (requires: account, progression)

### Unlocks - Cosmetics
- **`/v2/account/dyes`** - Unlocked dye IDs (requires: account, unlocks)
- **`/v2/account/emotes`** - Unlocked emote IDs (requires: account, unlocks)
- **`/v2/account/finishers`** - Unlocked finisher IDs with details (requires: account, unlocks)
- **`/v2/account/gliders`** - Unlocked glider skin IDs (requires: account, unlocks)
- **`/v2/account/jadebots`** - Unlocked jadebot skin IDs (requires: account, unlocks)
- **`/v2/account/mailcarriers`** - Unlocked mail carrier IDs (requires: account, unlocks)
- **`/v2/account/minis`** - Unlocked miniature IDs (requires: account, unlocks)
- **`/v2/account/mounts/skins`** - Unlocked mount skin IDs (requires: account, unlocks)
- **`/v2/account/mounts/types`** - Unlocked mount type IDs (requires: account, unlocks)
- **`/v2/account/novelties`** - Unlocked novelty IDs (requires: account, unlocks)
- **`/v2/account/outfits`** - Unlocked outfit IDs (requires: account, unlocks)
- **`/v2/account/skiffs`** - Unlocked skiff skin IDs (requires: account, unlocks)
- **`/v2/account/skins`** - Unlocked armor/weapon skin IDs (requires: account, unlocks)
- **`/v2/account/titles`** - Unlocked title IDs (requires: account, unlocks)

### Home Instance
- **`/v2/account/home/cats`** - Unlocked home instance cat IDs (requires: account, unlocks, progression)
- **`/v2/account/home/nodes`** - Unlocked home instance gathering node IDs (requires: account, unlocks, progression)

### Homestead
- **`/v2/account/homestead/decorations`** - Homestead decoration unlocks (requires: account, unlocks)
- **`/v2/account/homestead/glyphs`** - Homestead glyph unlocks (requires: account, unlocks)

### Inventory
- **`/v2/account/inventory`** - Shared inventory slot contents (requires: account, inventories)

### Legendary Armory
- **`/v2/account/legendaryarmory`** - Legendary armory items with counts (requires: account, inventories, unlocks)

### Luck
- **`/v2/account/luck`** - Total account luck and magic find (requires: account, progression, unlocks)

### Masteries
- **`/v2/account/masteries`** - Unlocked mastery IDs and progress (requires: account, progression)
- **`/v2/account/mastery/points`** - Available mastery points by region (requires: account, progression)

### Story & Progression
- **`/v2/account/progression`** - Story instance progress (requires: account, progression)

### PvP
- **`/v2/account/pvp/heroes`** - Unlocked PvP hero IDs (requires: account, unlocks)

### Raids
- **`/v2/account/raids`** - Completed raid encounters this week (requires: account, progression)

### Recipes
- **`/v2/account/recipes`** - Unlocked recipe IDs (requires: account, unlocks)

---

## Authentication & Scopes

All account endpoints require authentication via an API key. The most commonly required scopes are:

- **account** - Basic account information (required for all endpoints)
- **inventories** - Inventory and material storage access
- **wallet** - Currency and wallet access
- **progression** - Achievement and progression data
- **unlocks** - Unlock status for cosmetics and account upgrades
- **builds** - Build template access
- **characters** - Character data access
- **guilds** - Guild membership and leadership information

### Creating an API Key

1. Visit [GW2 Account API Keys](https://account.arena.net/applications)
2. Click "New Key"
3. Give it a name and select required permissions
4. Copy the generated key (you won't see it again!)

---

## Rate Limiting

The GW2 API implements rate limiting:
- **300 requests per minute** for authenticated requests
- **60 requests per minute** for unauthenticated requests

Rate limit information is provided in response headers:
- `X-Rate-Limit-Limit` - Maximum requests allowed
- `X-Rate-Limit-Remaining` - Requests remaining in current window
- `X-Rate-Limit-Reset` - Seconds until rate limit resets

---

## Error Responses

Common error responses:

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request format |
| 403 | Forbidden | Invalid API key or insufficient permissions |
| 404 | Not Found | Endpoint or resource not found |
| 429 | Too Many Requests | Rate limit exceeded |
| 503 | Service Unavailable | API temporarily unavailable |

### Example Error Response

```json
{
  "text": "invalid key"
}
```
