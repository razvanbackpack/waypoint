# World vs World (WvW) Endpoints

**Last Updated:** 2025-12-24
**Source:** [GW2 Wiki - WvW](https://wiki.guildwars2.com/wiki/API:2/wvw)

## 1. Overview

World vs World match data, objectives, and rankings.

## 2. /v2/wvw/matches

**No authentication required**

Current matchup data:

```json
{
  "id": "1-2",
  "start_time": "2017-01-07T02:00:00Z",
  "end_time": "2017-01-14T02:00:00Z",
  "scores": { "red": 259699, "blue": 267584, "green": 378499 },
  "worlds": { "red": 1016, "blue": 1018, "green": 1008 },
  "all_worlds": { "red": [1007, 1016], "blue": [1020, 1022, 1018], "green": [1008] },
  "kills": { "red": 15459, "blue": 19500, "green": 34070 },
  "deaths": { "red": 25666, "blue": 28013, "green": 17767 },
  "victory_points": { "red": 100, "blue": 150, "green": 200 },
  "maps": [...],
  "skirmishes": [...]
}
```

Query by: `?world=WORLD_ID`, `?id=MATCH_ID`, or `?ids=...`

### Sub-endpoints

- `/v2/wvw/matches/overview` - Match times and worlds
- `/v2/wvw/matches/scores` - Scoring per map
- `/v2/wvw/matches/stats/:id/teams` - Kill/death stats

### Maps Array

Each map has:
- `id`, `type` (RedHome, GreenHome, BlueHome, Center)
- `scores`, `kills`, `deaths` per team
- `objectives`, `bonuses`

### Objectives Array

- `id`, `type` (Spawn, Camp, Ruins, Tower, Keep, Castle, Mercenary)
- `owner` (Red, Green, Blue, Neutral)
- `last_flipped`: ISO timestamp
- `claimed_by`: Guild ID (optional)
- `claimed_at`: Timestamp (optional)
- `points_tick`, `points_capture`
- `guild_upgrades` (optional)
- `yaks_delivered` (optional)

**Known issue:** Kill/death values don't match in-game values.

## 3. /v2/wvw/objectives

**No authentication required**

Objective definitions:
- `id`, `name`, `type`, `sector_id`, `map_id`, `map_type`
- `coord` (optional), `label_coord` (optional)
- `marker` (icon URL), `chat_link`
- `upgrade_id` (optional)

## 4. /v2/wvw/abilities

**No authentication required**

WvW abilities: `id`, `name`, `description`, `icon`, `ranks` (cost, effect)

## 5. /v2/wvw/ranks

**No authentication required**

WvW rank definitions: `id`, `title`, `min_rank`

## 6. /v2/wvw/upgrades

**No authentication required**

Objective upgrades:
- `id`, `tiers` (array)
- Each tier: `name`, `yaks_required`, `upgrades` (name, description, icon)

## 7. /v2/wvw/guilds/:region

**No authentication required**

Guilds participating in WvW by region.

**Regions:** 1 (NA), 2 (EU)

Returns array of guild IDs (changed from names in 2024).

## 8. /v2/wvw/timers

**No authentication required**

Match timing info with sub-endpoints:
- `/v2/wvw/timers/lockout`
- `/v2/wvw/timers/teamAssignment`

## 9. Account WvW Data

**/v2/account** (with progression scope) includes:
- `wvw.team_id`: Current team ID
- `wvw.rank`: Personal WvW rank

**/v2/account/wvw/abilities** - Unlocked WvW abilities (requires account, progression)
