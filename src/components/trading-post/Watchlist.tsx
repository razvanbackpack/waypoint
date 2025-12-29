import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useItems, useTradingPostPrices } from '@/api/hooks/useGW2Api';
import { CoinDisplay } from './PriceDisplay';
import { Trash2, RefreshCw } from 'lucide-react';
import type { CommercePrice } from '@/api/types/commerce';
import type { Item } from '@/api/types';

const WATCHLIST_KEY = 'gw2-tools-watchlist';
const REFRESH_INTERVAL = 30000; // 30 seconds

export function Watchlist() {
  const [watchedItemIds, setWatchedItemIds] = useState<number[]>([]);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Load watchlist from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWatchedItemIds(parsed);
        }
      } catch (error) {
        console.error('Failed to load watchlist:', error);
      }
    }
  }, []);

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchedItemIds));
  }, [watchedItemIds]);

  // Fetch item data
  const { data: items, isLoading: itemsLoading } = useItems(watchedItemIds) as {
    data: Item[] | undefined;
    isLoading: boolean;
  };

  // Fetch prices with auto-refresh
  const { data: prices, isLoading: pricesLoading, refetch } = useTradingPostPrices(
    watchedItemIds,
    {
      refetchInterval: autoRefresh ? REFRESH_INTERVAL : false,
    }
  ) as {
    data: CommercePrice[] | undefined;
    isLoading: boolean;
    refetch: () => void;
  };


  const removeItem = (itemId: number) => {
    setWatchedItemIds((prev) => prev.filter((id) => id !== itemId));
  };

  const handleManualRefresh = () => {
    refetch();
  };

  if (watchedItemIds.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Watchlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>Your watchlist is empty</p>
            <p className="text-sm mt-2">Search for items above to add them to your watchlist</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isLoading = itemsLoading || pricesLoading;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Watchlist</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant={autoRefresh ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              Auto-refresh {autoRefresh ? 'ON' : 'OFF'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Buy</TableHead>
              <TableHead>Sell</TableHead>
              <TableHead>Profit</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {watchedItemIds.map((itemId) => {
              const item = items?.find((i) => i.id === itemId);
              const price = prices?.find((p) => p.id === itemId);

              if (!item || !price) {
                return (
                  <TableRow key={itemId}>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      Loading...
                    </TableCell>
                  </TableRow>
                );
              }

              // Calculate profit (instant sell to buy order after fees)
              const revenue = Math.floor(price.buys.unit_price * 0.85);
              const profit = revenue - price.sells.unit_price;
              const isProfitable = profit > 0;

              const rarityClass = `rarity-${item.rarity.toLowerCase()}`;

              return (
                <TableRow key={itemId} className="transition-colors duration-200 hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {item.icon && (
                        <img
                          src={item.icon}
                          alt={item.name}
                          className={`w-8 h-8 rounded border-2 ${rarityClass} rarity-border`}
                        />
                      )}
                      <span className="font-medium">{item.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <CoinDisplay copper={price.buys.unit_price} />
                  </TableCell>
                  <TableCell>
                    <CoinDisplay copper={price.sells.unit_price} />
                  </TableCell>
                  <TableCell>
                    <CoinDisplay
                      copper={Math.abs(profit)}
                      className={isProfitable ? 'text-success' : 'text-destructive'}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeItem(itemId)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <div className="text-xs text-muted-foreground mt-4">
          Auto-refresh every 30 seconds when enabled
        </div>
      </CardContent>
    </Card>
  );
}

// Export function to add items (to be used by parent)
export function useWatchlist() {
  const [watchedItemIds, setWatchedItemIds] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setWatchedItemIds(parsed);
        }
      } catch (error) {
        console.error('Failed to load watchlist:', error);
      }
    }
  }, []);

  const addToWatchlist = (itemId: number) => {
    setWatchedItemIds((prev) => {
      if (prev.includes(itemId)) return prev;
      const updated = [...prev, itemId];
      localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return { watchedItemIds, addToWatchlist };
}
