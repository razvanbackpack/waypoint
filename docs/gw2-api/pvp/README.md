# PvP Endpoints

**Last Updated:** 2025-12-24
**Source:** [GW2 Wiki - PvP](https://wiki.guildwars2.com/wiki/API:2/pvp)

## 1. Overview

Structured PvP endpoints for stats, matches, and rankings.

The PvP API provides comprehensive access to Guild Wars 2's structured PvP data, including player statistics, match history, seasonal standings, leaderboards, and various PvP-specific resources like amulets and heroes. Most endpoints require authentication with appropriate scopes.

## 2. /v2/pvp/stats

**Authentication Required:** Yes
**Required Scopes:** `account`, `pvp`
**Endpoint:** `GET /v2/pvp/stats`

Returns the account's PvP statistics including rank, overall wins/losses, per-profession stats, and per-ladder stats.

### Response Example

```json
{
  "pvp_rank": 5,
  "pvp_rank_points": 6513,
  "pvp_rank_rollovers": 4,
  "aggregate": {
    "wins": 6,
    "losses": 14,
    "desertions": 0,
    "byes": 0,
    "forfeits": 0
  },
  "professions": {
    "elementalist": {
      "wins": 2,
      "losses": 5,
      "desertions": 0,
      "byes": 0,
      "forfeits": 0
    },
    "guardian": {
      "wins": 4,
      "losses": 9,
      "desertions": 0,
      "byes": 0,
      "forfeits": 0
    }
  },
  "ladders": {
    "ranked": {
      "wins": 4,
      "losses": 10,
      "desertions": 0,
      "byes": 0,
      "forfeits": 0
    },
    "unranked": {
      "wins": 2,
      "losses": 4,
      "desertions": 0,
      "byes": 0,
      "forfeits": 0
    },
    "2v2ranked": {
      "wins": 0,
      "losses": 0,
      "desertions": 0,
      "byes": 0,
      "forfeits": 0
    },
    "3v3ranked": {
      "wins": 0,
      "losses": 0,
      "desertions": 0,
      "byes": 0,
      "forfeits": 0
    },
    "ctfranked": {
      "wins": 0,
      "losses": 0,
      "desertions": 0,
      "byes": 0,
      "forfeits": 0
    }
  }
}
```

### Fields

- **pvp_rank**: Current PvP rank (1-80)
- **pvp_rank_points**: Points earned towards next rank
- **pvp_rank_rollovers**: Number of times the player has ranked up past rank 80
- **aggregate**: Overall win/loss statistics across all modes and professions
- **professions**: Per-profession statistics (elementalist, guardian, warrior, etc.)
- **ladders**: Per-game-mode statistics
  - **ranked**: Ranked conquest matches
  - **unranked**: Unranked conquest matches
  - **2v2ranked**: Ranked 2v2 matches
  - **3v3ranked**: Ranked 3v3 matches
  - **ctfranked**: Ranked capture the flag matches

### Win/Loss Object Structure

Each win/loss object contains:
- **wins**: Number of wins
- **losses**: Number of losses
- **desertions**: Number of times deserted
- **byes**: Number of byes received
- **forfeits**: Number of forfeits

## 3. /v2/pvp/games

**Authentication Required:** Yes
**Required Scopes:** `account`, `pvp`
**Endpoint:** `GET /v2/pvp/games`

Returns the account's recent PvP match history (last 10 games).

### Query Parameters

- **ids**: Optional. Comma-separated list of game IDs to retrieve specific matches.

### Response Example

```json
[
  {
    "id": "A5E7D7EC-5277-4B28-8FCC-3A62F6A84A46",
    "map_id": 894,
    "started": "2015-06-06T16:23:00.000Z",
    "ended": "2015-06-06T16:37:00.000Z",
    "result": "Victory",
    "team": "Blue",
    "profession": "Guardian",
    "scores": {
      "red": 321,
      "blue": 500
    },
    "rating_type": "Ranked",
    "rating_change": 12,
    "season": "44B85826-B5ED-4890-8C77-82DDF9F2CF2B"
  }
]
```

### Fields

- **id**: Unique game identifier
- **map_id**: Map where the match was played
- **started**: ISO 8601 timestamp of match start
- **ended**: ISO 8601 timestamp of match end
- **result**: Match outcome ("Victory" or "Defeat")
- **team**: Team color ("Red" or "Blue")
- **profession**: Profession played
- **scores**: Final scores for both teams
  - **red**: Red team score
  - **blue**: Blue team score
- **rating_type**: Type of match ("Ranked", "Unranked", etc.)
- **rating_change**: Rating points gained/lost (for ranked matches)
- **season**: Season UUID (optional, only present for seasonal matches)

## 4. /v2/pvp/standings

**Authentication Required:** Yes
**Required Scopes:** `account`, `pvp`
**Endpoint:** `GET /v2/pvp/standings`

Returns the account's current season standings and best performance.

### Response Example

```json
[
  {
    "current": {
      "total_points": 156,
      "division": 4,
      "tier": 2,
      "points": 56,
      "repeats": 1,
      "rating": 1234,
      "decay": 0
    },
    "best": {
      "total_points": 256,
      "division": 5,
      "tier": 3,
      "points": 56,
      "repeats": 0,
      "rating": 1456,
      "decay": 0
    },
    "season_id": "44B85826-B5ED-4890-8C77-82DDF9F2CF2B"
  }
]
```

### Fields

- **current**: Current standing in the season
  - **total_points**: Total points earned this season
  - **division**: Current division (1-6, with 6 being Legendary)
  - **tier**: Current tier within division (1-5)
  - **points**: Points within current tier
  - **repeats**: Number of times repeated current tier
  - **rating**: MMR rating
  - **decay**: Rating decay amount
- **best**: Best standing achieved this season (same structure as current)
- **season_id**: UUID of the season

## 5. Public Endpoints

### /v2/pvp/ranks

**Authentication Required:** No
**Endpoint:** `GET /v2/pvp/ranks`

Returns information about all PvP rank definitions.

**Supports:** Bulk expansion (`?ids=all`)

#### Response Example

```json
{
  "id": 1,
  "finisher_id": 1,
  "name": "Rabbit",
  "icon": "https://render.guildwars2.com/file/...",
  "min_rank": 1,
  "max_rank": 10,
  "levels": [
    { "min_rank": 1, "max_rank": 1, "points": 0 },
    { "min_rank": 2, "max_rank": 2, "points": 500 }
  ]
}
```

#### Fields

- **id**: Rank tier ID
- **finisher_id**: Associated finisher ID
- **name**: Rank tier name (e.g., "Rabbit", "Deer", "Dragon")
- **icon**: Icon URL
- **min_rank**: Minimum rank in this tier
- **max_rank**: Maximum rank in this tier
- **levels**: Array of rank levels within this tier
  - **min_rank**: Rank number
  - **max_rank**: Same as min_rank (for single levels)
  - **points**: Points required to reach this rank

### /v2/pvp/seasons

**Authentication Required:** No
**Endpoint:** `GET /v2/pvp/seasons`

Returns information about all PvP seasons.

**Supports:** Bulk expansion (`?ids=all`)

#### Response Example

```json
{
  "id": "44B85826-B5ED-4890-8C77-82DDF9F2CF2B",
  "name": "PvP League Season One",
  "start": "2015-12-01T00:00:00.000Z",
  "end": "2016-01-26T08:00:00.000Z",
  "active": false,
  "divisions": [
    {
      "name": "Division 1",
      "flags": [],
      "large_icon": "https://render.guildwars2.com/file/...",
      "small_icon": "https://render.guildwars2.com/file/...",
      "pip_icon": "https://render.guildwars2.com/file/...",
      "tiers": [
        {
          "points": 30
        }
      ]
    }
  ],
  "leaderboards": {
    "ladder": {
      "settings": {
        "name": "Ladder",
        "duration": null,
        "scoring": "Integer",
        "tiers": []
      },
      "scorings": [
        { "id": "Wins", "type": "Integer", "description": "Total Wins" }
      ]
    },
    "legendary": {
      "settings": {
        "name": "Legendary",
        "duration": null,
        "scoring": "Integer",
        "tiers": []
      },
      "scorings": [
        { "id": "Rating", "type": "Integer", "description": "Rating" }
      ]
    },
    "guild": {
      "settings": {
        "name": "Guild",
        "duration": null,
        "scoring": "Integer",
        "tiers": []
      },
      "scorings": [
        { "id": "Rating", "type": "Integer", "description": "Rating" }
      ]
    }
  }
}
```

#### Fields

- **id**: Season UUID
- **name**: Season name
- **start**: ISO 8601 start timestamp
- **end**: ISO 8601 end timestamp
- **active**: Whether the season is currently active
- **divisions**: Array of division definitions
  - **name**: Division name
  - **flags**: Special flags (e.g., ["CanLosePoints", "CanLoseTiers"])
  - **large_icon**: Large division icon URL
  - **small_icon**: Small division icon URL
  - **pip_icon**: Pip/point icon URL
  - **tiers**: Array of tiers, each with required points
- **leaderboards**: Available leaderboard configurations
  - **ladder**: Standard ladder leaderboard
  - **legendary**: Legendary division leaderboard
  - **guild**: Guild leaderboard

### /v2/pvp/seasons/:id/leaderboards

**Authentication Required:** No
**Endpoint:** `GET /v2/pvp/seasons/:id/leaderboards`

Returns available leaderboard types for a season.

#### Response Example

```json
["ladder", "legendary", "guild"]
```

Leaderboard types:
- **ladder**: Standard conquest ladder
- **legendary**: Legendary division rankings
- **guild**: Guild rankings

### /v2/pvp/seasons/:id/leaderboards/:board/:region

**Authentication Required:** No
**Endpoint:** `GET /v2/pvp/seasons/:id/leaderboards/:board/:region`

Returns leaderboard entries for a specific season, board type, and region.

#### Parameters

- **:id**: Season UUID
- **:board**: Leaderboard type ("ladder", "legendary", or "guild")
- **:region**: Region ("na" or "eu")

#### Query Parameters

- **page**: Page number (default: 0)
- **page_size**: Number of entries per page (default: 200, max: 200)

#### Response Example

```json
[
  {
    "rank": 1,
    "name": "Player.1234",
    "id": "account-guid",
    "team": "Team Name",
    "scores": [
      { "id": "Wins", "value": "156" }
    ],
    "date": "2016-01-26T07:00:00.000Z"
  }
]
```

#### Fields

- **rank**: Leaderboard position
- **name**: Player/team name
- **id**: Account GUID or team GUID
- **team**: Team name (for guild leaderboard)
- **scores**: Array of scoring values
  - **id**: Score type (e.g., "Wins", "Rating")
  - **value**: Score value (as string)
- **date**: Last update timestamp

#### Regions

- **na**: North America
- **eu**: Europe

### /v2/pvp/amulets

**Authentication Required:** No
**Endpoint:** `GET /v2/pvp/amulets`

Returns information about all PvP amulets.

**Supports:** Bulk expansion (`?ids=all`)

#### Response Example

```json
{
  "id": 4,
  "name": "Assassin Amulet",
  "icon": "https://render.guildwars2.com/file/...",
  "attributes": {
    "Precision": 1200,
    "Power": 900,
    "CritDamage": 900
  }
}
```

#### Fields

- **id**: Amulet ID
- **name**: Amulet name
- **icon**: Icon URL
- **attributes**: Attribute bonuses provided by the amulet
  - Common attributes: Power, Precision, Toughness, Vitality, CritDamage, ConditionDamage, Healing, etc.

### /v2/pvp/heroes

**Authentication Required:** No
**Endpoint:** `GET /v2/pvp/heroes`

Returns information about all PvP heroes (used in Stronghold mode).

**Supports:** Bulk expansion (`?ids=all`)

#### Response Example

```json
{
  "id": "B7EA9889-7155-43C5-A4DA-30CF7A4FCDA1",
  "name": "Tybalt Leftpaw",
  "type": "Offensive",
  "faction": "Order of Whispers",
  "description": "Tybalt Leftpaw was a member of the Order of Whispers...",
  "skins": [
    {
      "id": 1,
      "name": "Default",
      "icon": "https://render.guildwars2.com/file/...",
      "default": true,
      "unlock_items": []
    }
  ]
}
```

#### Fields

- **id**: Hero UUID
- **name**: Hero name
- **type**: Hero type ("Offensive", "Defensive", "Support")
- **faction**: Associated faction/order
- **description**: Hero lore description
- **skins**: Available skins for this hero
  - **id**: Skin ID
  - **name**: Skin name
  - **icon**: Skin icon URL
  - **default**: Whether this is the default skin
  - **unlock_items**: Array of item IDs required to unlock this skin

## 6. /v2/account/pvp/heroes

**Authentication Required:** Yes
**Required Scopes:** `account`, `pvp`
**Endpoint:** `GET /v2/account/pvp/heroes`

Returns the account's unlocked PvP hero IDs.

### Response Example

```json
[
  "B7EA9889-7155-43C5-A4DA-30CF7A4FCDA1",
  "95EEC64C-9AA0-4D43-A734-43528BE514C5",
  "5A3C4C36-7F09-4997-81E3-9E0D2D4D9F5D"
]
```

Returns an array of hero UUIDs that the account has unlocked for use in PvP Stronghold mode.

## Notes

- All authenticated endpoints require a valid API key with the appropriate scopes.
- Match history (`/v2/pvp/games`) is limited to the most recent 10 games.
- Leaderboards are paginated with a maximum page size of 200 entries.
- Some game modes (2v2, 3v3, CTF) may not be active in all seasons.
- PvP stats and standings are updated after each match completion.
- Hero skins can be unlocked through PvP reward tracks or purchased with gems.
