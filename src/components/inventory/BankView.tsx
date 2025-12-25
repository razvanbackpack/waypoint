import { useState, useMemo } from 'react';
import { useBank, useItems, useTradingPostPrices } from '@/api/hooks/useGW2Api';
import { CoinDisplay } from '@/components/trading-post/PriceDisplay';
import { ItemTooltip } from './ItemTooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { TradingPostPrice } from '@/api/types';

const rarityColors: Record<string, string> = {
  Junk: '#AAA',
  Basic: '#000',
  Fine: '#62A4DA',
  Masterwork: '#1a9306',
  Rare: '#fcd00b',
  Exotic: '#ffa405',
  Ascended: '#fb3e8d',
  Legendary: '#4C139D',
};

interface BankViewProps {
  searchTerm?: string;
}

export function BankView({ searchTerm = '' }: BankViewProps) {
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const { data: bankSlots, isLoading: bankLoading, error: bankError } = useBank();

  const itemIds = useMemo(() => {
    if (!bankSlots) return [];
    return bankSlots
      .filter((slot) => slot !== null)
      .map((slot) => slot!.id)
      .filter((id, index, self) => self.indexOf(id) === index);
  }, [bankSlots]);

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

  const filteredSlots = useMemo(() => {
    if (!bankSlots) return [];
    if (!searchTerm) return bankSlots;

    return bankSlots.map((slot) => {
      if (!slot) return null;
      const item = itemsMap.get(slot.id);
      if (!item) return slot;

      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch ? slot : null;
    });
  }, [bankSlots, searchTerm, itemsMap]);

  const totalValue = useMemo(() => {
    if (!bankSlots || !pricesMap) return 0;

    return bankSlots.reduce((total, slot) => {
      if (!slot) return total;
      const price = pricesMap.get(slot.id);
      if (!price?.whitelisted) return total;
      return total + (price.sells.unit_price * slot.count);
    }, 0);
  }, [bankSlots, pricesMap]);

  if (bankLoading || itemsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (bankError) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-red-500">
            Error loading bank: {bankError instanceof Error ? bankError.message : 'Unknown error'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!bankSlots || bankSlots.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">No bank data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Bank</CardTitle>
          <CardDescription>
            {bankSlots.filter((slot) => slot !== null).length} / {bankSlots.length} slots used
            {totalValue > 0 && (
              <span className="ml-4">
                Total value: <CoinDisplay copper={totalValue} />
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-8 md:grid-cols-12 lg:grid-cols-16 gap-1">
            {filteredSlots.map((slot, index) => {
              if (!slot) {
                return (
                  <div
                    key={index}
                    className="aspect-square bg-muted/30 border border-border rounded flex items-center justify-center"
                  >
                    <div className="w-full h-full opacity-20" />
                  </div>
                );
              }

              const item = itemsMap.get(slot.id);
              if (!item) {
                return (
                  <div
                    key={index}
                    className="aspect-square bg-muted border border-border rounded flex items-center justify-center"
                  >
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                );
              }

              return (
                <button
                  key={index}
                  onClick={() => setSelectedItemId(item.id)}
                  className="aspect-square relative group cursor-pointer hover:scale-105 transition-transform"
                  title={item.name}
                >
                  <div
                    className="w-full h-full rounded overflow-hidden"
                    style={{
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: rarityColors[item.rarity] || '#AAA',
                    }}
                  >
                    {item.icon && (
                      <img
                        loading="lazy"
                        src={item.icon}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  {slot.count > 1 && (
                    <div className="absolute bottom-0 right-0 bg-black/75 text-white text-xs px-1 rounded-tl">
                      {slot.count}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded pointer-events-none" />
                </button>
              );
            })}
          </div>
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
