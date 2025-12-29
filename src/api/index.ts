// Main exports for GW2 API module

// Client
export {
  GW2ApiClient,
  GW2ApiError,
  getApiClient,
  setApiKey as setClientApiKey,
  setLanguage as setClientLanguage
} from './client';

// Hooks
export { useApiKey } from './hooks/useApiKey';
export type { UseApiKeyReturn } from './hooks/useApiKey';

export {
  useAccount,
  useCharacters,
  useCharacter,
  useBank,
  useMaterials,
  useWallet,
  useAccountAchievements,
  useItems,
  useItem,
  useTradingPostPrices,
  useTradingPostPrice,
  useTradingPostListings,
  useTradingPostListing,
  useAchievements,
  useAchievement,
  useDailyAchievements,
  queryKeys,
} from './hooks/useGW2Api';

export { useTradableItems } from './hooks/useTradableItems';

// Endpoints
export { endpoints } from './endpoints';

// Types
export type {
  ApiError,
  Account,
  Character,
  CharacterCrafting,
  CharacterEquipment,
  CharacterBag,
  InventoryItem,
  BankSlot,
  MaterialStorage,
  WalletCurrency,
  Item,
  ItemDetails,
  TradingPostPrice,
  TradingPostListing,
  Achievement,
  DailyAchievements,
  AccountAchievement,
  Language,
  ApiClientConfig,
} from './types';
