# Items, Skins & Recipes

**Last Updated:** 2025-12-24
**Source:** [GW2 Wiki - Items](https://wiki.guildwars2.com/wiki/API:2/items) | [Skins](https://wiki.guildwars2.com/wiki/API:2/skins) | [Recipes](https://wiki.guildwars2.com/wiki/API:2/recipes)

## 1. /v2/items
**No authentication required**

Core fields:
| Field | Type | Description |
|-------|------|-------------|
| id | number | Item ID |
| chat_link | string | In-game chat link |
| name | string | Item name |
| icon | string | Icon URL (optional) |
| description | string | Item description (optional) |
| type | string | Item type |
| rarity | string | Junk, Basic, Fine, Masterwork, Rare, Exotic, Ascended, Legendary |
| level | number | Required level |
| vendor_value | number | Vendor price in copper |
| default_skin | number | Default skin ID (optional) |
| flags | array | Item flags |
| game_types | array | Activity, Dungeon, Pve, Pvp, PvpLobby, Wvw |
| restrictions | array | Race/profession restrictions |
| details | object | Type-specific fields |

### Item Types
Armor, Back, Bag, Consumable, Container, CraftingMaterial, Gathering, Gizmo, Key, MiniPet, PowerCore, Relic, Tool, Trait, Trinket, Trophy, UpgradeComponent, Weapon, JadeTechModule

### Flags
AccountBindOnUse, AccountBound, Attuned, BulkConsume, DeleteWarning, HideSuffix, Infused, MonsterOnly, NoMysticForge, NoSalvage, NoSell, NotUpgradeable, NoUnderwater, SoulbindOnAcquire, SoulBindOnUse, Tonic, Unique

### Armor Details
- type: Boots, Coat, Gloves, Helm, HelmAquatic, Leggings, Shoulders
- weight_class: Heavy, Medium, Light, Clothing
- defense, infusion_slots, attribute_adjustment
- infix_upgrade, suffix_item_id, secondary_suffix_item_id, stat_choices

### Weapon Details
- type: Axe, Dagger, Focus, Greatsword, Hammer, Harpoon, LongBow, Mace, Pistol, Rifle, Scepter, Shield, ShortBow, Speargun, Staff, Sword, Torch, Trident, Warhorn
- damage_type: Fire, Ice, Lightning, Physical, Choking
- min_power, max_power, defense
- infusion_slots, attribute_adjustment, infix_upgrade, suffix_item_id

### Trinket Details
- type: Accessory, Amulet, Ring

### Consumable Details
- type: AppearanceChange, Booze, ContractNpc, Currency, Food, Generic, Halloween, Immediate, MountRandomUnlock, RandomUnlock, Transmutation, Unlock, UpgradeRemoval, Utility, TeleportToFriend
- duration_ms, unlock_type, apply_count

### Upgrade Component Details
- type: Default, Gem, Rune, Sigil
- flags (compatible item types), suffix, infix_upgrade, bonuses

### Infix Upgrade Object
- id: ItemStat ID
- attributes: Array of {attribute, modifier}
- Attributes: AgonyResistance, BoonDuration, ConditionDamage, ConditionDuration, CritDamage, Healing, Power, Precision, Toughness, Vitality

## 2. /v2/skins
**No authentication required**

Fields: id, name, type, flags, restrictions, icon, rarity, description, details

Types: Armor, Weapon, Back, Gathering

Armor details: type, weight_class, dye_slots
Weapon details: type, damage_type
Gathering details: type (Foraging, Logging, Mining)

Known issues:
- Dye color IDs are unreliable
- Back items don't report dye info

## 3. /v2/recipes
**No authentication required**

Fields:
- id, type, output_item_id, output_item_count
- time_to_craft_ms
- disciplines: Artificer, Armorsmith, Chef, Homesteader, Huntsman, Jeweler, Leatherworker, Scribe, Tailor, Weaponsmith
- min_rating (0-500)
- flags: AutoLearned, LearnedFromItem
- ingredients: Array of {type, id, count} - type can be Item, Currency, GuildUpgrade
- guild_ingredients (optional)
- chat_link

### /v2/recipes/search
Search by input or output:
- ?input=ITEM_ID
- ?output=ITEM_ID

## 4. Related Endpoints
- /v2/itemstats - Stat combinations
- /v2/materials - Material categories
