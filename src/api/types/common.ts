/**
 * Common types and enums used across the GW2 API
 * @module api/types/common
 */

/**
 * Item rarity levels from lowest to highest quality
 */
export enum Rarity {
  Junk = 'Junk',
  Basic = 'Basic',
  Fine = 'Fine',
  Masterwork = 'Masterwork',
  Rare = 'Rare',
  Exotic = 'Exotic',
  Ascended = 'Ascended',
  Legendary = 'Legendary',
}

/**
 * Playable professions (classes) in Guild Wars 2
 */
export enum Profession {
  Guardian = 'Guardian',
  Warrior = 'Warrior',
  Engineer = 'Engineer',
  Ranger = 'Ranger',
  Thief = 'Thief',
  Elementalist = 'Elementalist',
  Mesmer = 'Mesmer',
  Necromancer = 'Necromancer',
  Revenant = 'Revenant',
}

/**
 * Playable races in Guild Wars 2
 */
export enum Race {
  Asura = 'Asura',
  Charr = 'Charr',
  Human = 'Human',
  Norn = 'Norn',
  Sylvari = 'Sylvari',
}

/**
 * Game modes where items or content can be used
 */
export enum GameType {
  Activity = 'Activity',
  Dungeon = 'Dungeon',
  Pve = 'Pve',
  Pvp = 'Pvp',
  PvpLobby = 'PvpLobby',
  Wvw = 'Wvw',
}

/**
 * Item type categories
 */
export enum ItemType {
  Armor = 'Armor',
  Back = 'Back',
  Bag = 'Bag',
  Consumable = 'Consumable',
  Container = 'Container',
  CraftingMaterial = 'CraftingMaterial',
  Gathering = 'Gathering',
  Gizmo = 'Gizmo',
  JadeTechModule = 'JadeTechModule',
  Key = 'Key',
  MiniPet = 'MiniPet',
  PowerCore = 'PowerCore',
  Relic = 'Relic',
  Tool = 'Tool',
  Trait = 'Trait',
  Trinket = 'Trinket',
  Trophy = 'Trophy',
  UpgradeComponent = 'UpgradeComponent',
  Weapon = 'Weapon',
}

/**
 * Item binding types
 */
export type Binding = 'Account' | 'Character';

/**
 * Item flags that describe special properties
 */
export type ItemFlag =
  | 'AccountBound'
  | 'AccountBindOnUse'
  | 'Attuned'
  | 'BulkConsume'
  | 'DeleteWarning'
  | 'HideSuffix'
  | 'Infused'
  | 'MonsterOnly'
  | 'NoMysticForge'
  | 'NoSalvage'
  | 'NoSell'
  | 'NotUpgradeable'
  | 'NoUnderwater'
  | 'SoulbindOnAcquire'
  | 'SoulBindOnUse'
  | 'Tonic'
  | 'Unique';

/**
 * Character attributes
 */
export type AttributeType =
  | 'Power'
  | 'Precision'
  | 'Toughness'
  | 'Vitality'
  | 'ConditionDamage'
  | 'ConditionDuration'
  | 'Healing'
  | 'BoonDuration'
  | 'CritDamage'
  | 'AgonyResistance';

/**
 * Armor weight classes
 */
export type WeightClass = 'Clothing' | 'Light' | 'Medium' | 'Heavy';

/**
 * Armor slot types
 */
export type ArmorType = 'Boots' | 'Coat' | 'Gloves' | 'Helm' | 'HelmAquatic' | 'Leggings' | 'Shoulders';

/**
 * Weapon types
 */
export type WeaponType =
  | 'Axe'
  | 'Dagger'
  | 'Mace'
  | 'Pistol'
  | 'Scepter'
  | 'Sword'
  | 'Focus'
  | 'Shield'
  | 'Torch'
  | 'Warhorn'
  | 'Greatsword'
  | 'Hammer'
  | 'LongBow'
  | 'Rifle'
  | 'ShortBow'
  | 'Staff'
  | 'Harpoon'
  | 'Speargun'
  | 'Trident'
  | 'LargeBundle'
  | 'SmallBundle'
  | 'Toy'
  | 'ToyTwoHanded';

/**
 * Damage types for weapons and skills
 */
export type DamageType = 'Fire' | 'Ice' | 'Lightning' | 'Physical' | 'Choking';

/**
 * Trinket slot types
 */
export type TrinketType = 'Accessory' | 'Amulet' | 'Ring';

/**
 * Infusion slot flags
 */
export type InfusionFlag = 'Enrichment' | 'Infusion';

/**
 * Infusion upgrade flags for upgrade components
 */
export type InfusionUpgradeFlag = 'Enrichment' | 'Infusion' | 'Defense' | 'Offense' | 'Utility' | 'Agony';

/**
 * Upgrade component types
 */
export type UpgradeType = 'Default' | 'Gem' | 'Rune' | 'Sigil';

/**
 * Equipment slots where upgrade components can be applied
 */
export type UpgradeFlag =
  | 'Axe'
  | 'Dagger'
  | 'Focus'
  | 'Greatsword'
  | 'Hammer'
  | 'Harpoon'
  | 'LongBow'
  | 'Mace'
  | 'Pistol'
  | 'Rifle'
  | 'Scepter'
  | 'Shield'
  | 'ShortBow'
  | 'Speargun'
  | 'Staff'
  | 'Sword'
  | 'Torch'
  | 'Trident'
  | 'Warhorn'
  | 'HeavyArmor'
  | 'MediumArmor'
  | 'LightArmor'
  | 'Trinket';

/**
 * Attribute bonus provided by equipment
 */
export interface AttributeBonus {
  /** Attribute name */
  attribute: AttributeType;
  /** Bonus value */
  modifier: number;
}

/**
 * Buff effect from equipment or skills
 */
export interface Buff {
  /** Skill ID for the buff */
  skill_id: number;
  /** Buff description */
  description?: string;
}

/**
 * Infix upgrade for equipment stats
 */
export interface InfixUpgrade {
  /** Itemstat ID (resolvable via /v2/itemstats) */
  id: number;
  /** Stat bonuses */
  attributes: AttributeBonus[];
  /** Additional buff effect */
  buff?: Buff;
}

/**
 * Infusion slot on equipment
 */
export interface InfusionSlot {
  /** Slot type flags */
  flags: InfusionFlag[];
  /** ID of installed infusion (if any) */
  item_id?: number;
}

/**
 * Upgrade path for items (e.g., infusion, attunement)
 */
export interface UpgradePath {
  /** Upgrade type */
  upgrade: 'Infusion' | 'Attunement';
  /** Resulting item ID */
  item_id: number;
}

/**
 * Supported API languages
 */
export type Language = 'en' | 'es' | 'de' | 'fr' | 'zh';

/**
 * Account access levels (expansions)
 */
export type AccountAccess =
  | 'None'
  | 'PlayForFree'
  | 'GuildWars2'
  | 'HeartOfThorns'
  | 'PathOfFire'
  | 'EndOfDragons'
  | 'SecretsOfTheObscure'
  | 'JanthirWilds';

/**
 * Equipment slot names
 */
export type EquipmentSlot =
  | 'HelmAquatic'
  | 'Backpack'
  | 'Coat'
  | 'Boots'
  | 'Gloves'
  | 'Helm'
  | 'Leggings'
  | 'Shoulders'
  | 'Accessory1'
  | 'Accessory2'
  | 'Ring1'
  | 'Ring2'
  | 'Amulet'
  | 'WeaponAquaticA'
  | 'WeaponAquaticB'
  | 'WeaponA1'
  | 'WeaponA2'
  | 'WeaponB1'
  | 'WeaponB2'
  | 'Sickle'
  | 'Axe'
  | 'Pick'
  | 'FishingRod'
  | 'PowerCore'
  | 'SensoryArray'
  | 'ServiceChip'
  | 'Relic';

/**
 * Crafting disciplines
 */
export type CraftingDiscipline =
  | 'Armorsmith'
  | 'Artificer'
  | 'Chef'
  | 'Huntsman'
  | 'Jeweler'
  | 'Leatherworker'
  | 'Scribe'
  | 'Tailor'
  | 'Weaponsmith';

/**
 * Gender options
 */
export type Gender = 'Male' | 'Female';
