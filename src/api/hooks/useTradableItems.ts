import { useState, useEffect } from 'react';
import { getApiClient } from '../client';
import type { Item } from '../types';
import { commerceEndpoints, itemsEndpoints } from '../endpoints';

const CACHE_KEY = 'gw2-tradable-items-cache';
const CACHE_VERSION = 1;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface CachedData {
  version: number;
  timestamp: number;
  items: Item[];
}

interface UseTradableItemsReturn {
  items: Item[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  searchItems: (query: string, limit?: number) => Item[];
}

/**
 * Hook to fetch and cache all tradeable items from the Trading Post
 * Uses localStorage for persistence and only fetches items that can be traded
 */
export function useTradableItems(): UseTradableItemsReturn {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadTradableItems = async () => {
      try {
        // Try to load from cache first
        const cached = loadFromCache();
        if (cached) {
          setItems(cached);
          setIsLoading(false);
          return;
        }

        // Cache miss or expired - fetch from API
        setIsLoading(true);
        const client = getApiClient();

        // Get all tradeable item IDs (only items on Trading Post)
        const priceData = await client.get<Array<{ id: number }>>(commerceEndpoints.prices());
        const tradeableItemIds = priceData.map((p) => p.id);

        console.log(`Fetching ${tradeableItemIds.length} tradeable items...`);

        // Fetch items in batches (API supports up to 200 per request)
        const batchSize = 200;
        const allItems: Item[] = [];

        for (let i = 0; i < tradeableItemIds.length; i += batchSize) {
          const batch = tradeableItemIds.slice(i, i + batchSize);
          const batchItems = await client.getWithIds<Item[]>(
            itemsEndpoints.items(),
            batch
          );
          allItems.push(...batchItems);

          // Log progress for large fetches
          if ((i + batchSize) % 1000 === 0 || i + batchSize >= tradeableItemIds.length) {
            console.log(
              `Loaded ${Math.min(i + batchSize, tradeableItemIds.length)} / ${
                tradeableItemIds.length
              } items`
            );
          }
        }

        // Save to cache
        saveToCache(allItems);
        setItems(allItems);
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to load tradeable items:', err);
        setIsError(true);
        setError(err instanceof Error ? err : new Error('Unknown error'));
        setIsLoading(false);
      }
    };

    loadTradableItems();
  }, []);

  const searchItems = (query: string, limit = 20): Item[] => {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchLower = query.toLowerCase();

    return items
      .filter((item) => item.name.toLowerCase().includes(searchLower))
      .map((item) => ({
        ...item,
        score: item.name.toLowerCase().indexOf(searchLower),
      }))
      .sort((a, b) => {
        // Sort by score (position of match) and then alphabetically
        if (a.score !== b.score) return a.score - b.score;
        return a.name.localeCompare(b.name);
      })
      .slice(0, limit);
  };

  return {
    items,
    isLoading,
    isError,
    error,
    searchItems,
  };
}

function loadFromCache(): Item[] | null {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (!stored) return null;

    const data: CachedData = JSON.parse(stored);

    // Check version
    if (data.version !== CACHE_VERSION) {
      console.log('Cache version mismatch, invalidating cache');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    // Check TTL
    const age = Date.now() - data.timestamp;
    if (age > CACHE_TTL_MS) {
      console.log('Cache expired, invalidating cache');
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    console.log(
      `Loaded ${data.items.length} items from cache (age: ${Math.round(age / 1000 / 60)} minutes)`
    );
    return data.items;
  } catch (error) {
    console.error('Failed to load from cache:', error);
    localStorage.removeItem(CACHE_KEY);
    return null;
  }
}

function saveToCache(items: Item[]): void {
  try {
    const data: CachedData = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      items,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
    console.log(`Cached ${items.length} items to localStorage`);
  } catch (error) {
    console.error('Failed to save to cache:', error);
    // If localStorage is full, try to clear old data
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded, clearing cache');
      localStorage.removeItem(CACHE_KEY);
    }
  }
}
