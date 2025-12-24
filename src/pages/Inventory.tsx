import { useState, useMemo } from 'react';
import { useApiKey } from '@/api/hooks/useApiKey';
import { useBank, useMaterials, useCharacters, useTradingPostPrices } from '@/api/hooks/useGW2Api';
import { ApiKeySetup } from '@/components/inventory/ApiKeySetup';
import { BankView } from '@/components/inventory/BankView';
import { MaterialStorage } from '@/components/inventory/MaterialStorage';
import { CharacterInventory } from '@/components/inventory/CharacterInventory';
import { CoinDisplay } from '@/components/trading-post/PriceDisplay';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { TradingPostPrice } from '@/api/types';

export function Inventory() {
  const { hasApiKey } = useApiKey();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('bank');

  const { data: bankSlots } = useBank({ enabled: hasApiKey });
  const { data: materials } = useMaterials({ enabled: hasApiKey });
  const { data: characterNames } = useCharacters({ enabled: hasApiKey });

  const allItemIds = useMemo(() => {
    const ids = new Set<number>();

    bankSlots?.forEach((slot) => {
      if (slot) ids.add(slot.id);
    });

    materials?.forEach((mat) => {
      ids.add(mat.id);
    });

    return Array.from(ids);
  }, [bankSlots, materials]);

  const { data: prices } = useTradingPostPrices(allItemIds, {
    enabled: allItemIds.length > 0,
  }) as { data: TradingPostPrice[] | undefined; isLoading: boolean };

  const pricesMap = useMemo(() => {
    if (!prices) return new Map();
    return new Map(prices.map((price) => [price.id, price]));
  }, [prices]);

  const totalAccountValue = useMemo(() => {
    let total = 0;

    bankSlots?.forEach((slot) => {
      if (!slot) return;
      const price = pricesMap.get(slot.id);
      if (price?.whitelisted) {
        total += price.sells.unit_price * slot.count;
      }
    });

    materials?.forEach((mat) => {
      const price = pricesMap.get(mat.id);
      if (price?.whitelisted) {
        total += price.sells.unit_price * mat.count;
      }
    });

    return total;
  }, [bankSlots, materials, pricesMap]);

  if (!hasApiKey) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#C9A227' }}>
            Inventory & Bank Viewer
          </h2>
          <p className="text-muted-foreground">
            View and manage your Guild Wars 2 inventory, bank, and material storage
          </p>
        </div>
        <ApiKeySetup />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2" style={{ color: '#C9A227' }}>
            Inventory & Bank Viewer
          </h2>
          <p className="text-muted-foreground">
            View and manage your Guild Wars 2 inventory, bank, and material storage
          </p>
        </div>
        {totalAccountValue > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Total Account Value</div>
                <CoinDisplay copper={totalAccountValue} className="text-lg font-bold" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="bank">Bank</TabsTrigger>
          <TabsTrigger value="materials">Material Storage</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="shared">Shared Inventory</TabsTrigger>
        </TabsList>

        <TabsContent value="bank" className="mt-6">
          <BankView searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          <MaterialStorage searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="characters" className="mt-6">
          <CharacterInventory searchTerm={searchTerm} />
        </TabsContent>

        <TabsContent value="shared" className="mt-6">
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Shared Inventory</h3>
                <p className="text-muted-foreground">
                  Shared inventory slots are accessible across all characters. This feature requires
                  additional API endpoints and will be implemented in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {characterNames && characterNames.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-sm text-muted-foreground">
              {characterNames.length} character{characterNames.length !== 1 ? 's' : ''} found
              {bankSlots && (
                <>
                  {' • '}
                  {bankSlots.filter((slot) => slot !== null).length} / {bankSlots.length} bank slots used
                </>
              )}
              {materials && (
                <>
                  {' • '}
                  {materials.reduce((sum, mat) => sum + mat.count, 0).toLocaleString()} materials stored
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
