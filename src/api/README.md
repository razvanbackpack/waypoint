# GW2 API Client

Comprehensive TypeScript API client for Guild Wars 2 API v2 with React hooks and TanStack Query integration.

## Features

- Type-safe API client with TypeScript
- React hooks using TanStack Query for data fetching and caching
- API key management with localStorage persistence
- Support for authenticated and public endpoints
- Bulk fetching with automatic chunking
- Proper error handling
- Configurable language support
- Production-ready with appropriate cache strategies

## Installation

The API client is already integrated into the project. Just import what you need:

```typescript
import { useAccount, useApiKey, useItems } from '@/api';
```

## Usage

### API Key Management

```typescript
import { useApiKey } from '@/api';

function ApiKeyManager() {
  const { apiKey, setApiKey, clearApiKey, hasApiKey, error } = useApiKey();

  const handleSubmit = (key: string) => {
    setApiKey(key);
  };

  return (
    <div>
      {hasApiKey ? (
        <button onClick={clearApiKey}>Clear API Key</button>
      ) : (
        <input
          type="text"
          placeholder="Enter API key"
          onChange={(e) => handleSubmit(e.target.value)}
        />
      )}
      {error && <p>{error}</p>}
    </div>
  );
}
```

### Fetching Account Data

```typescript
import { useAccount } from '@/api';

function AccountInfo() {
  const { data: account, isLoading, error } = useAccount();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>{account?.name}</h2>
      <p>World: {account?.world}</p>
      <p>Created: {new Date(account?.created || '').toLocaleDateString()}</p>
    </div>
  );
}
```

### Fetching Items

```typescript
import { useItems, useItem } from '@/api';

// Fetch multiple items
function ItemsList() {
  const itemIds = [123, 456, 789];
  const { data: items, isLoading } = useItems(itemIds);

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {items?.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
}

// Fetch single item
function SingleItem() {
  const { data: item } = useItem(123);
  return <div>{item?.name}</div>;
}
```

### Trading Post Prices

```typescript
import { useTradingPostPrice, useTradingPostPrices } from '@/api';

function ItemPrice({ itemId }: { itemId: number }) {
  const { data: price } = useTradingPostPrice(itemId);

  if (!price) return null;

  return (
    <div>
      <p>Buy: {price.buys.unit_price} copper</p>
      <p>Sell: {price.sells.unit_price} copper</p>
    </div>
  );
}
```

### Bank and Materials

```typescript
import { useBank, useMaterials, useWallet } from '@/api';

function Inventory() {
  const { data: bank } = useBank();
  const { data: materials } = useMaterials();
  const { data: wallet } = useWallet();

  return (
    <div>
      <h3>Bank Items: {bank?.filter(slot => slot !== null).length}</h3>
      <h3>Material Storage: {materials?.length}</h3>
      <h3>Currencies: {wallet?.length}</h3>
    </div>
  );
}
```

### Daily Achievements

```typescript
import { useDailyAchievements, useAchievements } from '@/api';

function DailyTracker() {
  const { data: daily } = useDailyAchievements();

  // Get achievement IDs
  const achievementIds = daily?.pve.map(a => a.id) || [];

  // Fetch achievement details
  const { data: achievements } = useAchievements(achievementIds, {
    enabled: achievementIds.length > 0
  });

  return (
    <div>
      <h3>Daily PvE Achievements</h3>
      <ul>
        {achievements?.map(achievement => (
          <li key={achievement.id}>{achievement.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Characters

```typescript
import { useCharacters, useCharacter } from '@/api';

function CharacterList() {
  const { data: characterNames } = useCharacters();

  return (
    <ul>
      {characterNames?.map(name => (
        <CharacterDetail key={name} name={name} />
      ))}
    </ul>
  );
}

function CharacterDetail({ name }: { name: string }) {
  const { data: character } = useCharacter(name);

  return (
    <li>
      {character?.name} - Level {character?.level} {character?.profession}
    </li>
  );
}
```

## Direct API Client Usage

For advanced use cases, you can use the client directly:

```typescript
import { getApiClient } from '@/api';

const client = getApiClient();

// Make a custom request
const data = await client.get('/some/endpoint');

// Fetch with IDs
const items = await client.getWithIds('/items', [123, 456]);

// Check if endpoint requires auth
const needsAuth = client.requiresAuth('/account');

// Check if client has API key
const hasKey = client.isAuthenticated();
```

## Cache Configuration

The hooks use different stale times based on data volatility:

- **Long-lived data** (1 hour): Items, achievements, static game data
- **Medium-lived data** (5 minutes): Account info, characters
- **Short-lived data** (30 seconds): Bank, materials, wallet, trading post prices

You can override these by passing custom options:

```typescript
const { data } = useAccount({
  staleTime: 10 * 60 * 1000, // 10 minutes
  refetchInterval: 60 * 1000, // Refetch every minute
});
```

## Error Handling

All hooks return standard TanStack Query results with error handling:

```typescript
const { data, error, isLoading, isError } = useAccount();

if (isError) {
  console.error('API Error:', error);
  // error is of type GW2ApiError with additional properties
}
```

## API Key Format

API keys must match the format:
```
XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
```

The `useApiKey` hook validates this format automatically.

## Endpoint Builders

For building custom endpoints, use the endpoint builders:

```typescript
import { endpoints } from '@/api';

const accountUrl = endpoints.account.account();
const bankUrl = endpoints.account.bank();
const pricesUrl = endpoints.commerce.prices();
```

## TypeScript Types

All API responses are fully typed:

```typescript
import type {
  Account,
  Character,
  Item,
  TradingPostPrice
} from '@/api';
```

## Base URL

Default: `https://api.guildwars2.com/v2`

To use a custom base URL:

```typescript
import { GW2ApiClient } from '@/api';

const client = new GW2ApiClient({
  baseUrl: 'https://custom-api.example.com/v2'
});
```

## Language Support

Supported languages: `en`, `es`, `de`, `fr`, `zh`

```typescript
import { setClientLanguage } from '@/api';

setClientLanguage('de'); // Switch to German
```
