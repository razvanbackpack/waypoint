import { useMemo } from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { useItems } from '@/api/hooks/useGW2Api';
import type { Character, Item } from '@/api/types';
import { getRarityColor } from '@/lib/professionColors';

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
  Armor: 'Armor',
  Health: 'Health',
  CritChance: 'Critical Chance',
};

const getAttributeName = (attr: string): string => ATTRIBUTE_NAMES[attr] || attr;

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
    const rarityColor = item ? getRarityColor(item.rarity) : undefined;
    const upgradeItems = equipment?.upgrades?.map((id) => itemsMap.get(id)).filter(Boolean);
    const infusionItems = equipment?.infusions?.map((id) => itemsMap.get(id)).filter(Boolean);

    // Get stats - either from equipped item's selected stats or from item's default stats
    const equipmentStats = equipment?.stats?.attributes;
    const itemStats = item?.details?.infix_upgrade?.attributes;

    if (!item) {
      return (
        <div key={slot} className="flex items-center gap-3 py-1">
          <div
            className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
            style={{
              border: '1px solid hsl(var(--border))',
              backgroundColor: 'hsl(var(--muted))',
            }}
          >
            <div className="text-xs text-muted-foreground">-</div>
          </div>
          <span className="text-sm text-muted-foreground">{SLOT_LABELS[slot] || slot}</span>
        </div>
      );
    }

    return (
      <HoverCard key={slot}>
        <HoverCardTrigger asChild>
          <button className="flex items-center gap-3 py-1 w-full hover:bg-muted/50 rounded px-2 -mx-2 transition-colors text-left cursor-pointer">
            <div
              className="w-10 h-10 rounded overflow-hidden flex items-center justify-center flex-shrink-0"
              style={{
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: rarityColor,
                backgroundColor: 'hsl(var(--muted))',
              }}
            >
              <img
                loading="lazy"
                src={item.icon}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium" style={{ color: rarityColor }}>
              {item.name}
            </span>
          </button>
        </HoverCardTrigger>
        <HoverCardContent className="w-72">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold" style={{ color: rarityColor }}>
                {item.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {SLOT_LABELS[slot] || slot}
              </p>
            </div>

            {item.type && (
              <div className="text-sm">
                <span className="text-muted-foreground">Type: </span>
                {item.type}
              </div>
            )}

            {item.level && (
              <div className="text-sm">
                <span className="text-muted-foreground">Level: </span>
                {item.level}
              </div>
            )}

            {(equipmentStats || (itemStats && itemStats.length > 0)) && (
              <div>
                <p className="text-sm font-semibold mb-1">Stats:</p>
                <div className="text-sm space-y-0.5">
                  {equipmentStats ? (
                    Object.entries(equipmentStats).map(([attr, value], idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-muted-foreground">{getAttributeName(attr)}:</span>
                        <span>+{value}</span>
                      </div>
                    ))
                  ) : (
                    itemStats?.map((attr, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="text-muted-foreground">{getAttributeName(attr.attribute)}:</span>
                        <span>+{attr.modifier}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {upgradeItems && upgradeItems.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2">Upgrades:</p>
                <div className="space-y-2">
                  {upgradeItems.map((upgrade, idx) =>
                    upgrade ? (
                      <div key={`upgrade-${idx}`} className="flex items-center gap-2">
                        <img
                          loading="lazy"
                          src={upgrade.icon}
                          alt={upgrade.name}
                          className="w-6 h-6 rounded border border-border"
                        />
                        <span className="text-sm">{upgrade.name}</span>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}

            {infusionItems && infusionItems.length > 0 && (
              <div>
                <p className="text-sm font-semibold mb-2">Infusions:</p>
                <div className="space-y-2">
                  {infusionItems.map((infusion, idx) =>
                    infusion ? (
                      <div key={`infusion-${idx}`} className="flex items-center gap-2">
                        <img
                          loading="lazy"
                          src={infusion.icon}
                          alt={infusion.name}
                          className="w-6 h-6 rounded border border-purple-500"
                        />
                        <span className="text-sm">{infusion.name}</span>
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>
        </HoverCardContent>
      </HoverCard>
    );
  };

  return (
    <div className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1: Armor + Aquatic */}
          <div className="space-y-4">
            {/* Armor Section */}
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">ARMOR</h4>
              {EQUIPMENT_SLOTS.armor.map(renderSlotItem)}
            </div>

            {/* Aquatic Section - only show if equipped */}
            {(getEquipmentBySlot('WeaponAquaticA') || getEquipmentBySlot('WeaponAquaticB')) && (
              <div className="space-y-1">
                <h4 className="font-semibold text-sm text-muted-foreground mb-2">AQUATIC</h4>
                {renderSlotItem('WeaponAquaticA')}
                {renderSlotItem('WeaponAquaticB')}
              </div>
            )}
          </div>

          {/* Column 2: Trinkets + Weapons */}
          <div className="space-y-4">
            {/* Trinkets Section */}
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">TRINKETS</h4>
              {EQUIPMENT_SLOTS.trinkets.map(renderSlotItem)}
            </div>

            {/* Weapons Section - only show equipped weapons */}
            <div className="space-y-1">
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">WEAPONS</h4>
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
