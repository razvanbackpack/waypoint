/**
 * Skills, traits, and profession types
 * @module api/types/skills
 */

/**
 * Skill type categories
 */
export type SkillType =
  | 'Bundle'
  | 'Elite'
  | 'Heal'
  | 'Monster'
  | 'Pet'
  | 'Profession'
  | 'Toolbelt'
  | 'Transform'
  | 'Utility'
  | 'Weapon';

/**
 * Skill bar slot types
 */
export type SkillSlot =
  | 'Downed_1'
  | 'Downed_2'
  | 'Downed_3'
  | 'Downed_4'
  | 'Weapon_1'
  | 'Weapon_2'
  | 'Weapon_3'
  | 'Weapon_4'
  | 'Weapon_5'
  | 'Profession_1'
  | 'Profession_2'
  | 'Profession_3'
  | 'Profession_4'
  | 'Profession_5'
  | 'Utility'
  | 'Heal'
  | 'Elite'
  | 'Pet';

/**
 * Subskill variation (attunement or form specific)
 */
export interface SubSkill {
  /** Subskill ID */
  id: number;
  /** Required attunement */
  attunement?: string;
  /** Required form (e.g., "CelestialAvatar") */
  form?: string;
}

/**
 * Base interface for all skill facts
 */
export interface SkillFactBase {
  /** Localized description */
  text?: string;
  /** Fact icon URL */
  icon?: string;
  /** Fact type discriminator */
  type: string;
}

/**
 * Attribute adjustment fact
 */
export interface AttributeAdjust extends SkillFactBase {
  type: 'AttributeAdjust';
  /** Adjustment value */
  value: number;
  /** Target attribute */
  target: string;
}

/**
 * Buff or condition fact
 */
export interface BuffFact extends SkillFactBase {
  type: 'Buff';
  /** Duration in seconds */
  duration?: number;
  /** Status effect name */
  status?: string;
  /** Effect description */
  description?: string;
  /** Number of stacks applied */
  apply_count?: number;
}

/**
 * Prefixed buff fact with prefix object
 */
export interface PrefixedBuff extends SkillFactBase {
  type: 'PrefixedBuff';
  /** Duration in seconds */
  duration?: number;
  /** Status effect name */
  status?: string;
  /** Effect description */
  description?: string;
  /** Number of stacks applied */
  apply_count?: number;
  /** Prefix information */
  prefix?: {
    text?: string;
    icon?: string;
    status?: string;
    description?: string;
  };
}

/**
 * Combo field fact
 */
export interface ComboField extends SkillFactBase {
  type: 'ComboField';
  /** Field type (e.g., 'Fire', 'Water', 'Light') */
  field_type: string;
}

/**
 * Combo finisher fact
 */
export interface ComboFinisher extends SkillFactBase {
  type: 'ComboFinisher';
  /** Finisher type (e.g., 'Blast', 'Leap', 'Projectile') */
  finisher_type: string;
  /** Proc chance percentage */
  percent: number;
}

/**
 * Damage fact
 */
export interface Damage extends SkillFactBase {
  type: 'Damage';
  /** Number of hits */
  hit_count: number;
  /** Damage multiplier */
  dmg_multiplier?: number;
}

/**
 * Distance fact
 */
export interface Distance extends SkillFactBase {
  type: 'Distance';
  /** Distance in game units */
  distance: number;
}

/**
 * Duration fact
 */
export interface Duration extends SkillFactBase {
  type: 'Duration';
  /** Duration in seconds */
  duration: number;
}

/**
 * Heal fact
 */
export interface Heal extends SkillFactBase {
  type: 'Heal';
  /** Number of healing ticks */
  hit_count: number;
}

/**
 * Healing adjustment fact
 */
export interface HealingAdjust extends SkillFactBase {
  type: 'HealingAdjust';
  /** Number of healing ticks */
  hit_count: number;
}

/**
 * No data fact (placeholder)
 */
export interface NoData extends SkillFactBase {
  type: 'NoData';
}

/**
 * Generic number fact
 */
export interface NumberFact extends SkillFactBase {
  type: 'Number';
  /** Numerical value */
  value: number;
}

/**
 * Percentage fact
 */
export interface Percent extends SkillFactBase {
  type: 'Percent';
  /** Percentage value */
  percent: number;
}

/**
 * Range fact
 */
export interface Range extends SkillFactBase {
  type: 'Range';
  /** Range in game units */
  value: number;
}

/**
 * Radius fact
 */
export interface Radius extends SkillFactBase {
  type: 'Radius';
  /** Radius in game units */
  distance: number;
}

/**
 * Recharge (cooldown) fact
 */
export interface Recharge extends SkillFactBase {
  type: 'Recharge';
  /** Cooldown in seconds */
  value: number;
}

/**
 * Stun break fact
 */
export interface StunBreak extends SkillFactBase {
  type: 'StunBreak';
  /** Whether skill breaks stun */
  value: boolean;
}

/**
 * Time fact
 */
export interface Time extends SkillFactBase {
  type: 'Time';
  /** Time in seconds */
  duration: number;
}

/**
 * Unblockable fact
 */
export interface Unblockable extends SkillFactBase {
  type: 'Unblockable';
  /** Whether skill is unblockable */
  value: boolean;
}

/**
 * Union type of all skill facts
 */
export type SkillFact =
  | AttributeAdjust
  | BuffFact
  | PrefixedBuff
  | ComboField
  | ComboFinisher
  | Damage
  | Distance
  | Duration
  | Heal
  | HealingAdjust
  | NoData
  | NumberFact
  | Percent
  | Range
  | Radius
  | Recharge
  | StunBreak
  | Time
  | Unblockable;

/**
 * Traited fact that requires a trait to be equipped
 */
export interface TraitedFact extends SkillFact {
  /** Trait ID that enables this fact */
  requires_trait: number;
  /** Fact index this replaces (0-indexed) */
  overrides?: number;
}

/**
 * Skill information
 */
export interface Skill {
  /** Skill ID */
  id: number;
  /** Localized skill name */
  name: string;
  /** Localized skill description */
  description?: string;
  /** URL to skill icon */
  icon: string;
  /** Chat link code for skill */
  chat_link: string;
  /** Skill type category */
  type?: SkillType;
  /** Associated weapon (weapon skills only) */
  weapon_type?: string;
  /** Professions that can use this skill */
  professions: string[];
  /** Skill bar slot type */
  slot?: SkillSlot;
  /** Base skill effects */
  facts?: SkillFact[];
  /** Effects modified by traits */
  traited_facts?: TraitedFact[];
  /** Skill categories */
  categories?: string[];
  /** Required attunement (Elementalist) */
  attunement?: string;
  /** Energy cost (Revenant) */
  cost?: number;
  /** Required offhand weapon */
  dual_wield?: string;
  /** Alternate skill ID (transform skills) */
  flip_skill?: number;
  /** Initiative cost (Thief) */
  initiative?: number;
  /** Next skill in chain */
  next_chain?: number;
  /** Previous skill in chain */
  prev_chain?: number;
  /** Available skills when transformed */
  transform_skills?: number[];
  /** Available skills when using bundle */
  bundle_skills?: number[];
  /** Associated toolbelt skill ID (Engineer) */
  toolbelt_skill?: number;
  /** Skill flags */
  flags?: string[];
  /** Required specialization ID */
  specialization?: number;
  /** Dual attunement (Weaver) */
  dual_attunement?: string;
  /** Alternative skill variations */
  subskills?: SubSkill[];
}

/**
 * Trait fact types
 */
export type TraitFact = SkillFact;

/**
 * Trait information
 */
export interface Trait {
  /** Trait ID */
  id: number;
  /** Trait name */
  name: string;
  /** Trait description */
  description?: string;
  /** Trait icon URL */
  icon: string;
  /** Specialization ID */
  specialization: number;
  /** Trait tier (0-2 for Minor, Adept, Master, Grandmaster) */
  tier: number;
  /** Trait order within tier */
  order: number;
  /** Trait slot (0-2) */
  slot: string;
  /** Trait facts */
  facts?: TraitFact[];
  /** Traited facts that modify skills */
  traited_facts?: TraitedFact[];
  /** Related skills */
  skills?: Array<{
    id: number;
    name: string;
    description?: string;
    icon: string;
    chat_link: string;
  }>;
}

/**
 * Specialization type
 */
export type SpecializationType = 'Core' | 'Elite';

/**
 * Specialization information
 */
export interface Specialization {
  /** Specialization ID */
  id: number;
  /** Specialization name */
  name: string;
  /** Profession this specialization belongs to */
  profession: string;
  /** Whether this is an elite specialization */
  elite: boolean;
  /** Specialization icon URL */
  icon: string;
  /** Background image URL */
  background: string;
  /** Minor trait IDs (automatically equipped) */
  minor_traits: number[];
  /** Major trait IDs (player selectable) */
  major_traits: number[];
  /** Weapon trait ID (elite specs only) */
  weapon_trait?: number;
  /** Profession mechanic IDs */
  profession_icon?: string;
  /** Profession icon WvW URL */
  profession_icon_big?: string;
}

/**
 * Extract skill cooldown from facts
 * @param skill - Skill data
 * @returns Cooldown in seconds or null if not found
 */
export function getSkillCooldown(skill: Skill): number | null {
  const rechargeFact = skill.facts?.find((f) => f.type === 'Recharge') as Recharge | undefined;
  return rechargeFact?.value ?? null;
}

/**
 * Extract all boons/conditions from skill
 * @param skill - Skill data
 * @returns Array of status effect names
 */
export function getSkillBoons(skill: Skill): string[] {
  const boons: string[] = [];

  skill.facts?.forEach((fact) => {
    if ((fact.type === 'Buff' || fact.type === 'PrefixedBuff') && 'status' in fact && fact.status) {
      boons.push(fact.status);
    }
  });

  return boons;
}

/**
 * Check if skill has trait modifications
 * @param skill - Skill data
 * @param traitId - Trait ID to check
 * @returns True if trait modifies this skill
 */
export function hasTraitModifications(skill: Skill, traitId: number): boolean {
  return skill.traited_facts?.some((f) => f.requires_trait === traitId) ?? false;
}
