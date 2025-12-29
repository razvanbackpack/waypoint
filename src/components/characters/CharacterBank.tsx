import { useMemo, useState } from 'react';
import { Package, Vault, Search, ChevronDown, ChevronRight } from 'lucide-react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useBank, useMaterials, useItems, useTradingPostPrices } from '@/api/hooks/useGW2Api';
import { CoinDisplay } from '@/components/trading-post/PriceDisplay';
import type { Character, Item, MaterialStorage, TradingPostPrice } from '@/api/types';
import { cn } from '@/lib/utils';

interface CharacterBankProps {
  character: Character;
}

const MATERIAL_CATEGORIES: Record<number, string> = {
  5: 'Cooking Materials',
  6: 'Basic Crafting Materials',
  29: 'Intermediate Crafting Materials',
  30: 'Gemstones and Jewels',
  37: 'Advanced Crafting Materials',
  38: 'Festive Materials',
  46: 'Ascended Materials',
  49: 'Cooking Ingredients',
  50: 'Scribing Materials',
};

const ATTRIBUTE_NAMES: Record<string, string> = {
  Power: 'Power',
  Precision: 'Precision',
  Toughness: 'Toughness',
  Vitality: 'Vitality',
  Ferocity: 'Ferocity',
  CritDamage: 'Ferocity',
  ConditionDamage: 'Condition Damage',
  ConditionDuration: 'Expertise',
  Healing: 'Healing Power',
  HealingPower: 'Healing Power',
  BoonDuration: 'Concentration',
  Concentration: 'Concentration',
  Expertise: 'Expertise',
  AgonyResistance: 'Agony Resistance',
};

const getAttributeName = (attr: string): string => ATTRIBUTE_NAMES[attr] || attr;

const formatPrice = (copper: number): string => {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  if (gold > 0) return `${gold}g`;
  if (silver > 0) return `${silver}s`;
  return `${copper % 100}c`;
};

export function CharacterBank({ character: _character }: CharacterBankProps) {
  const [materialSearch, setMaterialSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');
  const [collapsedCategories, setCollapsedCategories] = useState<Set<number>>(new Set());

  const { data: bankSlots, isLoading: bankLoading } = useBank();
  const { data: materials, isLoading: materialsLoading } = useMaterials();

  // Collect all item IDs from bank and materials
  const allItemIds = useMemo(() => {
    const ids = new Set<number>();

    bankSlots?.forEach((slot) => {
      if (slot) {
        ids.add(slot.id);
        slot.upgrades?.forEach((id) => ids.add(id));
        slot.infusions?.forEach((id) => ids.add(id));
      }
    });

    materials?.forEach((mat) => {
      ids.add(mat.id);
    });

    return Array.from(ids);
  }, [bankSlots, materials]);

  const { data: items, isLoading: itemsLoading } = useItems(allItemIds, {
    enabled: allItemIds.length > 0,
  });

  const materialItemIds = useMemo(() => {
    if (!materials) return [];
    return materials.map((mat) => mat.id);
  }, [materials]);

  const bankItemIds = useMemo(() => {
    if (!bankSlots) return [];
    const ids = new Set<number>();
    bankSlots.forEach((slot) => {
      if (slot) {
        ids.add(slot.id);
      }
    });
    return Array.from(ids);
  }, [bankSlots]);

  const allPriceItemIds = useMemo(() => {
    return [...new Set([...materialItemIds, ...bankItemIds])];
  }, [materialItemIds, bankItemIds]);

  const { data: prices, isLoading: _pricesLoading } = useTradingPostPrices(allPriceItemIds, {
    enabled: allPriceItemIds.length > 0,
  }) as { data: TradingPostPrice[] | undefined; isLoading: boolean };

  const itemsMap = useMemo(() => {
    if (!items) return new Map<number, Item>();
    return new Map(items.map((item) => [item.id, item]));
  }, [items]);

  const pricesMap = useMemo(() => {
    if (!prices) return new Map();
    return new Map(prices.map((price) => [price.id, price]));
  }, [prices]);

  const filteredMaterials = useMemo(() => {
    if (!materials) return [];

    return materials.filter((mat) => {
      const item = itemsMap.get(mat.id);
      if (!item) return false;

      const matchesSearch =
        materialSearch === '' || item.name.toLowerCase().includes(materialSearch.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || mat.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [materials, itemsMap, materialSearch, selectedCategory]);

  const groupedMaterials = useMemo(() => {
    const groups = new Map<number, MaterialStorage[]>();
    filteredMaterials.forEach((mat) => {
      const existing = groups.get(mat.category) || [];
      groups.set(mat.category, [...existing, mat]);
    });

    // Sort materials within each category if price sorting is enabled
    if (priceSort !== 'none') {
      groups.forEach((mats, categoryId) => {
        const sorted = [...mats].sort((a, b) => {
          const priceA = pricesMap.get(a.id)?.sells?.unit_price ?? 0;
          const priceB = pricesMap.get(b.id)?.sells?.unit_price ?? 0;
          const totalA = priceA * a.count;
          const totalB = priceB * b.count;
          return priceSort === 'asc' ? totalA - totalB : totalB - totalA;
        });
        groups.set(categoryId, sorted);
      });
    }

    return groups;
  }, [filteredMaterials, priceSort, pricesMap]);

  const totalMaterialValue = useMemo(() => {
    if (!materials || !pricesMap) return 0;

    return materials.reduce((total, mat) => {
      const price = pricesMap.get(mat.id);
      if (!price?.whitelisted) return total;
      return total + price.sells.unit_price * mat.count;
    }, 0);
  }, [materials, pricesMap]);

  const isLoading = bankLoading || materialsLoading || itemsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Bank Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Vault className="w-5 h-5" />
            <CardTitle>Account Bank</CardTitle>
          </div>
          <CardDescription>
            {bankSlots?.filter((slot) => slot !== null).length || 0} / {bankSlots?.length || 0} slots used
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!bankSlots || bankSlots.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No bank data available
            </div>
          ) : (
            <div className="grid grid-cols-10 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 gap-0.5">
              {bankSlots.map((slot, index) => {
                if (!slot) {
                  return (
                    <div
                      key={index}
                      className="item-slot bg-surface-sunken border-muted"
                    />
                  );
                }

                const itemData = itemsMap.get(slot.id);
                if (!itemData) {
                  return (
                    <div
                      key={index}
                      className="item-slot bg-muted border-border/50 flex items-center justify-center"
                    >
                      <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
                    </div>
                  );
                }

                const rarityClass = `rarity-${itemData.rarity.toLowerCase()}`;
                const price = pricesMap.get(slot.id);

                return (
                  <HoverCard key={index}>
                    <HoverCardTrigger asChild>
                      <button className="aspect-square relative cursor-pointer hover:scale-105 hover:z-10 transition-transform">
                        <div
                          className={cn(
                            "item-slot w-full h-full overflow-hidden",
                            rarityClass,
                            "border-rarity",
                            "hover:border-gw2-accent hover:glow-accent-sm"
                          )}
                        >
                          {itemData.icon && (
                            <img
                              loading="lazy"
                              src={itemData.icon}
                              alt={itemData.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        {price?.whitelisted && (
                          <>
                            <div className="absolute top-0 left-0 bg-black/80 text-yellow-300 text-[7px] font-medium px-0.5 rounded-br leading-none py-0.5">
                              {formatPrice(price.sells.unit_price)}
                            </div>
                            {slot.count > 1 && (
                              <div className="absolute bottom-0 left-0 bg-black/80 text-green-400 text-[7px] font-medium px-0.5 rounded-tr leading-none py-0.5">
                                {formatPrice(price.sells.unit_price * slot.count)}
                              </div>
                            )}
                          </>
                        )}
                        {slot.count > 1 && (
                          <div className="absolute bottom-0 right-0 bg-black/75 text-white text-[10px] px-0.5 leading-tight">
                            {slot.count}
                          </div>
                        )}
                      </button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64">
                      <div className="space-y-2">
                        <h4 className={cn("font-semibold", rarityClass, "text-rarity")}>
                          {itemData.name}
                        </h4>
                        {itemData.type && (
                          <p className="text-sm text-muted-foreground">{itemData.type}</p>
                        )}
                        {itemData.level > 0 && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Level:</span> {itemData.level}
                          </p>
                        )}
                        {itemData.rarity && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Rarity:</span> {itemData.rarity}
                          </p>
                        )}
                        {slot.count > 1 && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">Count:</span> {slot.count}
                          </p>
                        )}
                        {itemData.details?.infix_upgrade?.attributes &&
                          itemData.details.infix_upgrade.attributes.length > 0 && (
                            <div className="pt-1 border-t border-border/50">
                              <p className="text-sm font-semibold mb-1">Stats:</p>
                              <div className="text-sm space-y-0.5">
                                {itemData.details.infix_upgrade.attributes.map(
                                  (
                                    attr: { attribute: string; modifier: number },
                                    idx: number
                                  ) => (
                                    <div key={idx} className="flex justify-between">
                                      <span className="text-muted-foreground">
                                        {getAttributeName(attr.attribute)}:
                                      </span>
                                      <span>+{attr.modifier}</span>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Material Storage Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            <CardTitle>Material Storage</CardTitle>
          </div>
          <CardDescription>
            {materials?.reduce((sum, mat) => sum + mat.count, 0).toLocaleString() || 0} materials stored
            {totalMaterialValue > 0 && (
              <span className="ml-4">
                Total value: <CoinDisplay copper={totalMaterialValue} />
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!materials || materials.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No material storage data available
            </div>
          ) : (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search materials..."
                    value={materialSearch}
                    onChange={(e) => setMaterialSearch(e.target.value)}
                    className="pl-8 h-10"
                  />
                </div>
                <Select
                  value={String(selectedCategory)}
                  onValueChange={(value) =>
                    setSelectedCategory(value === 'all' ? 'all' : Number(value))
                  }
                >
                  <SelectTrigger className="w-full sm:w-[200px] h-10">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Object.entries(MATERIAL_CATEGORIES).map(([id, name]) => (
                      <SelectItem key={id} value={id}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={priceSort} onValueChange={(value: 'none' | 'asc' | 'desc') => setPriceSort(value)}>
                  <SelectTrigger className="w-[140px] h-10">
                    <SelectValue placeholder="Sort by price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No sorting</SelectItem>
                    <SelectItem value="asc">Price: Low → High</SelectItem>
                    <SelectItem value="desc">Price: High → Low</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCollapsedCategories(new Set(Object.keys(MATERIAL_CATEGORIES).map(Number)))}
                  >
                    Collapse All
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCollapsedCategories(new Set())}
                  >
                    Expand All
                  </Button>
                </div>
              </div>

              {/* Materials Grid */}
              <div className="space-y-4">
                {Array.from(groupedMaterials.entries()).map(([categoryId, categoryMaterials]) => {
                  const categoryName = MATERIAL_CATEGORIES[categoryId] || `Category ${categoryId}`;

                  return (
                    <div key={categoryId} className="space-y-2">
                      <button
                        onClick={() => {
                          setCollapsedCategories(prev => {
                            const next = new Set(prev);
                            if (next.has(categoryId)) {
                              next.delete(categoryId);
                            } else {
                              next.add(categoryId);
                            }
                            return next;
                          });
                        }}
                        className="flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors w-full text-left border-b pb-1"
                      >
                        {collapsedCategories.has(categoryId) ? (
                          <ChevronRight className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                        {categoryName}
                      </button>
                      {!collapsedCategories.has(categoryId) && (
                        <div className="grid grid-cols-10 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20 gap-0.5">
                        {categoryMaterials.map((mat) => {
                          const item = itemsMap.get(mat.id);
                          if (!item) {
                            return (
                              <div
                                key={mat.id}
                                className="item-slot bg-muted border-border/50 flex items-center justify-center"
                              >
                                <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
                              </div>
                            );
                          }

                          const rarityClass = `rarity-${item.rarity.toLowerCase()}`;
                          const price = pricesMap.get(mat.id);

                          return (
                            <HoverCard key={mat.id}>
                              <HoverCardTrigger asChild>
                                <button className="aspect-square relative cursor-pointer hover:scale-105 hover:z-10 transition-transform">
                                  <div
                                    className={cn(
                                      "item-slot w-full h-full overflow-hidden",
                                      rarityClass,
                                      "border-rarity",
                                      "hover:border-gw2-accent hover:glow-accent-sm"
                                    )}
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
                                  {price?.whitelisted && (
                                    <>
                                      <div className="absolute top-0 left-0 bg-black/80 text-yellow-300 text-[7px] font-medium px-0.5 rounded-br leading-none py-0.5">
                                        {formatPrice(price.sells.unit_price)}
                                      </div>
                                      {mat.count > 1 && (
                                        <div className="absolute bottom-0 left-0 bg-black/80 text-green-400 text-[7px] font-medium px-0.5 rounded-tr leading-none py-0.5">
                                          {formatPrice(price.sells.unit_price * mat.count)}
                                        </div>
                                      )}
                                    </>
                                  )}
                                  {mat.count > 1 && (
                                    <div className="absolute bottom-0 right-0 bg-black/75 text-white text-[10px] px-0.5 leading-tight">
                                      {mat.count}
                                    </div>
                                  )}
                                </button>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-64">
                                <div className="space-y-2">
                                  <h4 className={cn("font-semibold", rarityClass, "text-rarity")}>
                                    {item.name}
                                  </h4>
                                  {item.type && (
                                    <p className="text-sm text-muted-foreground">{item.type}</p>
                                  )}
                                  {item.rarity && (
                                    <p className="text-sm">
                                      <span className="text-muted-foreground">Rarity:</span>{' '}
                                      {item.rarity}
                                    </p>
                                  )}
                                  <p className="text-sm">
                                    <span className="text-muted-foreground">Count:</span>{' '}
                                    {mat.count.toLocaleString()}
                                  </p>
                                  {item.description && (
                                    <p className="text-sm text-muted-foreground border-t pt-2">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          );
                        })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
