# Game Mechanics

**Last Updated:** 2025-12-24
**Source:** [GW2 Wiki - Skills](https://wiki.guildwars2.com/wiki/API:2/skills) | [Traits](https://wiki.guildwars2.com/wiki/API:2/traits) | [Professions](https://wiki.guildwars2.com/wiki/API:2/professions) | [Specializations](https://wiki.guildwars2.com/wiki/API:2/specializations)

## 1. /v2/professions
**No authentication required**

Core fields:
| Field | Type | Description |
|-------|------|-------------|
| id | string | Profession identifier |
| name | string | Display name |
| code | number | Profession code |
| icon | string | Icon URL |
| icon_big | string | Large icon URL |
| specializations | array | List of specialization IDs |
| flags | array | Profession flags |
| training | array | Skill/trait unlock progression |
| weapons | object | Available weapons per game mode |

### Professions
- **Guardian** - Heavy armor, support and defense
- **Warrior** - Heavy armor, physical damage and sustain
- **Engineer** - Medium armor, technology and kits
- **Ranger** - Medium armor, nature and pets
- **Thief** - Medium armor, stealth and mobility
- **Elementalist** - Light armor, elemental magic
- **Mesmer** - Light armor, illusions and manipulation
- **Necromancer** - Light armor, death magic and minions
- **Revenant** - Heavy armor, channel legendary powers

### Weapons Object
```json
{
  "Pve": {
    "Greatsword": {
      "flags": ["Mainhand", "TwoHand"],
      "skills": [
        {"id": 9137, "slot": "Weapon_1"},
        {"id": 9081, "slot": "Weapon_2"},
        {"id": 9080, "slot": "Weapon_3"},
        {"id": 9146, "slot": "Weapon_4"},
        {"id": 9147, "slot": "Weapon_5"}
      ],
      "specialization": null
    }
  },
  "Pvp": {...},
  "Wvw": {...},
  "Underwater": {...}
}
```

### Training Array
Each training track:
- id, category, name, order, track
- track: Array of {cost, type, skill_id/trait_id}
- Categories: Skills, Specializations, EliteSpecializations

### Example Response
```json
{
  "id": "Guardian",
  "name": "Guardian",
  "code": 1,
  "icon": "https://render.guildwars2.com/file/...",
  "icon_big": "https://render.guildwars2.com/file/...",
  "specializations": [13, 16, 27, 42, 46, 65],
  "flags": [],
  "weapons": {
    "Pve": {
      "Greatsword": {...},
      "Hammer": {...},
      "Mace": {...},
      "Scepter": {...},
      "Staff": {...},
      "Sword": {...},
      "Focus": {...},
      "Shield": {...},
      "Torch": {...}
    }
  },
  "training": [
    {
      "id": 111,
      "category": "Skills",
      "name": "Guardian Training",
      "track": [
        {"cost": 2, "type": "Skill", "skill_id": 9082},
        {"cost": 4, "type": "Skill", "skill_id": 9083}
      ]
    }
  ]
}
```

## 2. /v2/specializations
**No authentication required**

Core fields:
| Field | Type | Description |
|-------|------|-------------|
| id | number | Specialization ID |
| name | string | Display name |
| profession | string | Profession identifier |
| elite | boolean | Is elite specialization |
| icon | string | Icon URL |
| profession_icon | string | Large profession icon URL |
| background | string | Background image URL |
| minor_traits | array | 3 minor trait IDs (auto-unlocked) |
| major_traits | array | 9 major trait IDs (3 per tier) |
| weapon_trait | number | Weapon unlock trait ID (elite specs only) |

### Core vs Elite Specializations
- **Core**: 5 per profession, not mutually exclusive
- **Elite**: 3 per profession (HoT, PoF, EoD), only one can be active

### Elite Specializations by Expansion

**Heart of Thorns (HoT)**
- Guardian → Dragonhunter (27)
- Warrior → Berserker (18)
- Engineer → Scrapper (43)
- Ranger → Druid (5)
- Thief → Daredevil (7)
- Elementalist → Tempest (48)
- Mesmer → Chronomancer (40)
- Necromancer → Reaper (34)
- Revenant → Herald (52)

**Path of Fire (PoF)**
- Guardian → Firebrand (62)
- Warrior → Spellbreaker (61)
- Engineer → Holosmith (57)
- Ranger → Soulbeast (55)
- Thief → Deadeye (58)
- Elementalist → Weaver (56)
- Mesmer → Mirage (59)
- Necromancer → Scourge (60)
- Revenant → Renegade (63)

**End of Dragons (EoD)**
- Guardian → Willbender (65)
- Warrior → Bladesworn (68)
- Engineer → Mechanist (70)
- Ranger → Untamed (72)
- Thief → Specter (71)
- Elementalist → Catalyst (67)
- Mesmer → Virtuoso (66)
- Necromancer → Harbinger (64)
- Revenant → Vindicator (69)

### Example Response
```json
{
  "id": 27,
  "name": "Dragonhunter",
  "profession": "Guardian",
  "elite": true,
  "icon": "https://render.guildwars2.com/file/...",
  "profession_icon": "https://render.guildwars2.com/file/...",
  "background": "https://render.guildwars2.com/file/...",
  "minor_traits": [1835, 1836, 1837],
  "major_traits": [1898, 1835, 1917, 1943, 1908, 1963, 1911, 1955, 1915],
  "weapon_trait": 1835
}
```

## 3. /v2/traits
**No authentication required**

Core fields:
| Field | Type | Description |
|-------|------|-------------|
| id | number | Trait ID |
| name | string | Display name |
| icon | string | Icon URL |
| description | string | Trait description |
| specialization | number | Specialization ID |
| tier | number | Trait tier (0=minor, 1-3=major tiers) |
| order | number | Position within tier (0-2) |
| slot | string | Major trait slot: Adept, Master, Grandmaster |
| facts | array | Trait effects (optional) |
| traited_facts | array | Modified effects when other traits active (optional) |

### Trait Tiers
- **Tier 0** - Minor traits (3 per spec, auto-unlocked)
- **Tier 1** - Adept (3 choices, pick 1)
- **Tier 2** - Master (3 choices, pick 1)
- **Tier 3** - Grandmaster (3 choices, pick 1)

### Fact Types

All fact types have:
- type: Fact type identifier
- text: Display text (optional)
- icon: Icon URL (optional)

**AttributeAdjust**
- value: Adjustment amount
- target: Attribute type (Power, Precision, Toughness, Vitality, BoonDuration, ConditionDamage, ConditionDuration, CritDamage, Healing, Ferocity)

**Buff**
- duration: Effect duration in seconds (optional)
- status: Condition/boon name
- description: Effect description (optional)
- apply_count: Number of stacks (optional)

**BuffConversion**
- source: Source attribute
- target: Target attribute
- percent: Conversion percentage

**ComboField**
- field_type: Dark, Ethereal, Fire, Ice, Light, Lightning, Poison, Smoke, Water

**ComboFinisher**
- finisher_type: Blast, Leap, Projectile, Whirl
- percent: Trigger chance (default 100)

**Damage**
- hit_count: Number of hits
- dmg_multiplier: Damage coefficient (optional)

**Distance**
- distance: Distance value

**Duration**
- duration: Duration in seconds

**Number**
- value: Numeric value

**Percent**
- percent: Percentage value

**Radius**
- distance: Radius value

**Range**
- value: Range value

**Recharge**
- value: Cooldown in seconds

**Time**
- duration: Time in seconds

**Unblockable**
- value: Always true

### Traited Facts
When other traits modify this trait's effects:
- Same fields as base facts
- requires_trait: Trait ID that enables this modification
- overrides: Index of fact to replace (optional)

### Example Response
```json
{
  "id": 1835,
  "name": "Big Game Hunter",
  "icon": "https://render.guildwars2.com/file/...",
  "description": "Your longbow range is increased. Damage a foe's defiant bar to gain fury.",
  "specialization": 27,
  "tier": 0,
  "order": 0,
  "slot": "Major",
  "facts": [
    {
      "text": "Fury",
      "type": "Buff",
      "duration": 5,
      "status": "Fury",
      "apply_count": 1
    },
    {
      "text": "Range Increase",
      "type": "Percent",
      "percent": 50
    }
  ],
  "traited_facts": [
    {
      "text": "Fury",
      "type": "Buff",
      "duration": 8,
      "status": "Fury",
      "requires_trait": 1898,
      "overrides": 0
    }
  ]
}
```

## 4. /v2/skills
**No authentication required**

Core fields:
| Field | Type | Description |
|-------|------|-------------|
| id | number | Skill ID |
| name | string | Display name |
| description | string | Skill description (optional) |
| icon | string | Icon URL |
| chat_link | string | In-game chat link |
| type | string | Skill type |
| weapon_type | string | Associated weapon (optional) |
| professions | array | Usable professions |
| slot | string | Skill slot type |
| facts | array | Skill effects (optional) |
| traited_facts | array | Modified effects (optional) |
| categories | array | Skill categories (optional) |
| attunement | string | Elementalist attunement (optional) |
| cost | number | Energy/resource cost (optional) |
| initiative | number | Initiative cost for Thief (optional) |
| flags | array | Skill flags |
| specialization | number | Required specialization (optional) |
| flip_skill | number | Alternate skill ID (optional) |
| next_chain | number | Next skill in chain (optional) |
| prev_chain | number | Previous skill in chain (optional) |
| transform_skills | array | Skills during transform (optional) |
| bundle_skills | array | Skills for bundle (optional) |
| toolbelt_skill | number | Engineer toolbelt skill (optional) |
| dual_wield | string | Thief dual-wield offhand (optional) |

### Skill Types
- **Bundle** - Weapon bundle skills
- **Elite** - Elite skill
- **Heal** - Healing skill
- **Profession** - Profession mechanic skill
- **Utility** - Utility skill
- **Weapon** - Weapon skill

### Weapon Types
Axe, Dagger, Focus, Greatsword, Hammer, Harpoon, LongBow, Mace, Pistol, Rifle, Scepter, Shield, ShortBow, Spear, Speargun, Staff, Sword, Torch, Trident, Warhorn, Nothing (unarmed)

### Skill Slots
- **Weapon_1** through **Weapon_5** - Weapon skills
- **Profession_1** through **Profession_5** - Profession mechanic
- **Heal** - Healing skill
- **Utility** - Utility skill slots
- **Elite** - Elite skill
- **Downed_1** through **Downed_4** - Downed state
- **Pet** - Ranger pet skills
- **Transform_1** through **Transform_5** - Transform skills

### Skill Categories
- **Burst** - Warrior burst skills
- **Clone** - Mesmer clone skills
- **Consecration** - Guardian consecrations
- **Corruption** - Necromancer corruptions
- **DualWield** - Thief dual wield
- **Glyph** - Various profession glyphs
- **KillerInstinct** - Ranger killer instinct
- **Kit** - Engineer kits
- **Legend** - Revenant legend swap
- **Mantra** - Mesmer mantras
- **Meditation** - Guardian meditations
- **PhysicalSkill** - Physical skills
- **Preparation** - Thief preparations
- **Rage** - Warrior rage skills
- **Shout** - Shout skills
- **Signet** - Signet skills
- **Spirit** - Ranger spirits
- **StealthAttack** - Thief stealth attacks
- **Survival** - Ranger survival skills
- **Trap** - Trap skills
- **Trick** - Thief tricks
- **Turret** - Engineer turrets
- **Well** - Necromancer wells

### Skill Flags
- **GroundTargeted** - Requires ground target
- **NoUnderwater** - Cannot use underwater
- **Underwater** - Only underwater

### Fact Types
Same as traits (see section 3 above): AttributeAdjust, Buff, BuffConversion, ComboField, ComboFinisher, Damage, Distance, Duration, Number, Percent, Radius, Range, Recharge, Time, Unblockable

Additional skill-specific fact:
- **PrefixedBuff** - Buff with prefix text
  - duration, status, description, apply_count
  - prefix: Prefix icon/text

### Example Response - Basic Weapon Skill
```json
{
  "id": 9137,
  "name": "Strike",
  "description": "Strike your foe.",
  "icon": "https://render.guildwars2.com/file/...",
  "chat_link": "[&BmEjAAA=]",
  "type": "Weapon",
  "weapon_type": "Greatsword",
  "professions": ["Guardian"],
  "slot": "Weapon_1",
  "facts": [
    {
      "text": "Range",
      "type": "Range",
      "value": 130
    },
    {
      "text": "Damage",
      "type": "Damage",
      "hit_count": 1,
      "dmg_multiplier": 0.8
    }
  ],
  "flags": [],
  "categories": []
}
```

### Example Response - Elite Skill
```json
{
  "id": 30273,
  "name": "Dragon's Maw",
  "description": "Trap. Set a trap that burns foes.",
  "icon": "https://render.guildwars2.com/file/...",
  "chat_link": "[&Bn92AAA=]",
  "type": "Elite",
  "professions": ["Guardian"],
  "slot": "Elite",
  "specialization": 27,
  "facts": [
    {
      "text": "Recharge",
      "type": "Recharge",
      "value": 45
    },
    {
      "text": "Damage",
      "type": "Damage",
      "hit_count": 4,
      "dmg_multiplier": 1.2
    },
    {
      "text": "Burning",
      "type": "Buff",
      "duration": 4,
      "status": "Burning",
      "apply_count": 5
    },
    {
      "text": "Number of Targets",
      "type": "Number",
      "value": 5
    },
    {
      "text": "Radius",
      "type": "Radius",
      "distance": 240
    }
  ],
  "categories": ["Trap"],
  "flags": ["GroundTargeted"]
}
```

### Example Response - Chain Skill
```json
{
  "id": 9080,
  "name": "Symbol of Resolution",
  "description": "Symbol. Smash a mystic symbol onto the ground.",
  "icon": "https://render.guildwars2.com/file/...",
  "chat_link": "[&Bm4jAAA=]",
  "type": "Weapon",
  "weapon_type": "Greatsword",
  "professions": ["Guardian"],
  "slot": "Weapon_3",
  "prev_chain": 9081,
  "next_chain": 9146,
  "facts": [
    {
      "text": "Range",
      "type": "Range",
      "value": 180
    },
    {
      "text": "Damage",
      "type": "Damage",
      "hit_count": 1,
      "dmg_multiplier": 1.0
    },
    {
      "text": "Resolution",
      "type": "Buff",
      "duration": 1,
      "status": "Resolution",
      "apply_count": 1
    },
    {
      "text": "Symbol Duration",
      "type": "Duration",
      "duration": 4
    },
    {
      "text": "Number of Impacts",
      "type": "Number",
      "value": 4
    },
    {
      "text": "Combo Field",
      "type": "ComboField",
      "field_type": "Light"
    }
  ],
  "categories": ["Symbol"],
  "flags": []
}
```

## 5. /v2/legends
**No authentication required** - Revenant only

Core fields:
| Field | Type | Description |
|-------|------|-------------|
| id | string | Legend identifier |
| code | number | Legend code |
| swap | number | Legend swap skill ID |
| heal | number | Healing skill ID |
| elite | number | Elite skill ID |
| utilities | array | 3 utility skill IDs |

### Available Legends
- **Legend1** - Legendary Dwarf Stance (Jalis)
- **Legend2** - Legendary Demon Stance (Mallyx)
- **Legend3** - Legendary Assassin Stance (Shiro)
- **Legend4** - Legendary Centaur Stance (Ventari)
- **Legend5** - Legendary Dragon Stance (Glint) - Herald elite spec
- **Legend6** - Legendary Renegade Stance (Kalla) - Renegade elite spec
- **Legend7** - Legendary Alliance Stance (Archemorus & Saint Viktor) - Vindicator elite spec

### Example Response
```json
{
  "id": "Legend1",
  "code": 0,
  "swap": 28419,
  "heal": 27372,
  "elite": 28516,
  "utilities": [26644, 27205, 27107]
}
```

## 6. /v2/pets
**No authentication required** - Ranger only

Core fields:
| Field | Type | Description |
|-------|------|-------------|
| id | number | Pet ID |
| name | string | Display name |
| description | string | Pet description |
| icon | string | Icon URL |
| skills | array | Pet skill objects |

### Pet Skills
Each skill object:
- id: Skill ID
- slot: Skill slot (Pet_1 through Pet_5)

### Pet Families
- **Amphibian** - Salamanders
- **Arthropod** - Spiders, devourers
- **Avian** - Birds, owls, ravens
- **Canine** - Wolves, dogs, jackals
- **Devourer** - Scorpions
- **Feline** - Cats, jaguars, lynx
- **Jellyfish** - Underwater only
- **Moa** - Large birds
- **Porcine** - Boars, pigs
- **Reptile** - Drakes, lizards
- **Shark** - Underwater only
- **Ursine** - Bears
- **Wyvern** - Flying drakes

### Example Response
```json
{
  "id": 1,
  "name": "Juvenile Alpine Wolf",
  "description": "Canine. Knock down your foe.",
  "icon": "https://render.guildwars2.com/file/...",
  "skills": [
    {"id": 12658, "slot": "Pet_1"},
    {"id": 12659, "slot": "Pet_2"},
    {"id": 12660, "slot": "Pet_3"},
    {"id": 12661, "slot": "Pet_4"},
    {"id": 12662, "slot": "Pet_5"}
  ]
}
```

## 7. /v2/masteries
**No authentication required**

Core fields:
| Field | Type | Description |
|-------|------|-------------|
| id | number | Mastery ID |
| name | string | Mastery track name |
| requirement | string | Required story step |
| order | number | Display order |
| background | string | Background image URL |
| region | string | Mastery region |
| levels | array | Mastery levels |

### Mastery Regions
- **Tyria** - Central Tyria masteries (gliding, legendary crafting)
- **Maguuma** - Heart of Thorns (gliding, mushrooms, exalted lore, nuhoch, itzel)
- **Desert** - Path of Fire (mounts, ancient magic)
- **Tundra** - Icebrood Saga (raven, essence manipulation)
- **Jade** - End of Dragons (jade tech, arborstone, fishing)
- **Sky** - Secrets of the Obscure (skyscale, rift hunting)
- **Wild** - Janthir Wilds (warclaw, homesteading)
- **Magic** - Cross-expansion (legendary armory, legendary runes)

### Mastery Level Object
- name: Level name
- description: Level description
- instruction: How to progress
- icon: Icon URL
- point_cost: Mastery points required
- exp_cost: Experience required

### Example Response
```json
{
  "id": 1,
  "name": "Gliding",
  "requirement": "Out of the Shadows",
  "order": 0,
  "background": "https://render.guildwars2.com/file/...",
  "region": "Maguuma",
  "levels": [
    {
      "name": "Gliding Basics",
      "description": "Learn to glide",
      "instruction": "Gain experience in Heart of Maguuma",
      "icon": "https://render.guildwars2.com/file/...",
      "point_cost": 1,
      "exp_cost": 508000
    },
    {
      "name": "Updraft Use",
      "description": "Use updrafts while gliding",
      "instruction": "Gain experience in Heart of Maguuma",
      "icon": "https://render.guildwars2.com/file/...",
      "point_cost": 1,
      "exp_cost": 1016000
    },
    {
      "name": "Ley Line Gliding",
      "description": "Use ley lines while gliding",
      "instruction": "Gain experience in Heart of Maguuma",
      "icon": "https://render.guildwars2.com/file/...",
      "point_cost": 2,
      "exp_cost": 1524000
    },
    {
      "name": "Stealth Gliding",
      "description": "Stealth while gliding",
      "instruction": "Gain experience in Heart of Maguuma",
      "icon": "https://render.guildwars2.com/file/...",
      "point_cost": 3,
      "exp_cost": 2540000
    },
    {
      "name": "Advanced Gliding",
      "description": "Lean forward for speed or backward to slow down",
      "instruction": "Gain experience in Heart of Maguuma",
      "icon": "https://render.guildwars2.com/file/...",
      "point_cost": 4,
      "exp_cost": 5080000
    }
  ]
}
```

## 8. /v2/mounts/types and /v2/mounts/skins
**No authentication required**

### /v2/mounts/types
Core fields:
| Field | Type | Description |
|-------|------|-------------|
| id | string | Mount type identifier |
| name | string | Display name |
| default_skin | number | Default skin ID |
| skins | array | Available skin IDs |
| skills | array | Mount skill objects |

### Mount Types
- **raptor** - Long jump, high mobility
- **springer** - High jump, vertical mobility
- **skimmer** - Water travel, hovering
- **jackal** - Teleport blink, sand portals
- **griffon** - Flying, diving speed boost
- **rollerbeetle** - Rolling, speed racing
- **warclaw** - WvW mount, teleport to ally
- **skyscale** - Vertical flight, wall climbing
- **turtle** - Two-player, siege mode

### Mount Skill Object
- id: Skill ID
- slot: Skill slot (e.g., "Mount_1", "Mount_2")

### Example Response - Mount Type
```json
{
  "id": "raptor",
  "name": "Raptor",
  "default_skin": 1,
  "skins": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  "skills": [
    {"id": 40588, "slot": "Mount_1"},
    {"id": 41326, "slot": "Mount_2"},
    {"id": 45075, "slot": "Mount_Dismount"}
  ]
}
```

### /v2/mounts/skins
Core fields:
| Field | Type | Description |
|-------|------|-------------|
| id | number | Skin ID |
| name | string | Display name |
| icon | string | Icon URL |
| mount | string | Mount type identifier |
| dye_slots | array | Dye channel configuration |

### Dye Slots Structure
Array of dye groups:
- color_id: Default color ID
- material: Material type (cloth, fur, metal, etc.)
- name: Dye channel name

### Example Response - Mount Skin
```json
{
  "id": 1,
  "name": "Raptor",
  "icon": "https://render.guildwars2.com/file/...",
  "mount": "raptor",
  "dye_slots": [
    {
      "color_id": 1,
      "material": "fur",
      "name": "Body"
    },
    {
      "color_id": 2,
      "material": "leather",
      "name": "Saddle"
    },
    {
      "color_id": 3,
      "material": "metal",
      "name": "Trim"
    }
  ]
}
```

## Related Endpoints
- /v2/backstory/answers - Biography answers
- /v2/backstory/questions - Biography questions
- /v2/emotes - Emote unlocks
- /v2/finishers - Finisher animations
- /v2/gliders - Glider skins
- /v2/mailcarriers - Mail carrier skins
- /v2/novelties - Novelty unlocks
- /v2/outfits - Outfit unlocks
- /v2/titles - Title unlocks

## Implementation Notes

### Build Templates
A complete build requires:
1. Profession (1 choice)
2. Specializations (3 choices: 2 core + 1 elite, or 3 core)
3. Traits (9 choices: 3 per specialization)
4. Skills (10 choices: heal, 3 utilities, elite, 5 weapon skills)
5. Equipment (14 slots with stats, upgrades, infusions)
6. Legend (Revenant only: 2 legends)
7. Pet (Ranger only: 2 pets)

### Trait Lines
- Each player can equip 3 specializations
- Each specialization has 3 minor traits (always active)
- Each specialization has 3 tiers of major traits (pick 1 per tier)
- Total: 18 traits active (9 minor + 9 major)

### Skill Bars
**Standard professions:**
- Heal (slot 6)
- Utility (slots 7, 8, 9)
- Elite (slot 0)
- Weapon skills 1-5 determined by equipped weapons

**Revenant:**
- Skills determined by active legend
- Legend swap replaces utility skills
- Weapon skills still based on equipped weapons

**Elementalist:**
- Weapon skills change per attunement
- 20 weapon skills total (5 per attunement)

### Elite Specialization Mechanics
- Unlocks new weapon type for profession
- Replaces one core specialization slot
- Cannot equip multiple elite specializations
- May modify profession mechanics significantly
