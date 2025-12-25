import { useMemo } from 'react';
import { useItems, useItemStats } from '@/api/hooks/useGW2Api';
import { ItemPopover } from '@/components/shared/ItemPopover';
import type { Character, Item } from '@/api/types';
import { getRarityColor } from '@/lib/professionColors';

interface CharacterInventoryProps {
  character: Character;
  searchTerm?: string;
}

export function CharacterInventory({ character, searchTerm = '' }: CharacterInventoryProps) {
  const allItemIds = useMemo(() => {
    const ids = new Set<number>();

    character.bags?.forEach((bag) => {
      if (bag) {
        ids.add(bag.id);
        bag.inventory.forEach((item) => {
          if (item) {
            ids.add(item.id);
            item.upgrades?.forEach((id) => ids.add(id));
            item.infusions?.forEach((id) => ids.add(id));
          }
        });
      }
    });

    return Array.from(ids);
  }, [character]);

  const { data: items, isLoading } = useItems(allItemIds, {
    enabled: allItemIds.length > 0,
  });

  const itemsMap = useMemo(() => {
    if (!items) return new Map<number, Item>();
    return new Map(items.map((item) => [item.id, item]));
  }, [items]);

  const statIds = useMemo(() => {
    const ids = new Set<number>();
    character.bags?.forEach((bag) => {
      if (bag) {
        bag.inventory.forEach((item) => {
          if (item?.stats?.id) {
            ids.add(item.stats.id);
          }
        });
      }
    });
    return Array.from(ids);
  }, [character]);

  const { data: itemStats } = useItemStats(statIds, {
    enabled: statIds.length > 0
  });

  const statsMap = useMemo(() =>
    new Map(itemStats?.map(s => [s.id, s.name]) || []),
    [itemStats]
  );

  const filteredBags = useMemo(() => {
    if (!character.bags || !searchTerm) return character.bags || [];

    return character.bags.map((bag) => {
      if (!bag) return null;

      const filteredItems = bag.inventory.map((item) => {
        if (!item) return null;
        const itemData = itemsMap.get(item.id);
        if (!itemData) return item;

        const matchesSearch = itemData.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch ? item : null;
      });

      return { ...bag, inventory: filteredItems };
    });
  }, [character.bags, searchTerm, itemsMap]);

  if (!character.bags || character.bags.length === 0) {
    return (
      <div className="py-12">
        <div className="text-center text-muted-foreground">
          No inventory bags found
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Left column - bag icons */}
      <div className="flex flex-col gap-1">
        {filteredBags.map((bag, bagIdx) => {
          if (!bag) return null;
          const bagItem = itemsMap.get(bag.id);
          const bagRarity = bagItem ? getRarityColor(bagItem.rarity) : undefined;

          return (
            <div
              key={bagIdx}
              className="w-10 h-10 rounded flex-shrink-0 relative"
              style={bagRarity ? { border: `2px solid ${bagRarity}` } : { border: '2px solid hsl(var(--border))' }}
              title={bagItem?.name || `Bag ${bagIdx + 1}`}
            >
              {bagItem?.icon && (
                <img loading="lazy" src={bagItem.icon} alt={bagItem.name} className="w-full h-full object-cover rounded" />
              )}
              <div className="absolute -bottom-1 -right-1 bg-black/80 text-white text-[10px] px-1 rounded leading-tight">
                {bag.size}
              </div>
            </div>
          );
        })}
      </div>

      {/* Right column - all slots in one continuous grid */}
      <div className="flex-1">
        <div className="grid grid-cols-10 md:grid-cols-12 lg:grid-cols-16 xl:grid-cols-20">
          {filteredBags.flatMap((bag, bagIdx) => {
            if (!bag) return [];
            return bag.inventory.map((item, slotIdx) => {
              const key = `${bagIdx}-${slotIdx}`;

              if (!item) {
                return (
                  <div key={key} className="aspect-square bg-muted/30 border border-border/50" />
                );
              }

              const itemData = itemsMap.get(item.id);
              if (!itemData) {
                return (
                  <div key={key} className="aspect-square bg-muted border border-border/50 flex items-center justify-center">
                    <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
                  </div>
                );
              }

              const rarityColor = getRarityColor(itemData.rarity);
              const statName = item.stats?.id ? statsMap.get(item.stats.id) : undefined;
              const upgradeItems = item.upgrades?.map((id) => itemsMap.get(id)).filter(Boolean) as Item[];
              const infusionItems = item.infusions?.map((id) => itemsMap.get(id)).filter(Boolean) as Item[];

              return (
                <ItemPopover
                  key={key}
                  item={itemData}
                  statName={statName}
                  count={item.count}
                  stats={item.stats?.attributes}
                  upgrades={upgradeItems}
                  infusions={infusionItems}
                >
                  <button
                    className="aspect-square relative cursor-pointer hover:scale-110 hover:z-10 transition-transform"
                  >
                    <div
                      className="w-full h-full overflow-hidden"
                      style={{ border: `2px solid ${rarityColor}` }}
                    >
                      {itemData.icon && (
                        <img loading="lazy" src={itemData.icon} alt={itemData.name} className="w-full h-full object-cover" />
                      )}
                    </div>
                    {item.count > 1 && (
                      <div className="absolute bottom-0 right-0 bg-black/75 text-white text-[10px] px-0.5 leading-tight">
                        {item.count}
                      </div>
                    )}
                  </button>
                </ItemPopover>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}
