import { useState, useMemo } from 'react';
import { useCharacters, useCharacter, useItems } from '@/api/hooks/useGW2Api';
import { ItemTooltip } from './ItemTooltip';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import type { InventoryItem } from '@/api/types';

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

const professionColors: Record<string, string> = {
  Guardian: '#72C1D9',
  Warrior: '#FFD166',
  Engineer: '#D09C59',
  Ranger: '#8CDC82',
  Thief: '#C08F95',
  Elementalist: '#F68A87',
  Mesmer: '#B679D5',
  Necromancer: '#52A76F',
  Revenant: '#D16E5A',
};

interface CharacterInventoryProps {
  searchTerm?: string;
}

export function CharacterInventory({ searchTerm = '' }: CharacterInventoryProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const { data: characterNames, isLoading: namesLoading, error: namesError } = useCharacters();

  const { data: character, isLoading: characterLoading, error: characterError } = useCharacter(
    selectedCharacter || '',
    {
      enabled: !!selectedCharacter,
    }
  );

  const allItemIds = useMemo(() => {
    if (!character) return [];

    const ids = new Set<number>();

    character.equipment?.forEach((eq) => {
      ids.add(eq.id);
      eq.upgrades?.forEach((id) => ids.add(id));
      eq.infusions?.forEach((id) => ids.add(id));
    });

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

  const { data: items, isLoading: itemsLoading } = useItems(allItemIds, {
    enabled: allItemIds.length > 0,
  });

  const itemsMap = useMemo(() => {
    if (!items) return new Map();
    return new Map(items.map((item) => [item.id, item]));
  }, [items]);

  const filteredInventory = useMemo(() => {
    if (!character?.bags || !searchTerm) return character?.bags || [];

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
  }, [character, searchTerm, itemsMap]);

  if (namesLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (namesError) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-red-500">
            Error loading characters: {namesError instanceof Error ? namesError.message : 'Unknown error'}
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!characterNames || characterNames.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-muted-foreground">No characters found</p>
        </CardContent>
      </Card>
    );
  }

  if (!selectedCharacter) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Character Inventory</CardTitle>
          <CardDescription>Select a character to view their inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Select Character
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {characterNames.map((name) => (
                <DropdownMenuItem key={name} onClick={() => setSelectedCharacter(name)}>
                  {name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>
    );
  }

  if (characterLoading || itemsLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (characterError || !character) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-center text-red-500">Error loading character data</p>
          <Button
            variant="outline"
            onClick={() => setSelectedCharacter(null)}
            className="mt-4 mx-auto block"
          >
            Back to Selection
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle
                style={{ color: professionColors[character.profession] || '#FFF' }}
              >
                {character.name}
              </CardTitle>
              <CardDescription>
                Level {character.level} {character.race} {character.profession}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Change Character
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {characterNames.map((name) => (
                  <DropdownMenuItem
                    key={name}
                    onClick={() => setSelectedCharacter(name)}
                    disabled={name === selectedCharacter}
                  >
                    {name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {character.crafting && character.crafting.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Crafting Disciplines</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {character.crafting.map((craft, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded border ${
                      craft.active ? 'border-primary bg-primary/10' : 'border-border'
                    }`}
                  >
                    <div className="font-medium text-sm">{craft.discipline}</div>
                    <div className="text-xs text-muted-foreground">
                      Level {craft.rating}
                      {craft.active && ' (Active)'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {character.equipment && character.equipment.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Equipment</h3>
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {character.equipment.map((eq, idx) => {
                  const item = itemsMap.get(eq.id);
                  if (!item) return null;

                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedItemId(item.id)}
                      className="aspect-square relative group cursor-pointer hover:scale-105 transition-transform"
                      title={`${item.name} (${eq.slot})`}
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
                            src={item.icon}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      {(eq.upgrades?.length || eq.infusions?.length) && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs px-1 rounded-bl">
                          {(eq.upgrades?.length || 0) + (eq.infusions?.length || 0)}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {character.bags && character.bags.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Inventory Bags</h3>
              <div className="space-y-4">
                {filteredInventory.map((bag, bagIdx) => {
                  if (!bag) return null;

                  const bagItem = itemsMap.get(bag.id);

                  return (
                    <div key={bagIdx} className="border rounded-lg p-3">
                      <div className="text-xs text-muted-foreground mb-2">
                        Bag {bagIdx + 1}: {bagItem?.name || 'Unknown'} ({bag.size} slots)
                      </div>
                      <div className="grid grid-cols-8 md:grid-cols-10 gap-1">
                        {bag.inventory.map((item, slotIdx) => {
                          if (!item) {
                            return (
                              <div
                                key={slotIdx}
                                className="aspect-square bg-muted/30 border border-border rounded"
                              />
                            );
                          }

                          const itemData = itemsMap.get(item.id);
                          if (!itemData) {
                            return (
                              <div
                                key={slotIdx}
                                className="aspect-square bg-muted border border-border rounded flex items-center justify-center"
                              >
                                <div className="animate-spin h-3 w-3 border-2 border-primary border-t-transparent rounded-full" />
                              </div>
                            );
                          }

                          return (
                            <button
                              key={slotIdx}
                              onClick={() => setSelectedItemId(itemData.id)}
                              className="aspect-square relative group cursor-pointer hover:scale-105 transition-transform"
                              title={itemData.name}
                            >
                              <div
                                className="w-full h-full rounded overflow-hidden"
                                style={{
                                  borderWidth: '2px',
                                  borderStyle: 'solid',
                                  borderColor: rarityColors[itemData.rarity] || '#AAA',
                                }}
                              >
                                {itemData.icon && (
                                  <img
                                    src={itemData.icon}
                                    alt={itemData.name}
                                    className="w-full h-full object-cover"
                                  />
                                )}
                              </div>
                              {item.count > 1 && (
                                <div className="absolute bottom-0 right-0 bg-black/75 text-white text-xs px-1 rounded-tl">
                                  {item.count}
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
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
