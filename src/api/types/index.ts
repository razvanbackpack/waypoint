// GW2 API Type Definitions

// Re-export common types, enums, and utilities
export * from './common';
export * from './commerce';
export * from './crafting';
export * from './skills';

// Import types used in this file's interfaces
import type {
  AccountAccess,
  Race,
  Gender,
  Profession,
  CraftingDiscipline,
  EquipmentSlot,
  Binding,
  ItemType,
  Rarity,
  ItemFlag,
  GameType,
  UpgradePath,
  WeightClass,
  DamageType,
  InfusionSlot,
  InfixUpgrade,
  UpgradeFlag,
  InfusionUpgradeFlag,
  Language,
} from './common';

import type {
  CommercePrice,
  CommerceListing,
} from './commerce';

/**
 * API error response
 */
export interface ApiError {
  text: string;
  code?: number;
}

/**
 * Account information
 */
export interface Account {
  /** Unique account GUID */
  id: string;
  /** Account display name (Name.1234) */
  name: string;
  /** Account age in seconds */
  age: number;
  /** Home world ID (references /v2/worlds) */
  world: number;
  /** Array of guild GUIDs */
  guilds: string[];
  /** Array of guild GUIDs where account is leader */
  guild_leader: string[];
  /** Account creation timestamp (ISO 8601) */
  created: string;
  /** Account access levels (expansions) */
  access: AccountAccess[];
  /** Whether commander tag is unlocked */
  commander: boolean;
  /** Personal fractal level (0-100) */
  fractal_level: number;
  /** Daily achievement points earned all-time */
  daily_ap: number;
  /** Monthly achievement points earned all-time */
  monthly_ap: number;
  /** World vs World rank */
  wvw_rank: number;
  /** Last modification timestamp (ISO 8601) */
  last_modified: string;
  /** Number of build storage slots unlocked */
  build_storage_slots?: number;
}

/**
 * Character information
 */
export interface Character {
  /** Character name */
  name: string;
  /** Character race */
  race: Race | string;
  /** Character gender */
  gender: Gender | string;
  /** Character profession */
  profession: Profession | string;
  /** Character level (1-80) */
  level: number;
  /** Represented guild ID */
  guild?: string;
  /** Character age in seconds */
  age: number;
  /** Character creation timestamp (ISO 8601) */
  created: string;
  /** Total deaths */
  deaths: number;
  /** Active title ID */
  title?: number;
  /** Backstory answer IDs */
  backstory?: string[];
  /** Crafting disciplines */
  crafting?: CharacterCrafting[];
  /** Equipped items */
  equipment?: CharacterEquipment[];
  /** Inventory bags */
  bags?: CharacterBag[];
}

/**
 * Character crafting discipline
 */
export interface CharacterCrafting {
  /** Crafting discipline */
  discipline: CraftingDiscipline | string;
  /** Crafting rating (0-500) */
  rating: number;
  /** Whether this discipline is currently active */
  active: boolean;
}

/**
 * Character equipment item
 */
export interface CharacterEquipment {
  /** Item ID */
  id: number;
  /** Equipment slot */
  slot: EquipmentSlot | string;
  /** Applied skin ID */
  skin?: number;
  /** Applied dye IDs */
  dyes?: number[];
  /** Upgrade component IDs */
  upgrades?: number[];
  /** Infusion IDs */
  infusions?: number[];
  /** Remaining charges (gathering tools, salvage kits) */
  charges?: number;
  /** Item binding type */
  binding?: Binding | string;
  /** Character name item is bound to */
  bound_to?: string;
  /** Item stats */
  stats?: {
    /** Stat combination ID */
    id: number;
    /** Attribute values */
    attributes: Record<string, number>;
  };
}

/**
 * Character inventory bag
 */
export interface CharacterBag {
  /** Bag item ID */
  id: number;
  /** Bag size (number of slots) */
  size: number;
  /** Inventory items (null for empty slots) */
  inventory: (InventoryItem | null)[];
}

/**
 * Character build template specialization
 */
export interface BuildSpecialization {
  /** Specialization ID */
  id: number;
  /** Selected trait IDs (3 traits) */
  traits: number[];
}

/**
 * Character build skills
 */
export interface BuildSkills {
  /** Heal skill ID */
  heal: number;
  /** Utility skill IDs (up to 3) */
  utilities: number[];
  /** Elite skill ID */
  elite: number;
}

/**
 * Character build template
 */
export interface Build {
  /** Build name (optional) */
  name?: string;
  /** Profession (optional) */
  profession?: string;
  /** Selected specializations (3 specs) */
  specializations: BuildSpecialization[];
  /** Equipped skills */
  skills: BuildSkills;
  /** Equipped aquatic skills */
  aquatic_skills?: BuildSkills;
}

/**
 * Character build tab
 */
export interface BuildTab {
  /** Tab number (1-indexed) */
  tab: number;
  /** Whether this tab is currently active */
  is_active: boolean;
  /** Build configuration */
  build: Build;
}

/**
 * Equipment template item
 */
export interface EquipmentTemplateItem {
  /** Item ID */
  id: number;
  /** Equipment slot */
  slot: EquipmentSlot | string;
  /** Applied skin ID */
  skin?: number;
  /** Applied dye IDs */
  dyes?: number[];
  /** Upgrade component IDs */
  upgrades?: number[];
  /** Infusion IDs */
  infusions?: number[];
  /** Item binding type */
  binding?: Binding | string;
  /** Number of charges (for gathering tools, etc) */
  charges?: number;
  /** Item stats */
  stats?: {
    /** Stat combination ID */
    id: number;
    /** Attribute values */
    attributes?: Record<string, number>;
  };
}

/**
 * Character equipment tab
 */
export interface EquipmentTab {
  /** Tab number (1-indexed) */
  tab: number;
  /** Equipment template name */
  name: string;
  /** Whether this tab is currently active */
  is_active: boolean;
  /** Equipped items */
  equipment: EquipmentTemplateItem[];
  /** Equipment PvP configuration (for PvP builds) */
  equipment_pvp?: {
    /** Amulet ID */
    amulet?: number;
    /** Rune ID */
    rune?: number;
    /** Sigil IDs */
    sigils?: number[];
  };
}

/**
 * Inventory item stack
 */
export interface InventoryItem {
  /** Item ID */
  id: number;
  /** Stack count */
  count: number;
  /** Remaining charges */
  charges?: number;
  /** Applied skin ID */
  skin?: number;
  /** Upgrade component IDs */
  upgrades?: number[];
  /** Infusion IDs */
  infusions?: number[];
  /** Item binding type */
  binding?: Binding | string;
  /** Character name item is bound to */
  bound_to?: string;
  /** Item stats */
  stats?: {
    /** Stat combination ID */
    id: number;
    /** Attribute values */
    attributes: Record<string, number>;
  };
}

/**
 * Bank slot item
 */
export interface BankSlot {
  /** Item ID */
  id: number;
  /** Stack count */
  count: number;
  /** Remaining charges */
  charges?: number;
  /** Applied skin ID */
  skin?: number;
  /** Upgrade component IDs */
  upgrades?: number[];
  /** Infusion IDs */
  infusions?: number[];
  /** Item binding type */
  binding?: Binding | string;
  /** Character name item is bound to */
  bound_to?: string;
}

/**
 * Material storage item
 */
export interface MaterialStorage {
  /** Material item ID */
  id: number;
  /** Material category ID */
  category: number;
  /** Stack count */
  count: number;
  /** Item binding type */
  binding?: Binding | string;
}

/**
 * Wallet currency entry
 */
export interface WalletCurrency {
  /** Currency ID */
  id: number;
  /** Current amount */
  value: number;
}

/**
 * Item information
 */
export interface Item {
  /** Item ID */
  id: number;
  /** In-game chat link code */
  chat_link: string;
  /** Localized item name */
  name: string;
  /** Full URL to item icon image */
  icon?: string;
  /** Item description text */
  description?: string;
  /** Item category */
  type: ItemType | string;
  /** Quality tier */
  rarity: Rarity | string;
  /** Required character level to use */
  level: number;
  /** Sell value to vendors in copper coins */
  vendor_value: number;
  /** Default skin ID */
  default_skin?: number;
  /** Special properties */
  flags: ItemFlag[] | string[];
  /** Game modes where usable */
  game_types: GameType[] | string[];
  /** Class/race restrictions */
  restrictions: string[];
  /** Upgrade paths */
  upgrades_into?: UpgradePath[];
  /** Source items */
  upgrades_from?: UpgradePath[];
  /** Type-specific properties */
  details?: ItemDetails;
}

/**
 * Item type-specific details
 */
export interface ItemDetails {
  /** Detail type (armor slot, weapon type, etc.) */
  type?: string;
  /** Armor weight class */
  weight_class?: WeightClass | string;
  /** Damage type (for weapons) */
  damage_type?: DamageType | string;
  /** Minimum weapon strength */
  min_power?: number;
  /** Maximum weapon strength */
  max_power?: number;
  /** Defense value */
  defense?: number;
  /** Infusion slots */
  infusion_slots?: InfusionSlot[];
  /** Stat scaling multiplier */
  attribute_adjustment?: number;
  /** Stat bonuses */
  infix_upgrade?: InfixUpgrade;
  /** Upgrade component ID */
  suffix_item_id?: number;
  /** Second upgrade component ID */
  secondary_suffix_item_id?: number;
  /** Available stat IDs (selectable stats) */
  stat_choices?: number[];
  /** Bag size (number of slots) */
  size?: number;
  /** True for invisible bags */
  no_sell_or_sort?: boolean;
  /** Consumable type */
  consumable_type?: string;
  /** Effect description */
  effect_description?: string;
  /** Effect duration in milliseconds */
  duration_ms?: number;
  /** Unlock type */
  unlock_type?: string;
  /** Dye color ID */
  color_id?: number;
  /** Recipe ID */
  recipe_id?: number;
  /** Additional recipes */
  extra_recipe_ids?: number[];
  /** Guild upgrade ID */
  guild_upgrade_id?: number;
  /** Number of stacks applied */
  apply_count?: number;
  /** Effect name */
  effect_name?: string;
  /** Effect icon URL */
  effect_icon?: string;
  /** Unlocked skin IDs */
  skins?: number[];
  /** Charges remaining */
  charges?: number;
  /** Miniature ID */
  minipet_id?: number;
  /** Upgrade component flags */
  upgrade_flags?: UpgradeFlag[] | string[];
  /** Infusion upgrade flags */
  infusion_upgrade_flags?: InfusionUpgradeFlag[] | string[];
  /** Suffix text */
  suffix?: string;
  /** Text descriptions of bonuses */
  bonuses?: string[];
  /** Vendor NPC IDs */
  vendor_ids?: number[];
  // Additional item type specific fields
  [key: string]: unknown;
}

/**
 * Item stat combination (e.g., "Berserker's", "Assassin's")
 */
export interface ItemStat {
  id: number;
  name: string;
  attributes: {
    attribute: string;
    multiplier: number;
    value: number;
  }[];
}

/**
 * @deprecated Use CommercePrice from './commerce' instead
 * Aggregated Trading Post prices (kept for backwards compatibility)
 */
export interface TradingPostPrice extends CommercePrice {}

/**
 * @deprecated Use CommerceListing from './commerce' instead
 * Trading Post listings (kept for backwards compatibility)
 */
export interface TradingPostListing extends CommerceListing {}

/**
 * Achievement tier information
 */
export interface AchievementTier {
  /** Number of completions needed for this tier */
  count: number;
  /** Achievement points awarded */
  points: number;
}

/**
 * Achievement reward
 */
export interface AchievementReward {
  /** Reward type */
  type: string;
  /** Reward item/mastery/title ID */
  id?: number;
  /** Reward count */
  count?: number;
  /** Region for reward */
  region?: string;
}

/**
 * Achievement bit (objective)
 */
export interface AchievementBit {
  /** Bit type */
  type: string;
  /** Related entity ID */
  id?: number;
  /** Objective text */
  text?: string;
}

/**
 * Achievement definition
 */
export interface Achievement {
  /** Achievement ID */
  id: number;
  /** Achievement icon URL */
  icon?: string;
  /** Achievement name */
  name: string;
  /** Achievement description */
  description: string;
  /** Requirement text */
  requirement: string;
  /** Text shown when locked */
  locked_text: string;
  /** Achievement type */
  type: string;
  /** Achievement flags */
  flags: string[];
  /** Achievement tiers */
  tiers: AchievementTier[];
  /** Required achievement IDs */
  prerequisites?: number[];
  /** Rewards granted */
  rewards?: AchievementReward[];
  /** Achievement objectives */
  bits?: AchievementBit[];
  /** Maximum repeatable points */
  point_cap?: number;
}

/**
 * Daily achievement entry
 */
export interface DailyAchievementEntry {
  /** Achievement ID */
  id: number;
  /** Level requirement */
  level: {
    /** Minimum level */
    min: number;
    /** Maximum level */
    max: number;
  };
  /** Required expansions */
  required_access?: AccountAccess[] | string[];
}

/**
 * Daily achievements
 */
export interface DailyAchievements {
  /** PvE daily achievements */
  pve: DailyAchievementEntry[];
  /** PvP daily achievements */
  pvp: DailyAchievementEntry[];
  /** WvW daily achievements */
  wvw: DailyAchievementEntry[];
  /** Fractal daily achievements */
  fractals: DailyAchievementEntry[];
  /** Special event daily achievements */
  special: DailyAchievementEntry[];
}

/**
 * Account achievement progress
 */
export interface AccountAchievement {
  /** Achievement ID */
  id: number;
  /** Current progress */
  current?: number;
  /** Maximum progress needed */
  max?: number;
  /** Whether achievement is completed */
  done: boolean;
  /** Number of times completed (repeatable achievements) */
  repeated?: number;
  /** Completed bits (objectives) */
  bits?: number[];
}

/**
 * Mastery region
 */
export type MasteryRegion =
  | 'Tyria'
  | 'Maguuma'
  | 'Desert'
  | 'Tundra'
  | 'Jade'
  | 'Sky'
  | 'Lowland';

/**
 * Mastery point total by region
 */
export interface MasteryPointTotal {
  /** Mastery region */
  region: MasteryRegion;
  /** Points spent */
  spent: number;
  /** Points earned */
  earned: number;
}

/**
 * Account mastery points
 */
export interface MasteryPoints {
  /** Total points earned per region */
  totals: MasteryPointTotal[];
  /** IDs of unlocked mastery points */
  unlocked: number[];
}

/**
 * Wizard's Vault objective claim state
 */
export interface WizardsVaultObjectiveClaim {
  /** Objective ID */
  id: number;
  /** Claim state */
  claimed: boolean;
}

/**
 * Wizard's Vault objective
 */
export interface WizardsVaultObjective {
  /** Objective ID */
  id: number;
  /** Objective title */
  title: string;
  /** Objective track */
  track: string;
  /** Acclaim reward amount */
  acclaim: number;
  /** Progress current value */
  progress_current: number;
  /** Progress complete value */
  progress_complete: number;
  /** Claimed state */
  claimed?: boolean;
}

/**
 * Wizard's Vault meta progress
 */
export interface WizardsVaultMetaProgress {
  /** Meta progression reward ID */
  id: number;
  /** Progress current value */
  progress_current: number;
  /** Progress complete value */
  progress_complete: number;
  /** Whether this meta reward is claimed */
  claimed: boolean;
}

/**
 * Wizard's Vault listings response
 */
export interface WizardsVaultListings {
  /** Array of objective IDs */
  objectives: number[];
  /** Meta progression rewards */
  meta_progress_current: number;
  /** Meta progression complete */
  meta_progress_complete: number;
  /** Meta reward IDs */
  meta_reward_item_id?: number;
  /** Meta reward quantity */
  meta_reward_astral?: number;
  /** Meta reward claimed */
  meta_reward_claimed?: boolean;
}

/**
 * Wizard's Vault daily response
 */
export interface WizardsVaultDaily {
  /** Meta progression */
  meta_progress_current: number;
  /** Meta progression complete value */
  meta_progress_complete: number;
  /** Meta reward item ID */
  meta_reward_item_id?: number;
  /** Meta reward astral acclaim */
  meta_reward_astral?: number;
  /** Meta reward claimed state */
  meta_reward_claimed: boolean;
  /** Array of objectives */
  objectives: WizardsVaultObjective[];
}

/**
 * Wizard's Vault weekly response
 */
export interface WizardsVaultWeekly {
  /** Meta progression */
  meta_progress_current: number;
  /** Meta progression complete value */
  meta_progress_complete: number;
  /** Meta reward item ID */
  meta_reward_item_id?: number;
  /** Meta reward astral acclaim */
  meta_reward_astral?: number;
  /** Meta reward claimed state */
  meta_reward_claimed: boolean;
  /** Array of objectives */
  objectives: WizardsVaultObjective[];
}

/**
 * Wizard's Vault special response
 */
export interface WizardsVaultSpecial {
  /** Array of objectives */
  objectives: WizardsVaultObjective[];
}

/**
 * API client configuration
 */
export interface ApiClientConfig {
  /** Base URL for API requests (default: https://api.guildwars2.com/v2) */
  baseUrl?: string;
  /** API key for authenticated requests */
  apiKey?: string;
  /** Language for localized responses */
  language?: Language;
}
