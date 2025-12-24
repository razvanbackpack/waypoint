/**
 * Example usage of GW2 API hooks
 * This file demonstrates various use cases for the API client
 */

import {
  useAccount,
  useApiKey,
  useBank,
  useCharacters,
  useDailyAchievements,
  useItems,
  useMaterials,
  useTradingPostPrice,
  useWallet,
} from './index';

/**
 * Example: API Key Management Component
 */
export function ApiKeySetup() {
  const { apiKey, setApiKey, clearApiKey, hasApiKey, error, isValidKey } = useApiKey();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const key = formData.get('apiKey') as string;

    if (isValidKey(key)) {
      setApiKey(key);
    }
  };

  return (
    <div>
      {hasApiKey ? (
        <div>
          <p>API Key is set: {apiKey?.substring(0, 8)}...</p>
          <button onClick={clearApiKey}>Clear API Key</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="apiKey"
            placeholder="XXXXXXXX-XXXX-..."
            style={{ width: '400px' }}
          />
          <button type="submit">Set API Key</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
    </div>
  );
}

/**
 * Example: Account Dashboard
 */
export function AccountDashboard() {
  const { data: account, isLoading, error } = useAccount();
  const { data: wallet } = useWallet();

  if (isLoading) return <div>Loading account...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!account) return <div>No account data</div>;

  const goldCurrency = wallet?.find(c => c.id === 1); // Gold is currency ID 1
  const gold = goldCurrency ? Math.floor(goldCurrency.value / 10000) : 0;
  const silver = goldCurrency ? Math.floor((goldCurrency.value % 10000) / 100) : 0;
  const copper = goldCurrency ? goldCurrency.value % 100 : 0;

  return (
    <div>
      <h2>{account.name}</h2>
      <p>Age: {Math.floor(account.age / 3600)} hours</p>
      <p>World: {account.world}</p>
      <p>Commander: {account.commander ? 'Yes' : 'No'}</p>
      <p>Fractal Level: {account.fractal_level}</p>
      <p>WvW Rank: {account.wvw_rank}</p>
      <p>
        Wealth: {gold}g {silver}s {copper}c
      </p>
    </div>
  );
}

/**
 * Example: Character List
 */
export function CharactersList() {
  const { data: characters, isLoading } = useCharacters();

  if (isLoading) return <div>Loading characters...</div>;

  return (
    <div>
      <h3>Characters ({characters?.length || 0})</h3>
      <ul>
        {characters?.map(name => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Example: Bank and Materials Overview
 */
export function InventoryOverview() {
  const { data: bank } = useBank();
  const { data: materials } = useMaterials();

  const bankItems = bank?.filter(slot => slot !== null) || [];
  const totalMaterials = materials?.reduce((sum, mat) => sum + mat.count, 0) || 0;

  return (
    <div>
      <h3>Inventory</h3>
      <p>Bank slots used: {bankItems.length} / {bank?.length || 0}</p>
      <p>Materials stored: {totalMaterials}</p>
    </div>
  );
}

/**
 * Example: Daily Achievements Tracker
 */
export function DailyTracker() {
  const { data: daily, isLoading } = useDailyAchievements();

  if (isLoading) return <div>Loading dailies...</div>;

  return (
    <div>
      <h3>Daily Achievements</h3>
      <div>
        <h4>PvE ({daily?.pve.length || 0})</h4>
        <ul>
          {daily?.pve.map(achievement => (
            <li key={achievement.id}>
              Achievement ID: {achievement.id}
              {achievement.required_access && (
                <span> (Requires: {achievement.required_access.join(', ')})</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Example: Item Price Checker
 */
export function ItemPriceChecker({ itemId }: { itemId: number }) {
  const { data: item } = useItems([itemId]);
  const { data: price } = useTradingPostPrice(itemId);

  const itemData = item?.[0];

  if (!itemData) return <div>Loading item...</div>;

  const buyPrice = price ? price.buys.unit_price : 0;
  const sellPrice = price ? price.sells.unit_price : 0;

  // Convert copper to gold/silver/copper
  const formatPrice = (copper: number) => {
    const g = Math.floor(copper / 10000);
    const s = Math.floor((copper % 10000) / 100);
    const c = copper % 100;
    return `${g}g ${s}s ${c}c`;
  };

  return (
    <div>
      <h3>{itemData.name}</h3>
      <img src={itemData.icon} alt={itemData.name} style={{ width: 64, height: 64 }} />
      <p>Rarity: {itemData.rarity}</p>
      <p>Type: {itemData.type}</p>
      {price && (
        <div>
          <p>Buy Price: {formatPrice(buyPrice)}</p>
          <p>Sell Price: {formatPrice(sellPrice)}</p>
          <p>Buy Orders: {price.buys.quantity}</p>
          <p>Sell Orders: {price.sells.quantity}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example: Complete Application Component
 */
export function GW2ToolsApp() {
  const { hasApiKey } = useApiKey();

  return (
    <div style={{ padding: '20px' }}>
      <h1>GW2 Tools</h1>

      <ApiKeySetup />

      {hasApiKey && (
        <div style={{ marginTop: '20px' }}>
          <AccountDashboard />
          <CharactersList />
          <InventoryOverview />
          <DailyTracker />

          <h3>Example Item</h3>
          <ItemPriceChecker itemId={19721} /> {/* Mystic Coin */}
        </div>
      )}
    </div>
  );
}
