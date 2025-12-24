/**
 * Commerce and Trading Post types
 * @module api/types/commerce
 */

/**
 * Price information for buy or sell orders
 */
export interface PriceInfo {
  /** Price per item in copper coins */
  unit_price: number;
  /** Total quantity available at this price */
  quantity: number;
}

/**
 * Aggregated Trading Post prices for an item
 */
export interface CommercePrice {
  /** Item ID */
  id: number;
  /** Whether item can be traded on Trading Post */
  whitelisted: boolean;
  /** Current best buy order */
  buys: PriceInfo;
  /** Current best sell listing */
  sells: PriceInfo;
}

/**
 * Individual listing at a specific price point
 */
export interface Listing {
  /** Number of individual listings at this price */
  listings: number;
  /** Price per item in copper */
  unit_price: number;
  /** Total quantity across all listings at this price */
  quantity: number;
}

/**
 * All individual buy and sell listings for an item
 */
export interface CommerceListing {
  /** Item ID */
  id: number;
  /** All buy orders, sorted by price (highest first) */
  buys: Listing[];
  /** All sell listings, sorted by price (lowest first) */
  sells: Listing[];
}

/**
 * Trading Post transaction
 */
export interface Transaction {
  /** Transaction ID */
  id: number;
  /** Item ID (corresponds to /v2/items) */
  item_id: number;
  /** Price per item in copper */
  price: number;
  /** Number of items in this transaction */
  quantity: number;
  /** ISO 8601 timestamp when created */
  created: string;
  /** ISO 8601 timestamp when purchased (history only) */
  purchased?: string;
}

/**
 * Items waiting for pickup in Trading Post delivery box
 */
export interface DeliveryItem {
  /** Item ID */
  id: number;
  /** Quantity waiting for pickup */
  count: number;
}

/**
 * Trading Post delivery box contents
 */
export interface DeliveryBox {
  /** Coins waiting for pickup (in copper) */
  coins: number;
  /** Items waiting for pickup */
  items: DeliveryItem[];
}

/**
 * Market depth analysis result
 */
export interface MarketDepth {
  /** Best buy order price */
  bestBuyPrice: number;
  /** Best sell listing price */
  bestSellPrice: number;
  /** Spread between buy and sell */
  spread: number;
  /** Spread as percentage */
  spreadPercentage: number;
  /** Total number of buy orders */
  totalBuyOrders: number;
  /** Total number of sell listings */
  totalSellListings: number;
  /** Total buy order depth */
  buyDepth: number;
  /** Total sell listing depth */
  sellDepth: number;
}

/**
 * Calculate market depth from listings
 * @param listings - Commerce listings data
 * @returns Market depth analysis
 */
export function analyzeMarketDepth(listings: CommerceListing): MarketDepth | null {
  if (!listings.buys.length || !listings.sells.length) {
    return null;
  }

  const bestBuy = listings.buys[0];
  const bestSell = listings.sells[0];

  const spread = bestSell.unit_price - bestBuy.unit_price;
  const spreadPercentage = (spread / bestBuy.unit_price) * 100;

  const totalBuyOrders = listings.buys.reduce((sum, b) => sum + b.listings, 0);
  const totalSellListings = listings.sells.reduce((sum, s) => sum + s.listings, 0);

  const buyDepth = listings.buys.reduce((sum, b) => sum + b.quantity, 0);
  const sellDepth = listings.sells.reduce((sum, s) => sum + s.quantity, 0);

  return {
    bestBuyPrice: bestBuy.unit_price,
    bestSellPrice: bestSell.unit_price,
    spread,
    spreadPercentage,
    totalBuyOrders,
    totalSellListings,
    buyDepth,
    sellDepth,
  };
}

/**
 * Calculate instant sell revenue (after 15% fees)
 * @param listings - Commerce listings data
 * @param quantity - Quantity to sell
 * @returns Total revenue in copper after fees
 */
export function calculateInstantSellRevenue(listings: CommerceListing, quantity: number): number {
  let remaining = quantity;
  let totalRevenue = 0;

  for (const buy of listings.buys) {
    if (remaining <= 0) break;

    const fillQuantity = Math.min(remaining, buy.quantity);
    totalRevenue += fillQuantity * buy.unit_price;
    remaining -= fillQuantity;
  }

  // Apply 15% Trading Post fee (5% listing + 10% exchange)
  return Math.floor(totalRevenue * 0.85);
}

/**
 * Calculate instant buy cost
 * @param listings - Commerce listings data
 * @param quantity - Quantity to buy
 * @returns Total cost in copper
 */
export function calculateInstantBuyCost(listings: CommerceListing, quantity: number): number {
  let remaining = quantity;
  let totalCost = 0;

  for (const sell of listings.sells) {
    if (remaining <= 0) break;

    const fillQuantity = Math.min(remaining, sell.quantity);
    totalCost += fillQuantity * sell.unit_price;
    remaining -= fillQuantity;
  }

  return totalCost;
}

/**
 * Coin value breakdown
 */
export interface CoinValue {
  /** Gold amount */
  gold: number;
  /** Silver amount */
  silver: number;
  /** Copper amount */
  copper: number;
}

/**
 * Convert copper to gold/silver/copper breakdown
 * @param copper - Total copper amount
 * @returns Coin value breakdown
 */
export function copperToGold(copper: number): CoinValue {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const remainingCopper = copper % 100;

  return {
    gold,
    silver,
    copper: remainingCopper,
  };
}

/**
 * Convert gold/silver/copper to total copper
 * @param value - Coin value breakdown
 * @returns Total copper amount
 */
export function goldToCopper(value: CoinValue): number {
  return value.gold * 10000 + value.silver * 100 + value.copper;
}

/**
 * Format copper as readable currency string
 * @param copper - Total copper amount
 * @returns Formatted string (e.g., "12g 34s 56c")
 */
export function formatCurrency(copper: number): string {
  const { gold, silver, copper: c } = copperToGold(copper);
  const parts: string[] = [];

  if (gold > 0) parts.push(`${gold}g`);
  if (silver > 0) parts.push(`${silver}s`);
  if (c > 0 || parts.length === 0) parts.push(`${c}c`);

  return parts.join(' ');
}

/**
 * Trading profit calculation
 */
export interface TradingProfit {
  /** Buy price per item */
  buyPrice: number;
  /** Sell price per item */
  sellPrice: number;
  /** Revenue after fees */
  revenueAfterFees: number;
  /** Profit per item */
  profitPerItem: number;
  /** Profit margin percentage */
  profitMarginPercent: number;
  /** Whether this is profitable */
  isProfitable: boolean;
}

/**
 * Calculate trading profit after fees
 * @param buyPrice - Price to buy at (in copper)
 * @param sellPrice - Price to sell at (in copper)
 * @returns Profit calculation
 */
export function calculateTradingProfit(buyPrice: number, sellPrice: number): TradingProfit {
  const revenueAfterFees = Math.floor(sellPrice * 0.85);
  const profitPerItem = revenueAfterFees - buyPrice;
  const profitMarginPercent = (profitPerItem / buyPrice) * 100;

  return {
    buyPrice,
    sellPrice,
    revenueAfterFees,
    profitPerItem,
    profitMarginPercent,
    isProfitable: profitPerItem > 0,
  };
}
