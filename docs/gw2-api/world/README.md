# World & Maps

**Last Updated:** 2025-12-24
**Source:** [GW2 Wiki - Maps](https://wiki.guildwars2.com/wiki/API:2/maps) | [Worlds](https://wiki.guildwars2.com/wiki/API:2/worlds)

## 1. /v2/worlds
**No authentication required**

Game servers:
- id, name, population (Low, Medium, High, VeryHigh, Full)

ID patterns:
- First digit: 1=NA, 2=EU
- Second digit (EU): 1=French, 2=German, 3=Spanish

Example:
```json
{ "id": 1001, "name": "Anvil Rock", "population": "Medium" }
```

## 2. /v2/maps
**No authentication required**

Map data:
- id, name, min_level, max_level
- default_floor, floors (array)
- type: BlueHome, Center, EdgeOfTheMists, GreenHome, Instance, JumpPuzzle, Public, Pvp, RedHome, Tutorial, Unknown
- region_id, region_name, continent_id, continent_name
- map_rect: [[SW_x, SW_y], [NE_x, NE_y]]
- continent_rect: [[NW_x, NW_y], [SE_x, SE_y]]

Known issue: Continents/regions don't always align for story instances.

## 3. /v2/continents
**No authentication required**

Continent data with nested structure:
- id, name, continent_dims, min_zoom, max_zoom, floors

### /v2/continents/:id/floors/:floor
Floor details with regions, maps, POIs, tasks, skill_challenges, sectors.

## 4. /v2/dungeons
**No authentication required**

- id, paths (array of {id, type})
- Types: Story, Explorable

Dungeons: ascalonian_catacombs, caudecus_manor, twilight_arbor, sorrows_embrace, citadel_of_flame, honor_of_the_waves, crucible_of_eternity, ruined_city_of_arah

## 5. /v2/raids
**No authentication required**

- id, wings (array)
- Each wing: id, events (array of {id, type})
- Event types: Checkpoint, Boss

Raids: forsaken_thicket, bastion_of_the_penitent, hall_of_chains, mythwright_gambit, the_key_of_ahdashim

## 6. /v2/currencies
**No authentication required**

- id, name, description, icon, order

## 7. /v2/colors
**No authentication required**

Dye colors:
- id, name, base_rgb, item, categories
- cloth, leather, metal, fur: Material-specific HSL and RGB values

Categories:
- Hue: Gray, Brown, Red, Orange, Yellow, Green, Blue, Purple
- Material: Vibrant, Leather, Metal
- Rarity: Starter, Common, Uncommon, Rare, Exclusive

Known issue: Most skins have unreliable color IDs.

## 8. /v2/titles
**No authentication required**

- id, name, achievement (deprecated), achievements, ap_required (optional)

## 9. Other World Endpoints
- /v2/files - Asset references
- /v2/quaggans - Quaggan images
- /v2/races - Playable races
- /v2/dailycrafting - Daily time-gated recipes
- /v2/mapchests - Map chest locations
- /v2/worldbosses - World boss definitions
- /v2/build - Current game build number
