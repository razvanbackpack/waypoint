# Commerce Endpoints (Trading Post)

**Last Updated:** 2025-12-24
**Source:** [GW2 Wiki - Commerce](https://wiki.guildwars2.com/wiki/API:2/commerce)

---

## 1. Overview

The Commerce API provides access to Guild Wars 2's Trading Post and gem exchange system. These endpoints allow you to:
- Query current buy/sell prices for items
- View detailed order book listings
- Check your active and historical transactions (authenticated)
- Retrieve items and coins waiting for pickup (authenticated)
- Calculate gem-to-gold conversion rates

Some endpoints require authentication with `account` and `tradingpost` scopes, while market data endpoints are publicly accessible.

---

## 2. /v2/commerce/prices

Returns aggregated current highest buy order and lowest sell listing for tradable items.

**Authentication:** Not required
**Scopes:** None

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| id | number | Item ID |
| whitelisted | boolean | Whether free-to-play accounts can trade this item |
| buys.unit_price | number | Highest current buy order price (in copper) |
| buys.quantity | number | Total quantity available at the highest buy price |
| sells.unit_price | number | Lowest current sell listing price (in copper) |
| sells.quantity | number | Total quantity available at the lowest sell price |

### Example Request

```
GET /v2/commerce/prices/19684
GET /v2/commerce/prices?ids=19684,24612,46762
```

### Example Response

```json
{
  "id": 19684,
  "whitelisted": false,
  "buys": {
    "quantity": 145975,
    "unit_price": 7018
  },
  "sells": {
    "quantity": 126,
    "unit_price": 7019
  }
}
```

### Notes

- Prices are in copper (1 gold = 10,000 copper)
- `buys.unit_price` represents the immediate sell price (instant sale)
- `sells.unit_price` represents the immediate buy price (instant purchase)
- Items not on the trading post will return a 404 error

---

## 3. /v2/commerce/listings

Returns the complete order book showing all current buy orders and sell listings at each price level.

**Authentication:** Not required
**Scopes:** None

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| id | number | Item ID |
| buys | array | Buy order entries, sorted descending by price |
| sells | array | Sell listing entries, sorted ascending by price |

Each buy/sell entry contains:

| Field | Type | Description |
|-------|------|-------------|
| listings | number | Number of individual orders at this price point |
| unit_price | number | Price per item in copper |
| quantity | number | Total quantity available at this price |

### Example Request

```
GET /v2/commerce/listings/19684
GET /v2/commerce/listings?ids=19684,24612
```

### Example Response

```json
{
  "id": 19684,
  "buys": [
    {
      "listings": 1,
      "unit_price": 7017,
      "quantity": 50
    },
    {
      "listings": 3,
      "unit_price": 7016,
      "quantity": 150
    },
    {
      "listings": 2,
      "unit_price": 7015,
      "quantity": 75
    }
  ],
  "sells": [
    {
      "listings": 1,
      "unit_price": 7019,
      "quantity": 10
    },
    {
      "listings": 2,
      "unit_price": 7020,
      "quantity": 25
    },
    {
      "listings": 1,
      "unit_price": 7021,
      "quantity": 5
    }
  ]
}
```

### Notes

- Buy orders are sorted in descending order (highest price first)
- Sell listings are sorted in ascending order (lowest price first)
- `listings` indicates market depth at each price level
- More detailed than `/v2/commerce/prices` but larger response size

---

## 4. /v2/commerce/transactions

Returns your personal trading post transaction history, both current (unfulfilled) orders and historical (completed) transactions.

**Authentication:** Required
**Scopes:** account, tradingpost

### Hierarchical Structure

- **`/v2/commerce/transactions/current/buys`** - Active buy orders
- **`/v2/commerce/transactions/current/sells`** - Active sell listings
- **`/v2/commerce/transactions/history/buys`** - Historical purchases (90 days)
- **`/v2/commerce/transactions/history/sells`** - Historical sales (90 days)

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| id | number | Transaction ID |
| item_id | number | Item ID |
| price | number | Price per item in copper |
| quantity | number | Number of items in order |
| created | string | ISO-8601 timestamp when order was created |
| purchased | string | ISO-8601 timestamp when order was fulfilled (history only) |

### Example Request

```
GET /v2/commerce/transactions/current/sells
Authorization: Bearer <API_KEY>
```

### Example Response (Current Orders)

```json
[
  {
    "id": 2750477618,
    "item_id": 24612,
    "price": 1788,
    "quantity": 1,
    "created": "2025-12-24T10:13:26+00:00"
  },
  {
    "id": 2750488523,
    "item_id": 19684,
    "price": 7020,
    "quantity": 50,
    "created": "2025-12-24T09:45:12+00:00"
  }
]
```

### Example Response (History)

```json
[
  {
    "id": 2750477618,
    "item_id": 24612,
    "price": 1788,
    "quantity": 1,
    "created": "2025-12-23T17:13:26+00:00",
    "purchased": "2025-12-23T17:24:20+00:00"
  }
]
```

### Notes

- Current endpoints return unfulfilled orders
- History endpoints return completed transactions from the past 90 days
- The `purchased` field only appears in historical transactions
- Partial fulfillments are not tracked separately (each response entry is complete)

---

## 5. /v2/commerce/delivery

Returns items and coins currently waiting for pickup at the Trading Post delivery box.

**Authentication:** Required
**Scopes:** account, tradingpost

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| coins | number | Copper waiting for pickup |
| items | array | Items waiting for pickup |

Each item entry contains:

| Field | Type | Description |
|-------|------|-------------|
| id | number | Item ID |
| count | number | Quantity of this item |

### Example Request

```
GET /v2/commerce/delivery
Authorization: Bearer <API_KEY>
```

### Example Response

```json
{
  "coins": 123456,
  "items": [
    {
      "id": 19684,
      "count": 25
    },
    {
      "id": 24612,
      "count": 1
    }
  ]
}
```

### Notes

- Items and coins must be manually picked up from the Trading Post
- The delivery box has limited capacity (pick up items to free space)
- Coins come from completed sell orders
- Items come from completed buy orders or cancelled sell listings

---

## 6. /v2/commerce/exchange

Provides current gem-to-gold and gold-to-gem conversion rates.

**Authentication:** Not required
**Scopes:** None

### Sub-endpoints

- **`/v2/commerce/exchange/coins?quantity=<copper>`** - How many gems you get for X copper
- **`/v2/commerce/exchange/gems?quantity=<gems>`** - How much copper you get for X gems

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| coins_per_gem | number | Current exchange rate (copper per gem) |
| quantity | number | Amount you receive in the conversion |

### Example Request (Copper to Gems)

```
GET /v2/commerce/exchange/coins?quantity=1000000
```

### Example Response

```json
{
  "coins_per_gem": 2850,
  "quantity": 350
}
```

This means 1,000,000 copper (100 gold) will get you 350 gems.

### Example Request (Gems to Copper)

```
GET /v2/commerce/exchange/gems?quantity=400
```

### Example Response

```json
{
  "coins_per_gem": 2850,
  "quantity": 1140000
}
```

This means 400 gems will get you 1,140,000 copper (114 gold).

### Notes

- Rates fluctuate based on supply and demand
- The `quantity` parameter must be large enough to exchange for at least 1 unit
- Actual in-game conversions may have slight variations due to rounding
- The exchange rate is the same for both directions

---

## 7. Price Calculations

### Trading Post Fees

The Trading Post applies two types of fees when you sell items:

1. **Listing Fee (5%)**: Charged when you create a sell listing
   - Calculated as: `floor(sell_price * 0.05)`
   - Non-refundable even if you cancel the listing
   - Rounded down to nearest copper

2. **Exchange Fee (10%)**: Charged when your item sells
   - Calculated as: `floor(sell_price * 0.10)`
   - Only charged on successful sale
   - Rounded down to nearest copper

3. **Total Tax: 15%** of the sell price

### Profit Formula

```javascript
// Basic profit calculation
const listingFee = Math.floor(sellPrice * 0.05);
const exchangeFee = Math.floor(sellPrice * 0.10);
const totalFees = listingFee + exchangeFee;
const profit = sellPrice - totalFees - buyPrice;

// Simplified (use carefully due to rounding)
const approximateProfit = Math.floor(sellPrice * 0.85) - buyPrice;
```

### Example Calculation

Let's say you want to flip an item:
- Buy price: 7,018 copper (instant buy from sell listings)
- Sell price: 7,100 copper (your listing price)

```javascript
const buyPrice = 7018;
const sellPrice = 7100;

const listingFee = Math.floor(sellPrice * 0.05);  // 355 copper
const exchangeFee = Math.floor(sellPrice * 0.10); // 710 copper
const totalFees = listingFee + exchangeFee;       // 1065 copper

const netRevenue = sellPrice - totalFees;         // 6035 copper
const profit = netRevenue - buyPrice;             // -983 copper (loss!)
```

In this example, you would actually **lose** 983 copper due to trading post fees.

### Break-Even Analysis

To break even when flipping, your sell price must be:

```javascript
const minSellPrice = buyPrice / 0.85;
```

For the example above:
```javascript
const buyPrice = 7018;
const minSellPrice = Math.ceil(buyPrice / 0.85); // 8,257 copper
```

You need to sell at 8,257 copper or higher to make a profit.

### Useful Helper Functions

```typescript
/**
 * Calculate profit from a trading post flip
 */
export function calculateProfit(buyPrice: number, sellPrice: number): number {
  const listingFee = Math.floor(sellPrice * 0.05);
  const exchangeFee = Math.floor(sellPrice * 0.10);
  const totalFees = listingFee + exchangeFee;
  return sellPrice - totalFees - buyPrice;
}

/**
 * Calculate minimum sell price to break even
 */
export function calculateBreakEven(buyPrice: number): number {
  return Math.ceil(buyPrice / 0.85);
}

/**
 * Calculate profit margin as a percentage
 */
export function calculateProfitMargin(buyPrice: number, sellPrice: number): number {
  const profit = calculateProfit(buyPrice, sellPrice);
  return (profit / buyPrice) * 100;
}

/**
 * Calculate return on investment (ROI)
 */
export function calculateROI(buyPrice: number, sellPrice: number): number {
  const profit = calculateProfit(buyPrice, sellPrice);
  return (profit / buyPrice) * 100;
}

/**
 * Format copper to gold/silver/copper display
 */
export function formatCurrency(copper: number): string {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const copperRemainder = copper % 100;

  if (gold > 0) {
    return `${gold}g ${silver}s ${copperRemainder}c`;
  } else if (silver > 0) {
    return `${silver}s ${copperRemainder}c`;
  } else {
    return `${copperRemainder}c`;
  }
}
```

---

## 8. Common Use Cases

### Price Checking

```typescript
// Get current prices for multiple items
const itemIds = [19684, 24612, 46762];
const prices = await fetch(
  `https://api.guildwars2.com/v2/commerce/prices?ids=${itemIds.join(',')}`
).then(r => r.json());

// Find items with good profit margins
const profitableItems = prices.filter(item => {
  const profit = calculateProfit(item.buys.unit_price, item.sells.unit_price);
  const margin = (profit / item.buys.unit_price) * 100;
  return margin > 10; // 10% profit margin
});
```

### Flipping Calculator

```typescript
interface FlipOpportunity {
  itemId: number;
  buyPrice: number;
  sellPrice: number;
  profit: number;
  margin: number;
  velocity: number; // quantity available
}

async function findFlipOpportunities(itemIds: number[]): Promise<FlipOpportunity[]> {
  const prices = await fetch(
    `https://api.guildwars2.com/v2/commerce/prices?ids=${itemIds.join(',')}`
  ).then(r => r.json());

  return prices.map(item => {
    const buyPrice = item.sells.unit_price; // Instant buy
    const sellPrice = item.buys.unit_price; // Instant sell (flipping to buy orders)
    const profit = calculateProfit(buyPrice, sellPrice);
    const margin = (profit / buyPrice) * 100;

    return {
      itemId: item.id,
      buyPrice,
      sellPrice,
      profit,
      margin,
      velocity: Math.min(item.buys.quantity, item.sells.quantity)
    };
  }).filter(item => item.profit > 0)
    .sort((a, b) => b.profit - a.profit);
}
```

### Transaction History Analysis

```typescript
interface TransactionSummary {
  totalBought: number;
  totalSold: number;
  totalProfit: number;
  itemBreakdown: Map<number, { bought: number; sold: number }>;
}

async function analyzeTransactionHistory(apiKey: string): Promise<TransactionSummary> {
  const [buyHistory, sellHistory] = await Promise.all([
    fetch('https://api.guildwars2.com/v2/commerce/transactions/history/buys', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    }).then(r => r.json()),
    fetch('https://api.guildwars2.com/v2/commerce/transactions/history/sells', {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    }).then(r => r.json())
  ]);

  const summary: TransactionSummary = {
    totalBought: 0,
    totalSold: 0,
    totalProfit: 0,
    itemBreakdown: new Map()
  };

  buyHistory.forEach(tx => {
    const cost = tx.price * tx.quantity;
    summary.totalBought += cost;
  });

  sellHistory.forEach(tx => {
    const revenue = tx.price * tx.quantity;
    const fees = Math.floor(revenue * 0.15);
    summary.totalSold += revenue - fees;
  });

  summary.totalProfit = summary.totalSold - summary.totalBought;

  return summary;
}
```

---

## 9. Rate Limiting

The GW2 API implements rate limiting:
- **300 requests per minute** for authenticated requests
- **60 requests per minute** for unauthenticated requests

Rate limit information is provided in response headers:
- `X-Rate-Limit-Limit` - Maximum requests allowed
- `X-Rate-Limit-Remaining` - Requests remaining in current window
- `X-Rate-Limit-Reset` - Seconds until rate limit resets

---

## 10. Error Responses

Common error responses:

| Status | Error | Description |
|--------|-------|-------------|
| 400 | Bad Request | Invalid request format or parameters |
| 403 | Forbidden | Invalid API key or insufficient permissions |
| 404 | Not Found | Item not found or not tradable |
| 429 | Too Many Requests | Rate limit exceeded |
| 503 | Service Unavailable | API temporarily unavailable |

### Example Error Response

```json
{
  "text": "invalid key"
}
```

```json
{
  "text": "all ids provided are invalid"
}
```

---

## 11. Best Practices

### Caching

- Cache `/v2/commerce/prices` responses for at least 30-60 seconds
- Market prices don't change instantly; aggressive polling wastes rate limits
- Use bulk ID requests (`?ids=1,2,3`) instead of individual requests

### Pagination

- Commerce endpoints support bulk ID requests (up to 200 IDs)
- Use `/v2/commerce/prices?ids=all` to get all tradable item prices (warning: large response)

### Error Handling

- Always check for 404 errors (item not tradable)
- Implement exponential backoff for 429 rate limit errors
- Handle missing `buys` or `sells` objects (no active orders)

### Performance

- Batch API calls where possible
- Use `/v2/commerce/prices` for simple price checks
- Only use `/v2/commerce/listings` when you need full order book depth
- Consider using webhooks or polling intervals based on your use case

---

## 12. Additional Resources

- [GW2 Wiki - Commerce API](https://wiki.guildwars2.com/wiki/API:2/commerce)
- [GW2 Wiki - Trading Post](https://wiki.guildwars2.com/wiki/Trading_Post)
- [GW2Efficiency Trading Post Tracker](https://gw2efficiency.com/trading/overview)
- [GW2BLTC Market Data](https://www.gw2bltc.com/)
