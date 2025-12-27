import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useItems, useItemStats } from '@/api/hooks/useGW2Api';
import { ItemPopover } from '@/components/shared/ItemPopover';
import type { Character, Item } from '@/api/types';
import { cn } from '@/lib/utils';

interface CharacterEquipmentProps {
  character: Character;
}

const EQUIPMENT_SLOTS = {
  armor: ['Helm', 'Shoulders', 'Coat', 'Gloves', 'Leggings', 'Boots'],
  weapons: ['WeaponA1', 'WeaponA2', 'WeaponB1', 'WeaponB2'],
  trinkets: ['Backpack', 'Accessory1', 'Accessory2', 'Amulet', 'Ring1', 'Ring2'],
  aquatic: ['HelmAquatic', 'WeaponAquaticA', 'WeaponAquaticB'],
  other: ['Relic'],
};

const SLOT_LABELS: Record<string, string> = {
  Helm: 'Helmet',
  Shoulders: 'Shoulders',
  Coat: 'Chest',
  Gloves: 'Gloves',
  Leggings: 'Legs',
  Boots: 'Boots',
  WeaponA1: 'Weapon 1 (Set A)',
  WeaponA2: 'Weapon 2 (Set A)',
  WeaponB1: 'Weapon 1 (Set B)',
  WeaponB2: 'Weapon 2 (Set B)',
  Backpack: 'Backpack',
  Accessory1: 'Accessory 1',
  Accessory2: 'Accessory 2',
  Amulet: 'Amulet',
  Ring1: 'Ring 1',
  Ring2: 'Ring 2',
  HelmAquatic: 'Aquatic Helmet',
  WeaponAquaticA: 'Aquatic Weapon A',
  WeaponAquaticB: 'Aquatic Weapon B',
  Relic: 'Relic',
};

export function CharacterEquipment({ character }: CharacterEquipmentProps) {
  const allItemIds = useMemo(() => {
    const ids = new Set<number>();

    character.equipment?.forEach((eq) => {
      ids.add(eq.id);
      eq.upgrades?.forEach((id) => ids.add(id));
      eq.infusions?.forEach((id) => ids.add(id));
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

  const statIds = useMemo(() =>
    character.equipment?.map(eq => eq.stats?.id).filter(Boolean) as number[] || [],
    [character]
  );

  const { data: itemStats } = useItemStats(statIds, {
    enabled: statIds.length > 0
  });

  const statsMap = useMemo(() =>
    new Map(itemStats?.map(s => [s.id, s.name]) || []),
    [itemStats]
  );

  const getEquipmentBySlot = (slot: string) =>
    character.equipment?.find((eq) => eq.slot === slot);

  if (!character.equipment || character.equipment.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-muted-foreground">
            No equipment found
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const renderSlotItem = (slot: string) => {
    const equipment = getEquipmentBySlot(slot);
    const item = equipment ? itemsMap.get(equipment.id) : undefined;
    const rarityClass = item ? `rarity-${item.rarity.toLowerCase()}` : '';
    const upgradeItems = equipment?.upgrades?.map((id) => itemsMap.get(id)).filter(Boolean);
    const infusionItems = equipment?.infusions?.map((id) => itemsMap.get(id)).filter(Boolean);
    const statName = equipment?.stats?.id ? statsMap.get(equipment.stats.id) : undefined;

    // Get stats - either from equipped item's selected stats or from item's default stats
    const equipmentStats = equipment?.stats?.attributes;

    if (!item) {
      return (
        <div key={slot} className="flex items-center gap-3 py-1">
          <div className="item-slot w-10 h-10 flex items-center justify-center flex-shrink-0 bg-surface-sunken border-muted">
            <div className="text-xs text-muted-foreground">-</div>
          </div>
          <span className="text-sm text-muted-foreground">{SLOT_LABELS[slot] || slot}</span>
        </div>
      );
    }

    return (
      <ItemPopover
        key={slot}
        item={item}
        statName={statName}
        stats={equipmentStats}
        upgrades={upgradeItems as Item[]}
        infusions={infusionItems as Item[]}
      >
        <button className="flex items-center gap-3 py-1 w-full hover:bg-muted/50 rounded px-2 -mx-2 transition-colors text-left cursor-pointer">
          <div
            className={cn(
              "item-slot w-10 h-10 overflow-hidden flex items-center justify-center flex-shrink-0",
              rarityClass,
              "border-rarity",
              "hover:scale-105 hover:border-gw2-gold hover:glow-gold-sm"
            )}
          >
            <img
              loading="lazy"
              src={item.icon}
              alt={item.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className={cn("text-sm font-medium", rarityClass, "text-rarity")}>
              {item.name}
            </span>
            {statName && (
              <span className="text-xs text-muted-foreground">{statName}</span>
            )}
          </div>
        </button>
      </ItemPopover>
    );
  };

  return (
    <div className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1: Armor + Aquatic */}
          <div className="space-y-4">
            {/* Armor Section */}
            <div className="space-y-1">
              <h4 className="heading-accent font-semibold text-sm text-muted-foreground mb-2">ARMOR</h4>
              {EQUIPMENT_SLOTS.armor.map(renderSlotItem)}
            </div>

            {/* Aquatic Section - only show if equipped */}
            {(getEquipmentBySlot('WeaponAquaticA') || getEquipmentBySlot('WeaponAquaticB')) && (
              <div className="space-y-1">
                <h4 className="heading-accent font-semibold text-sm text-muted-foreground mb-2">AQUATIC</h4>
                {renderSlotItem('WeaponAquaticA')}
                {renderSlotItem('WeaponAquaticB')}
              </div>
            )}
          </div>

          {/* Column 2: Trinkets + Weapons */}
          <div className="space-y-4">
            {/* Trinkets Section */}
            <div className="space-y-1">
              <h4 className="heading-accent font-semibold text-sm text-muted-foreground mb-2">TRINKETS</h4>
              {EQUIPMENT_SLOTS.trinkets.map(renderSlotItem)}
            </div>

            {/* Weapons Section - only show equipped weapons */}
            <div className="space-y-1">
              <h4 className="heading-accent font-semibold text-sm text-muted-foreground mb-2">WEAPONS</h4>
              {EQUIPMENT_SLOTS.weapons.filter(slot => {
                // Hide WeaponA2 or WeaponB2 if they're empty
                if (slot === 'WeaponA2' || slot === 'WeaponB2') {
                  return getEquipmentBySlot(slot) !== undefined;
                }
                return true;
              }).map(renderSlotItem)}
            </div>
          </div>
        </div>
    </div>
  );
}
