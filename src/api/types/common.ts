/**
 * Common types and enums used across the GW2 API
 * @module api/types/common
 */

/**
 * Item rarity levels from lowest to highest quality
 */
export type Rarity = 'Junk' | 'Basic' | 'Fine' | 'Masterwork' | 'Rare' | 'Exotic' | 'Ascended' | 'Legendary';

/**
 * Playable professions (classes) in Guild Wars 2
 */
export type Profession = 'Guardian' | 'Warrior' | 'Engineer' | 'Ranger' | 'Thief' | 'Elementalist' | 'Mesmer' | 'Necromancer' | 'Revenant';

/**
 * Playable races in Guild Wars 2
 */
export type Race = 'Asura' | 'Charr' | 'Human' | 'Norn' | 'Sylvari';

/**
 * Game modes where items or content can be used
 */
export type GameType = 'Activity' | 'Dungeon' | 'Pve' | 'Pvp' | 'PvpLobby' | 'Wvw';

/**
 * Item type categories
 */
export type ItemType = 'Armor' | 'Back' | 'Bag' | 'Consumable' | 'Container' | 'CraftingMaterial' | 'Gathering' | 'Gizmo' | 'JadeTechModule' | 'Key' | 'MiniPet' | 'PowerCore' | 'Relic' | 'Tool' | 'Trait' | 'Trinket' | 'Trophy' | 'UpgradeComponent' | 'Weapon';

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
