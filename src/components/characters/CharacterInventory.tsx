import { useMemo } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useItems } from '@/api/hooks/useGW2Api';
import type { Character, Item } from '@/api/types';
import { getRarityColor } from '@/lib/professionColors';

interface CharacterInventoryProps {
  character: Character;
  searchTerm?: string;
}

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

              return (
                <HoverCard key={key}>
                  <HoverCardTrigger asChild>
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
                  </HoverCardTrigger>
                  <HoverCardContent className="w-64">
                    <div className="space-y-2">
                      <h4 className="font-semibold" style={{ color: rarityColor }}>{itemData.name}</h4>
                      {itemData.type && (
                        <p className="text-sm text-muted-foreground">{itemData.type}</p>
                      )}
                      {itemData.level > 0 && (
                        <p className="text-sm"><span className="text-muted-foreground">Level:</span> {itemData.level}</p>
                      )}
                      {itemData.rarity && (
                        <p className="text-sm"><span className="text-muted-foreground">Rarity:</span> {itemData.rarity}</p>
                      )}
                      {item.count > 1 && (
                        <p className="text-sm"><span className="text-muted-foreground">Count:</span> {item.count}</p>
                      )}
                      {itemData.details?.infix_upgrade?.attributes && itemData.details.infix_upgrade.attributes.length > 0 && (
                        <div className="pt-1 border-t border-border/50">
                          <p className="text-sm font-semibold mb-1">Stats:</p>
                          <div className="text-sm space-y-0.5">
                            {itemData.details.infix_upgrade.attributes.map((attr: { attribute: string; modifier: number }, idx: number) => (
                              <div key={idx} className="flex justify-between">
                                <span className="text-muted-foreground">{getAttributeName(attr.attribute)}:</span>
                                <span>+{attr.modifier}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </HoverCardContent>
                </HoverCard>
              );
            });
          })}
        </div>
      </div>
    </div>
  );
}
