import { useState, useMemo } from 'react';
import { useMaterials, useItems, useTradingPostPrices } from '@/api/hooks/useGW2Api';
import { CoinDisplay } from '@/components/trading-post/PriceDisplay';
import { ItemTooltip } from './ItemTooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { TradingPostPrice } from '@/api/types';

// Rarity class mapping for CSS-based styling
const rarityClasses: Record<string, string> = {
  Junk: 'rarity-junk',
  Basic: 'rarity-basic',
  Fine: 'rarity-fine',
  Masterwork: 'rarity-masterwork',
  Rare: 'rarity-rare',
  Exotic: 'rarity-exotic',
  Ascended: 'rarity-ascended',
  Legendary: 'rarity-legendary',
};

const MATERIAL_CATEGORIES: Record<number, string> = {
  5: 'Cooking',
  6: 'Refinement',
  29: 'Component',
  30: 'Trophy',
  32: 'Intermediate Materials',
  38: 'Ascended Materials',
  45: 'Legendary Materials',
  62: 'Guild Decorations',
  63: 'Guild Upgrades',
};

interface MaterialStorageProps {
  searchTerm?: string;
}

export function MaterialStorage({ searchTerm = '' }: MaterialStorageProps) {
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const { data: materials, isLoading: materialsLoading, error: materialsError } = useMaterials();

  const itemIds = useMemo(() => {
    if (!materials) return [];
    return materials.map((mat) => mat.id);
  }, [materials]);

  const { data: items, isLoading: itemsLoading } = useItems(itemIds, {
    enabled: itemIds.length > 0,
  });

  const { data: prices, isLoading: _pricesLoading } = useTradingPostPrices(itemIds, {
    enabled: itemIds.length > 0,
  }) as { data: TradingPostPrice[] | undefined; isLoading: boolean };

  const itemsMap = useMemo(() => {
    if (!items) return new Map();
    return new Map(items.map((item) => [item.id, item]));
  }, [items]);

  const pricesMap = useMemo(() => {
    if (!prices) return new Map();
    return new Map(prices.map((price) => [price.id, price]));
  }, [prices]);

  const groupedMaterials = useMemo(() => {
    if (!materials) return new Map();

    const groups = new Map<number, typeof materials>();
    materials.forEach((mat) => {
      const existing = groups.get(mat.category) || [];
      groups.set(mat.category, [...existing, mat]);
    });

    return groups;
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    if (!searchTerm || !materials) return materials;

    return materials.filter((mat) => {
      const item = itemsMap.get(mat.id);
      if (!item) return false;
      return item.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [materials, searchTerm, itemsMap]);

  const totalValue = useMemo(() => {
    if (!materials || !pricesMap) return 0;

    return materials.reduce((total, mat) => {
      const price = pricesMap.get(mat.id);
      if (!price?.whitelisted) return total;
      return total + (price.sells.unit_price * mat.count);
    }, 0);
  }, [materials, pricesMap]);

  if (materialsLoading || itemsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (materialsError) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-red-500">
            Error loading materials: {materialsError instanceof Error ? materialsError.message : 'Unknown error'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!materials || materials.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">No material storage data available</p>
        </CardContent>
      </Card>
    );
  }

  const displayGroups = searchTerm
    ? new Map([[0, filteredMaterials]])
    : groupedMaterials;

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Material Storage</CardTitle>
          <CardDescription>
            {materials.reduce((sum, mat) => sum + mat.count, 0).toLocaleString()} materials stored
            {totalValue > 0 && (
              <span className="ml-4">
                Total value: <CoinDisplay copper={totalValue} />
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {Array.from(displayGroups.entries()).map(([categoryId, categoryMaterials]) => {
            const categoryName = searchTerm
              ? 'Search Results'
              : MATERIAL_CATEGORIES[categoryId] || `Category ${categoryId}`;

            return (
              <div key={categoryId} className="space-y-3">
                <h3 className="text-sm font-semibold heading-accent pb-2">{categoryName}</h3>
                <div className="grid gap-2">
                  {categoryMaterials.map((mat: { id: number; category: number; count: number }) => {
                    const item = itemsMap.get(mat.id);
                    if (!item) {
                      return (
                        <div
                          key={mat.id}
                          className="flex items-center gap-3 p-2 bg-muted/30 rounded"
                        >
                          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                          <span className="text-sm text-muted-foreground">Loading...</span>
                        </div>
                      );
                    }

                    const price = pricesMap.get(mat.id);
                    const maxStorage = [38, 45].includes(mat.category) ? 250 : 250;
                    const percentage = (mat.count / maxStorage) * 100;
                    const rarityClass = rarityClasses[item.rarity] || 'rarity-junk';

                    return (
                      <button
                        key={mat.id}
                        onClick={() => setSelectedItemId(item.id)}
                        className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded transition-colors cursor-pointer text-left"
                      >
                        <div
                          className={`w-10 h-10 rounded flex-shrink-0 border-2 ${rarityClass} border-rarity`}
                        >
                          {item.icon && (
                            <img
                              loading="lazy"
                              src={item.icon}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline justify-between gap-2 mb-1">
                            <span
                              className={`text-sm font-medium truncate ${rarityClass} text-rarity`}
                            >
                              {item.name}
                            </span>
                            <span className="text-sm font-semibold whitespace-nowrap font-mono">
                              {mat.count.toLocaleString()} / {maxStorage}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-primary transition-all"
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                            {price?.whitelisted && (
                              <CoinDisplay
                                copper={price.sells.unit_price * mat.count}
                                className="text-xs"
                              />
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {selectedItemId && (
        <ItemTooltip
          itemId={selectedItemId}
          open={!!selectedItemId}
          onOpenChange={(open) => !open && setSelectedItemId(null)}
        />
      )}
    </>
  );
}
