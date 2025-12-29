import { useQuery, type UseQueryOptions, type UseQueryResult } from '@tanstack/react-query';
import { getApiClient } from '../client';
import { accountEndpoints, commerceEndpoints, itemsEndpoints, achievementsEndpoints, miscEndpoints } from '../endpoints';
import type {
  Account,
  Character,
  BankSlot,
  MaterialStorage,
  WalletCurrency,
  Item,
  ItemStat,
  TradingPostPrice,
  TradingPostListing,
  Achievement,
  DailyAchievements,
  AccountAchievement,
  Skill,
  Trait,
  Specialization,
  BuildTab,
  EquipmentTab,
  MasteryPoints,
  WizardsVaultDaily,
  WizardsVaultWeekly,
  WizardsVaultSpecial,
} from '../types';
import type { Recipe, CharacterCrafting } from '../types/crafting';

// Query key factory for consistent cache key generation
export const queryKeys = {
  account: ['account'] as const,
  characters: ['characters'] as const,
  character: (name: string) => ['character', name] as const,
  bank: ['bank'] as const,
  materials: ['materials'] as const,
  wallet: ['wallet'] as const,
  masteryPoints: ['masteryPoints'] as const,
  items: (ids: number[] | string[]) => ['items', ...ids] as const,
  tradingPostPrices: (ids: number[]) => ['tradingPostPrices', ...ids] as const,
  tradingPostListings: (ids: number[]) => ['tradingPostListings', ...ids] as const,
  achievements: (ids: number[]) => ['achievements', ...ids] as const,
  dailyAchievements: ['dailyAchievements'] as const,
  accountAchievements: ['accountAchievements'] as const,
  skills: (ids: number[]) => ['skills', ...ids] as const,
  traits: (ids: number[]) => ['traits', ...ids] as const,
  specializations: (ids: number[]) => ['specializations', ...ids] as const,
  buildtabs: (name: string) => ['character', name, 'buildtabs'] as const,
  equipmenttabs: (name: string) => ['character', name, 'equipmenttabs'] as const,
  worldbosses: ['worldbosses'] as const,
  wizardsVaultDaily: ['wizardsVaultDaily'] as const,
  wizardsVaultWeekly: ['wizardsVaultWeekly'] as const,
  wizardsVaultSpecial: ['wizardsVaultSpecial'] as const,
  recipes: (ids: number[]) => ['recipes', ...ids] as const,
  recipeSearch: (outputItemId: number) => ['recipeSearch', outputItemId] as const,
  accountRecipes: ['accountRecipes'] as const,
  characterCrafting: (name: string) => ['character', name, 'crafting'] as const,
  legendaryArmory: ['legendaryArmory'] as const,
} as const;

// Default cache configuration
const DEFAULT_STALE_TIME = 5 * 60 * 1000; // 5 minutes
const LONG_STALE_TIME = 60 * 60 * 1000; // 1 hour
const SHORT_STALE_TIME = 30 * 1000; // 30 seconds

/**
 * Fetch account information
 * Requires authentication
 */
export function useAccount(
  options?: Omit<UseQueryOptions<Account>, 'queryKey' | 'queryFn'>
): UseQueryResult<Account> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.account,
    queryFn: () => client.get<Account>(accountEndpoints.account()),
    staleTime: DEFAULT_STALE_TIME,
    enabled: client.isAuthenticated(),
    ...options,
  });
}

/**
 * Fetch character names list
 * Requires authentication
 */
export function useCharacters(
  options?: Omit<UseQueryOptions<string[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<string[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.characters,
    queryFn: () => client.get<string[]>(accountEndpoints.characters()),
    staleTime: DEFAULT_STALE_TIME,
    enabled: client.isAuthenticated(),
    ...options,
  });
}

/**
 * Fetch specific character details
 * Requires authentication
 */
export function useCharacter(
  name: string,
  options?: Omit<UseQueryOptions<Character>, 'queryKey' | 'queryFn'>
): UseQueryResult<Character> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.character(name),
    queryFn: () => client.get<Character>(accountEndpoints.character(name)),
    staleTime: DEFAULT_STALE_TIME,
    enabled: client.isAuthenticated() && !!name,
    ...options,
  });
}

/**
 * Fetch bank contents
 * Requires authentication
 */
export function useBank(
  options?: Omit<UseQueryOptions<(BankSlot | null)[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<(BankSlot | null)[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.bank,
    queryFn: () => client.get<(BankSlot | null)[]>(accountEndpoints.bank()),
    staleTime: SHORT_STALE_TIME,
    enabled: client.isAuthenticated(),
    ...options,
  });
}

/**
 * Fetch material storage
 * Requires authentication
 */
export function useMaterials(
  options?: Omit<UseQueryOptions<MaterialStorage[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<MaterialStorage[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.materials,
    queryFn: () => client.get<MaterialStorage[]>(accountEndpoints.materials()),
    staleTime: SHORT_STALE_TIME,
    enabled: client.isAuthenticated(),
    ...options,
  });
}

/**
 * Fetch wallet currencies
 * Requires authentication
 */
export function useWallet(
  options?: Omit<UseQueryOptions<WalletCurrency[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<WalletCurrency[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.wallet,
    queryFn: () => client.get<WalletCurrency[]>(accountEndpoints.wallet()),
    staleTime: SHORT_STALE_TIME,
    enabled: client.isAuthenticated(),
    ...options,
  });
}

/**
 * Fetch account achievements progress
 * Requires authentication
 */
export function useAccountAchievements(
  options?: Omit<UseQueryOptions<AccountAchievement[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<AccountAchievement[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.accountAchievements,
    queryFn: () => client.get<AccountAchievement[]>(accountEndpoints.achievements()),
    staleTime: DEFAULT_STALE_TIME,
    enabled: client.isAuthenticated(),
    ...options,
  });
}

/**
 * Fetch account mastery points
 * Requires authentication
 */
export function useMasteryPoints(
  options?: Omit<UseQueryOptions<MasteryPoints>, 'queryKey' | 'queryFn'>
): UseQueryResult<MasteryPoints> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.masteryPoints,
    queryFn: () => client.get<MasteryPoints>(accountEndpoints.mastery.points()),
    staleTime: DEFAULT_STALE_TIME,
    enabled: client.isAuthenticated(),
    ...options,
  });
}

/**
 * Fetch item details by IDs
 * Does not require authentication
 */
export function useItems(
  ids: number[],
  options?: Omit<UseQueryOptions<Item[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<Item[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.items(ids),
    queryFn: () => client.getWithIds<Item[]>(itemsEndpoints.items(), ids),
    staleTime: LONG_STALE_TIME,
    enabled: ids.length > 0,
    ...options,
  });
}

/**
 * Fetch single item details
 * Does not require authentication
 */
export function useItem(
  id: number,
  options?: Omit<UseQueryOptions<Item>, 'queryKey' | 'queryFn'>
): UseQueryResult<Item> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.items([id]),
    queryFn: async () => {
      const items = await client.getWithIds<Item[]>(itemsEndpoints.items(), [id]);
      if (items.length === 0) {
        throw new Error(`Item with ID ${id} not found`);
      }
      return items[0];
    },
    staleTime: LONG_STALE_TIME,
    enabled: !!id,
    ...options,
  });
}

/**
 * Fetch item stat combinations
 * Does not require authentication
 */
export function useItemStats(
  ids: number[],
  options?: Omit<UseQueryOptions<ItemStat[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<ItemStat[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: ['itemstats', ids],
    queryFn: () => client.getWithIds<ItemStat[]>(itemsEndpoints.itemstats(), ids),
    staleTime: LONG_STALE_TIME,
    enabled: ids.length > 0,
    ...options,
  });
}

/**
 * Fetch Trading Post prices for items
 * Does not require authentication
 */
export function useTradingPostPrices(
  ids: number[],
  options?: Omit<UseQueryOptions<TradingPostPrice[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<TradingPostPrice[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.tradingPostPrices(ids),
    queryFn: () => client.getWithIds<TradingPostPrice[]>(commerceEndpoints.prices(), ids),
    staleTime: SHORT_STALE_TIME, // Prices change frequently
    enabled: ids.length > 0,
    ...options,
  });
}

/**
 * Fetch Trading Post price for a single item
 * Does not require authentication
 */
export function useTradingPostPrice(
  id: number,
  options?: Omit<UseQueryOptions<TradingPostPrice>, 'queryKey' | 'queryFn'>
): UseQueryResult<TradingPostPrice> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.tradingPostPrices([id]),
    queryFn: async () => {
      const prices = await client.getWithIds<TradingPostPrice[]>(commerceEndpoints.prices(), [id]);
      if (prices.length === 0) {
        throw new Error(`Price for item ${id} not found`);
      }
      return prices[0];
    },
    staleTime: SHORT_STALE_TIME,
    enabled: !!id,
    ...options,
  });
}

/**
 * Fetch Trading Post listings for items
 * Does not require authentication
 */
export function useTradingPostListings(
  ids: number[],
  options?: Omit<UseQueryOptions<TradingPostListing[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<TradingPostListing[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.tradingPostListings(ids),
    queryFn: () => client.getWithIds<TradingPostListing[]>(commerceEndpoints.listings(), ids),
    staleTime: SHORT_STALE_TIME, // Listings change frequently
    enabled: ids.length > 0,
    ...options,
  });
}

/**
 * Fetch Trading Post listing for a single item
 * Does not require authentication
 */
export function useTradingPostListing(
  id: number,
  options?: Omit<UseQueryOptions<TradingPostListing>, 'queryKey' | 'queryFn'>
): UseQueryResult<TradingPostListing> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.tradingPostListings([id]),
    queryFn: async () => {
      const listings = await client.getWithIds<TradingPostListing[]>(commerceEndpoints.listings(), [id]);
      if (listings.length === 0) {
        throw new Error(`Listing for item ${id} not found`);
      }
      return listings[0];
    },
    staleTime: SHORT_STALE_TIME,
    enabled: !!id,
    ...options,
  });
}

/**
 * Fetch achievement details by IDs
 * Does not require authentication
 */
export function useAchievements(
  ids: number[],
  options?: Omit<UseQueryOptions<Achievement[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<Achievement[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.achievements(ids),
    queryFn: () => client.getWithIds<Achievement[]>(achievementsEndpoints.achievements(), ids),
    staleTime: LONG_STALE_TIME,
    enabled: ids.length > 0,
    ...options,
  });
}

/**
 * Fetch single achievement details
 * Does not require authentication
 */
export function useAchievement(
  id: number,
  options?: Omit<UseQueryOptions<Achievement>, 'queryKey' | 'queryFn'>
): UseQueryResult<Achievement> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.achievements([id]),
    queryFn: async () => {
      const achievements = await client.getWithIds<Achievement[]>(achievementsEndpoints.achievements(), [id]);
      if (achievements.length === 0) {
        throw new Error(`Achievement with ID ${id} not found`);
      }
      return achievements[0];
    },
    staleTime: LONG_STALE_TIME,
    enabled: !!id,
    ...options,
  });
}

/**
 * Fetch daily achievements
 * Does not require authentication
 */
export function useDailyAchievements(
  options?: Omit<UseQueryOptions<DailyAchievements>, 'queryKey' | 'queryFn'>
): UseQueryResult<DailyAchievements> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.dailyAchievements,
    queryFn: () => client.get<DailyAchievements>(achievementsEndpoints.achievementsDaily()),
    staleTime: LONG_STALE_TIME, // Daily achievements change once per day
    ...options,
  });
}

/**
 * Fetch tomorrow's daily achievements
 * Does not require authentication
 */
export function useTomorrowDailies(
  options?: Omit<UseQueryOptions<DailyAchievements>, 'queryKey' | 'queryFn'>
): UseQueryResult<DailyAchievements> {
  const client = getApiClient();

  return useQuery({
    queryKey: ['dailyAchievementsTomorrow'],
    queryFn: () => client.get<DailyAchievements>(achievementsEndpoints.achievementsDailyTomorrow()),
    staleTime: LONG_STALE_TIME, // Daily achievements change once per day
    ...options,
  });
}

/**
 * Fetch skill details by IDs
 * Does not require authentication
 */
export function useSkills(
  ids: number[],
  options?: Omit<UseQueryOptions<Skill[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<Skill[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.skills(ids),
    queryFn: () => client.getWithIds<Skill[]>(miscEndpoints.skills(), ids),
    staleTime: LONG_STALE_TIME,
    enabled: ids.length > 0,
    ...options,
  });
}

/**
 * Fetch trait details by IDs
 * Does not require authentication
 */
export function useTraits(
  ids: number[],
  options?: Omit<UseQueryOptions<Trait[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<Trait[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.traits(ids),
    queryFn: () => client.getWithIds<Trait[]>(miscEndpoints.traits(), ids),
    staleTime: LONG_STALE_TIME,
    enabled: ids.length > 0,
    ...options,
  });
}

/**
 * Fetch specialization details by IDs
 * Does not require authentication
 */
export function useSpecializations(
  ids: number[],
  options?: Omit<UseQueryOptions<Specialization[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<Specialization[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.specializations(ids),
    queryFn: () => client.getWithIds<Specialization[]>(miscEndpoints.specializations(), ids),
    staleTime: LONG_STALE_TIME,
    enabled: ids.length > 0,
    ...options,
  });
}

/**
 * Fetch character build tabs (build templates)
 * Requires authentication and characters scope
 */
export function useCharacterBuildTabs(
  name: string,
  options?: Omit<UseQueryOptions<BuildTab[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<BuildTab[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.buildtabs(name),
    queryFn: () => client.get<BuildTab[]>(accountEndpoints.buildtabs(name)),
    staleTime: DEFAULT_STALE_TIME,
    enabled: client.isAuthenticated() && !!name,
    ...options,
  });
}

/**
 * Fetch character equipment tabs (equipment templates)
 * Requires authentication and characters scope
 */
export function useCharacterEquipmentTabs(
  name: string,
  options?: Omit<UseQueryOptions<EquipmentTab[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<EquipmentTab[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.equipmenttabs(name),
    queryFn: () => client.get<EquipmentTab[]>(accountEndpoints.equipmenttabs(name)),
    staleTime: DEFAULT_STALE_TIME,
    enabled: client.isAuthenticated() && !!name,
    ...options,
  });
}

/**
 * Fetch completed world bosses for today
 * Requires authentication
 * Returns array of world boss IDs that have been completed today
 */
export function useWorldBossesCompleted(
  options?: Omit<UseQueryOptions<string[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<string[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.worldbosses,
    queryFn: () => client.get<string[]>(accountEndpoints.worldbosses()),
    staleTime: DEFAULT_STALE_TIME,
    enabled: client.isAuthenticated(),
    ...options,
  });
}

/**
 * Fetch Wizard's Vault daily objectives
 * Requires authentication
 */
export function useWizardsVaultDaily(
  options?: Omit<UseQueryOptions<WizardsVaultDaily>, 'queryKey' | 'queryFn'>
): UseQueryResult<WizardsVaultDaily> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.wizardsVaultDaily,
    queryFn: () => client.get<WizardsVaultDaily>(accountEndpoints.wizardsvault.daily()),
    staleTime: SHORT_STALE_TIME,
    enabled: client.isAuthenticated(),
    ...options,
  });
}

/**
 * Fetch Wizard's Vault weekly objectives
 * Requires authentication
 */
export function useWizardsVaultWeekly(
  options?: Omit<UseQueryOptions<WizardsVaultWeekly>, 'queryKey' | 'queryFn'>
): UseQueryResult<WizardsVaultWeekly> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.wizardsVaultWeekly,
    queryFn: () => client.get<WizardsVaultWeekly>(accountEndpoints.wizardsvault.weekly()),
    staleTime: DEFAULT_STALE_TIME,
    enabled: client.isAuthenticated(),
    ...options,
  });
}

/**
 * Fetch Wizard's Vault special objectives
 * Requires authentication
 */
export function useWizardsVaultSpecial(
  options?: Omit<UseQueryOptions<WizardsVaultSpecial>, 'queryKey' | 'queryFn'>
): UseQueryResult<WizardsVaultSpecial> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.wizardsVaultSpecial,
    queryFn: () => client.get<WizardsVaultSpecial>(accountEndpoints.wizardsvault.special()),
    staleTime: LONG_STALE_TIME,
    enabled: client.isAuthenticated(),
    ...options,
  });
}

/**
 * Fetch recipe details by IDs
 * Does not require authentication
 */
export function useRecipes(
  ids: number[],
  options?: Omit<UseQueryOptions<Recipe[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<Recipe[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.recipes(ids),
    queryFn: () => client.getWithIds<Recipe[]>(itemsEndpoints.recipes(), ids),
    staleTime: LONG_STALE_TIME,
    enabled: ids.length > 0,
    ...options,
  });
}

/**
 * Fetch recipe IDs by output item ID
 * Does not require authentication
 */
export function useRecipeSearch(
  outputItemId: number | undefined,
  options?: Omit<UseQueryOptions<number[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<number[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.recipeSearch(outputItemId!),
    queryFn: () => client.get<number[]>(itemsEndpoints.recipeSearch.byOutput(outputItemId!)),
    staleTime: LONG_STALE_TIME,
    enabled: outputItemId !== undefined,
    ...options,
  });
}

/**
 * Fetch account's learned recipes
 * Requires authentication
 */
export function useAccountRecipes(
  options?: Omit<UseQueryOptions<number[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<number[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.accountRecipes,
    queryFn: () => client.get<number[]>(accountEndpoints.recipes()),
    staleTime: DEFAULT_STALE_TIME,
    enabled: client.isAuthenticated(),
    ...options,
  });
}

/**
 * Fetch character's crafting disciplines
 * Requires authentication
 */
export function useCharacterCrafting(
  characterName: string | undefined,
  options?: Omit<UseQueryOptions<CharacterCrafting[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<CharacterCrafting[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.characterCrafting(characterName!),
    queryFn: () => client.get<CharacterCrafting[]>(accountEndpoints.crafting(characterName!)),
    staleTime: DEFAULT_STALE_TIME,
    enabled: client.isAuthenticated() && characterName !== undefined,
    ...options,
  });
}

/**
 * Fetch account's legendary armory items
 * Requires authentication
 */
export function useLegendaryArmory(
  options?: Omit<UseQueryOptions<{ id: number; count: number }[]>, 'queryKey' | 'queryFn'>
): UseQueryResult<{ id: number; count: number }[]> {
  const client = getApiClient();

  return useQuery({
    queryKey: queryKeys.legendaryArmory,
    queryFn: () => client.get<{ id: number; count: number }[]>(accountEndpoints.legendaryarmory()),
    staleTime: DEFAULT_STALE_TIME,
    enabled: client.isAuthenticated(),
    ...options,
  });
}
