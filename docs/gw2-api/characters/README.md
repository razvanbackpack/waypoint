# Characters Endpoints

**Last Updated:** 2025-12-24
**Source:** [GW2 Wiki - Characters](https://wiki.guildwars2.com/wiki/API:2/characters)

## Overview

The Characters endpoints provide access to detailed information about a player's characters, including their stats, equipment, inventory, skills, specializations, and more. All endpoints require authentication with appropriate scopes.

---

## 1. /v2/characters

**Required Scopes:** `account`, `characters`

The base characters endpoint provides access to character data in multiple patterns:

### Access Patterns

- **`/v2/characters`** - Returns an array of character names for the authenticated account
- **`/v2/characters/:name`** - Returns a complete character summary for the specified character (URL encode spaces as %20)
- **`/v2/characters?ids=all`** - Returns complete data for all characters on the account

### Example Response (Character Names)

```json
[
  "Character One",
  "Character Two",
  "Character Three"
]
```

---

## 2. Core Character Fields

When requesting a specific character or all characters, the following fields are returned:

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Character name |
| `race` | string | Character race: `Asura`, `Charr`, `Human`, `Norn`, `Sylvari` |
| `gender` | string | Character gender: `Male`, `Female` |
| `profession` | string | Character profession: `Elementalist`, `Engineer`, `Guardian`, `Mesmer`, `Necromancer`, `Ranger`, `Revenant`, `Thief`, `Warrior` |
| `level` | integer | Character level (1-80) |
| `guild` | string | Current representing guild ID (optional) |
| `age` | integer | Total playtime in seconds |
| `created` | string | ISO-8601 timestamp of character creation |
| `deaths` | integer | Total number of deaths |
| `title` | integer | Current title ID (optional) - resolve with `/v2/titles` |
| `last_modified` | string | ISO-8601 timestamp of last modification |

### Schema 2019-12-19+ Additional Fields

Characters created or modified after the 2019-12-19 schema update include:

| Field | Type | Description |
|-------|------|-------------|
| `build_tabs_unlocked` | integer | Number of build tabs unlocked |
| `active_build_tab` | integer | Index of currently active build tab |
| `equipment_tabs_unlocked` | integer | Number of equipment tabs unlocked |
| `active_equipment_tab` | integer | Index of currently active equipment tab |
| `flags` | array | Special flags (e.g., `["Beta"]`) |

### Example Response (Character Summary)

```json
{
  "name": "My Character",
  "race": "Human",
  "gender": "Female",
  "profession": "Guardian",
  "level": 80,
  "guild": "75FD83CF-0C45-4834-BC4C-097F93A487AF",
  "age": 1234567,
  "created": "2015-06-16T19:08:00Z",
  "deaths": 42,
  "title": 297,
  "last_modified": "2024-12-20T15:30:00Z",
  "build_tabs_unlocked": 3,
  "active_build_tab": 1,
  "equipment_tabs_unlocked": 6,
  "active_equipment_tab": 0,
  "flags": []
}
```

---

## 3. Sub-endpoints

All character sub-endpoints follow the pattern `/v2/characters/:id/[endpoint]` where `:id` is the URL-encoded character name.

---

### /v2/characters/:id/backstory

**Required Scopes:** `account`, `characters`

Returns an array of backstory answer IDs representing the choices made during character creation.

**Response:** Array of integers

```json
[7, 8, 9, 10, 11]
```

**Note:** Resolve answer IDs using `/v2/backstory/answers` endpoint.

---

### /v2/characters/:id/buildtabs

**Required Scopes:** `account`, `characters`, `builds`

Returns all build configurations (build tabs) for the character.

#### Response Structure

```json
[
  {
    "tab": 1,
    "is_active": true,
    "build": {
      "name": "Power Build",
      "profession": "Guardian",
      "specializations": [
        {
          "id": 27,
          "traits": [567, 578, 582]
        },
        {
          "id": 42,
          "traits": [621, 622, 624]
        },
        {
          "id": 65,
          "traits": [2017, 2018, 2020]
        }
      ],
      "skills": {
        "heal": 5802,
        "utilities": [5641, 5734, 5802],
        "elite": 5666
      },
      "aquatic_skills": {
        "heal": 5802,
        "utilities": [5641, 5734, 5802],
        "elite": 5666
      }
    }
  }
]
```

#### Build Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Build name |
| `profession` | string | Character profession |
| `specializations` | array | Array of 3 specialization objects with `id` and `traits` |
| `skills` | object | Terrestrial skills: `heal`, `utilities` (array), `elite` |
| `aquatic_skills` | object | Underwater skills: `heal`, `utilities` (array), `elite` |

#### Profession-Specific Fields

**Revenant:**
- `legends` - Array of two legend IDs for terrestrial stance swapping
- `aquatic_legends` - Array of two legend IDs for underwater

**Ranger:**
- `pets` - Object with `terrestrial` (array of 2) and `aquatic` (array of 2) pet IDs

---

### /v2/characters/:id/core

**Required Scopes:** `account`, `characters`

Returns basic character statistics and information.

**Note:** This endpoint returns the same data as the main character summary.

---

### /v2/characters/:id/crafting

**Required Scopes:** `account`, `characters`

Returns crafting disciplines learned by the character.

#### Response Structure

```json
[
  {
    "discipline": "Weaponsmith",
    "rating": 500,
    "active": true
  },
  {
    "discipline": "Armorsmith",
    "rating": 400,
    "active": false
  }
]
```

#### Crafting Disciplines

- `Armorsmith`
- `Artificer`
- `Chef`
- `Huntsman`
- `Jeweler`
- `Leatherworker`
- `Scribe`
- `Tailor`
- `Weaponsmith`

#### Fields

| Field | Type | Description |
|-------|------|-------------|
| `discipline` | string | Crafting discipline name |
| `rating` | integer | Crafting level (0-500) |
| `active` | boolean | Whether this discipline is currently active |

---

### /v2/characters/:id/equipment

**Required Scopes:** `account`, `characters`, `builds`

Returns all currently equipped items on the character.

#### Response Structure

```json
[
  {
    "id": 12345,
    "slot": "Helm",
    "infusions": [49428],
    "upgrades": [24836],
    "skin": 6789,
    "stats": {
      "id": 1163,
      "attributes": {
        "Power": 251,
        "Precision": 179,
        "CritDamage": 179
      }
    },
    "binding": "Character",
    "bound_to": "My Character",
    "location": "Equipped",
    "tabs": [1, 2]
  }
]
```

#### Equipment Slots

**Armor:**
- `Helm`
- `Shoulders`
- `Coat`
- `Gloves`
- `Leggings`
- `Boots`
- `HelmAquatic` (underwater breathing apparatus)

**Weapons:**
- `WeaponA1` (main hand, set 1)
- `WeaponA2` (off hand, set 1)
- `WeaponB1` (main hand, set 2)
- `WeaponB2` (off hand, set 2)
- `WeaponAquaticA` (underwater weapon set 1)
- `WeaponAquaticB` (underwater weapon set 2)

**Trinkets:**
- `Backpack`
- `Accessory1`
- `Accessory2`
- `Amulet`
- `Ring1`
- `Ring2`
- `Relic`

**Gathering Tools:**
- `Sickle`
- `Axe`
- `Pick`

**Fishing:**
- `FishingRod`
- `FishingBait`
- `FishingLure`

**Jade Bot (End of Dragons):**
- `PowerCore`
- `SensoryArray`
- `ServiceChip`

#### Item Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Item ID - resolve with `/v2/items` |
| `slot` | string | Equipment slot |
| `infusions` | array | Array of infusion item IDs |
| `upgrades` | array | Array of upgrade item IDs (runes, sigils) |
| `skin` | integer | Applied skin ID - resolve with `/v2/skins` |
| `stats` | object | Item stats with `id` and `attributes` |
| `binding` | string | Binding type: `Account`, `Character` |
| `bound_to` | string | Character name if character-bound |
| `location` | string | Item location (typically `Equipped`) |
| `charges` | integer | Remaining charges (for consumables) |
| `dyes` | array | Applied dye IDs (for armor) |
| `tabs` | array | Equipment tab indices this item appears in |

---

### /v2/characters/:id/equipmenttabs

**Required Scopes:** `account`, `characters`, `builds`

Returns all equipment loadouts (equipment tabs) for the character.

#### Response Structure

```json
[
  {
    "tab": 1,
    "name": "Power DPS",
    "is_active": true,
    "equipment": [
      {
        "id": 12345,
        "slot": "Helm",
        "infusions": [49428],
        "upgrades": [24836],
        "skin": 6789,
        "stats": {
          "id": 1163
        },
        "binding": "Character",
        "bound_to": "My Character"
      }
    ],
    "equipment_pvp": {
      "amulet": 332,
      "rune": 221,
      "sigils": [24548, 24583]
    }
  }
]
```

#### Fields

| Field | Type | Description |
|-------|------|-------------|
| `tab` | integer | Tab index |
| `name` | string | User-defined tab name |
| `is_active` | boolean | Whether this is the currently active tab |
| `equipment` | array | Array of equipped items (same structure as `/equipment`) |
| `equipment_pvp` | object | PvP equipment settings (amulet, rune, sigils) |

---

### /v2/characters/:id/inventory

**Required Scopes:** `account`, `characters`, `inventories`

Returns the character's inventory organized by bags.

#### Response Structure

```json
{
  "bags": [
    {
      "id": 8941,
      "size": 20,
      "inventory": [
        {
          "id": 23095,
          "count": 1,
          "charges": 3,
          "infusions": [],
          "upgrades": [],
          "skin": 1234,
          "stats": {
            "id": 1163,
            "attributes": {
              "Power": 251,
              "Precision": 179,
              "CritDamage": 179
            }
          },
          "binding": "Account",
          "dyes": [12, 45, 67, 89]
        },
        null,
        null,
        {
          "id": 12345,
          "count": 250
        }
      ]
    }
  ]
}
```

#### Bags Array

Each bag object contains:

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Bag item ID - resolve with `/v2/items` |
| `size` | integer | Number of slots in the bag |
| `inventory` | array | Array of items or `null` for empty slots |

#### Item Objects

Same structure as equipment items, with additional fields:

| Field | Type | Description |
|-------|------|-------------|
| `count` | integer | Stack count |
| `charges` | integer | Remaining charges (for consumables) |
| `binding` | string | Binding type: `Account`, `Character` |
| `bound_to` | string | Character name if character-bound |

**Note:** Empty inventory slots are represented as `null`.

---

### /v2/characters/:id/skills

**Required Scopes:** `account`, `characters`, `builds`

Returns equipped skills organized by game mode.

#### Response Structure

```json
{
  "pve": {
    "heal": 5802,
    "utilities": [5641, 5734, 5802],
    "elite": 5666
  },
  "pvp": {
    "heal": 5802,
    "utilities": [5641, 5734, 5802],
    "elite": 5666
  },
  "wvw": {
    "heal": 5802,
    "utilities": [5641, 5734, 5802],
    "elite": 5666
  }
}
```

#### Revenant-Specific

For Revenant characters, includes legend slots:

```json
{
  "pve": {
    "heal": 28494,
    "utilities": [27356, 27074, 27189],
    "elite": 28419,
    "legends": [28134, 28419]
  }
}
```

#### Fields by Mode

Each mode (`pve`, `pvp`, `wvw`) contains:

| Field | Type | Description |
|-------|------|-------------|
| `heal` | integer | Heal skill ID |
| `utilities` | array | Array of 3 utility skill IDs |
| `elite` | integer | Elite skill ID |
| `legends` | array | (Revenant only) Array of 2 legend IDs |

**Note:** Resolve skill IDs with `/v2/skills` and legend IDs with `/v2/legends`.

---

### /v2/characters/:id/specializations

**Required Scopes:** `account`, `characters`, `builds`

Returns equipped specializations and traits organized by game mode.

#### Response Structure

```json
{
  "pve": [
    {
      "id": 27,
      "traits": [567, 578, 582]
    },
    {
      "id": 42,
      "traits": [621, 622, 624]
    },
    {
      "id": 65,
      "traits": [2017, 2018, 2020]
    }
  ],
  "pvp": [
    {
      "id": 27,
      "traits": [567, 578, 582]
    },
    {
      "id": 42,
      "traits": [621, 622, 624]
    },
    {
      "id": 65,
      "traits": [2017, 2018, 2020]
    }
  ],
  "wvw": [
    {
      "id": 27,
      "traits": [567, 578, 582]
    },
    {
      "id": 42,
      "traits": [621, 622, 624]
    },
    {
      "id": 65,
      "traits": [2017, 2018, 2020]
    }
  ]
}
```

#### Specialization Object

Each mode (`pve`, `pvp`, `wvw`) contains an array of exactly 3 specialization objects:

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Specialization ID - resolve with `/v2/specializations` |
| `traits` | array | Array of exactly 3 trait IDs - resolve with `/v2/traits` |

**Note:** Trait selection follows the specialization tree structure with one trait per tier (adept, master, grandmaster).

---

### /v2/characters/:id/training

**Required Scopes:** `account`, `characters`, `builds`

Returns skill tree training progress for the character.

#### Response Structure

```json
[
  {
    "id": 111,
    "spent": 49,
    "done": true
  },
  {
    "id": 34,
    "spent": 25,
    "done": false
  }
]
```

#### Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Training track ID - resolve with `/v2/professions` |
| `spent` | integer | Hero points spent in this track |
| `done` | boolean | Whether the track is fully completed |

**Note:** Training tracks include core profession skills and elite specializations.

---

### /v2/characters/:id/heropoints

**Required Scopes:** `account`, `characters`

Returns hero points (hero challenges) completed by the character across all maps.

#### Response Structure

```json
[
  "0-0",
  "0-2",
  "0-3",
  "1-0",
  "1-4",
  "15-0",
  "15-1"
]
```

**Format:** Hero point IDs are strings in the format `"{region}-{challenge}"` where:
- `region` corresponds to map regions
- `challenge` is a sequential index

**Note:** There is no dedicated endpoint to resolve these IDs to map locations. Cross-reference with community resources or map completion data.

---

### /v2/characters/:id/recipes

**Required Scopes:** `account`, `characters`

Returns all crafting recipes learned by the character.

#### Response Structure

```json
[
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  2982,
  2983,
  2984
]
```

**Response:** Array of recipe IDs

**Note:** Resolve recipe IDs with `/v2/recipes`.

---

### /v2/characters/:id/sab

**Required Scopes:** `account`, `characters`

Returns Super Adventure Box (SAB) progression data for the character.

#### Response Structure

```json
{
  "zones": [
    {
      "id": 1,
      "mode": "infantile",
      "world": 1,
      "zone": 1
    },
    {
      "id": 2,
      "mode": "normal",
      "world": 1,
      "zone": 2
    }
  ],
  "unlocks": [
    {
      "id": 1,
      "name": "chain_stick"
    },
    {
      "id": 2,
      "name": "slingshot"
    }
  ],
  "songs": [
    {
      "id": 1,
      "name": "secret_song"
    }
  ]
}
```

#### Zones Array

Completed SAB zones:

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Zone completion ID |
| `mode` | string | Difficulty mode: `infantile`, `normal`, `tribulation` |
| `world` | integer | World number (1-2) |
| `zone` | integer | Zone number within world (1-3) |

#### Unlocks Array

Unlocked items and upgrades:

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Unlock ID |
| `name` | string | Unlock name (e.g., `chain_stick`, `slingshot`, `whip`) |

#### Songs Array

Discovered songs:

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Song ID |
| `name` | string | Song name |

**Note:** SAB is a special annual festival game mode. This data is only relevant for characters that have participated in SAB.

---

## Rate Limiting

All character endpoints are subject to the standard GW2 API rate limits:
- **Rate Limit:** 600 requests per minute
- **Headers:** Check `X-Rate-Limit-Remaining` and `X-Rate-Limit-Reset` response headers

## Authentication

All character endpoints require:
1. **API Key** with appropriate scopes in the `Authorization` header
2. **Scopes:** Most endpoints require `account` + `characters`, some require additional scopes like `builds`, `inventories`

```http
Authorization: Bearer YOUR-API-KEY-HERE
```

## Error Responses

Common error scenarios:

- **401 Unauthorized:** Invalid or missing API key
- **403 Forbidden:** API key lacks required scopes
- **404 Not Found:** Character name doesn't exist or is misspelled
- **429 Too Many Requests:** Rate limit exceeded

---

## Additional Resources

- **GW2 API Documentation:** https://wiki.guildwars2.com/wiki/API:2/characters
- **API Key Management:** https://account.arena.net/applications
- **Community Tools:** https://gw2efficiency.com, https://gw2crafts.net

## Notes

- **URL Encoding:** Always URL-encode character names (spaces → `%20`)
- **Case Sensitivity:** Character names are case-sensitive
- **Schema Updates:** Check `last_modified` timestamp to detect character changes
- **PvP Equipment:** PvP builds use separate amulet/rune/sigil system (see `equipment_pvp`)
- **Build Templates:** Build tabs were added in 2019 schema update
- **Equipment Templates:** Equipment tabs support up to 6 loadouts per character
