/**
 * Crafting and recipe types for the GW2 API
 * @module api/types/crafting
 */

import type { CraftingDiscipline } from './common';

/**
 * Recipe flags that describe how recipes are learned
 */
export type RecipeFlag = 'AutoLearned' | 'LearnedFromItem';

/**
 * Recipe ingredient information
 */
export interface RecipeIngredient {
  /** Item ID */
  item_id: number;
  /** Number required */
  count: number;
}

/**
 * Guild ingredient for guild recipes
 */
export interface GuildIngredient {
  /** Guild upgrade ID */
  upgrade_id: number;
  /** Number required */
  count: number;
}

/**
 * Recipe information from /v2/recipes
 */
export interface Recipe {
  /** Recipe ID */
  id: number;
  /** Recipe type (e.g., "Armor", "Weapon", "Consumable") */
  type: string;
  /** Resulting item ID */
  output_item_id: number;
  /** Number of items produced */
  output_item_count: number;
  /** Time to craft in milliseconds */
  time_to_craft_ms: number;
  /** Crafting disciplines that can use this recipe */
  disciplines: CraftingDiscipline[];
  /** Minimum crafting level required (0-500) */
  min_rating: number;
  /** Recipe learning flags */
  flags: RecipeFlag[];
  /** Required ingredients */
  ingredients: RecipeIngredient[];
  /** Guild ingredients (for guild recipes) */
  guild_ingredients?: GuildIngredient[];
  /** In-game chat link code */
  chat_link: string;
}

/**
 * Character crafting discipline from /v2/characters/:id/crafting
 */
export interface CharacterCrafting {
  /** Crafting discipline */
  discipline: CraftingDiscipline;
  /** Crafting level (0-500) */
  rating: number;
  /** Whether this discipline is currently active */
  active: boolean;
}

/**
 * Crafting tracking storage for user preferences
 */
export interface CraftingStorage {
  /** Recipe IDs being tracked */
  trackedRecipes: number[];
  /** Legendary item IDs being tracked */
  trackedLegendaries: number[];
  /** Last update timestamp (ISO 8601) */
  lastUpdated: string;
}

/**
 * Legendary item with recipe information (for caching)
 */
export interface LegendaryItem {
  /** Item ID */
  id: number;
  /** Localized item name */
  name: string;
  /** Item icon URL */
  icon: string;
  /** Item type (Weapon, Armor, Trinket, Back) */
  type: string;
  /** Item subtype (e.g., Sword, Greatsword, Staff) */
  subtype?: string;
  /** Associated recipe ID */
  recipeId?: number;
  /** Recipe ingredients */
  ingredients?: RecipeIngredient[];
}
