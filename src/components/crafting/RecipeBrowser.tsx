import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2, X, HelpCircle, ChevronLeft, ChevronRight, ChevronDown, Check, Pin } from 'lucide-react';
import { useMaterials, useBank, useCharacters, queryKeys } from '@/api/hooks/useGW2Api';
import { useApiKey } from '@/api/hooks/useApiKey';
import { getApiClient } from '@/api/client';
import { accountEndpoints } from '@/api/endpoints';
import { getRarityColor, getProfessionColor } from '@/lib/professionColors';
import { slugify } from '@/lib/utils';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useGameData } from '@/contexts/GameDataContext';
import type { Item, Rarity, CraftingDiscipline, Character } from '@/api/types';
import type { Recipe, CharacterCrafting } from '@/api/types/crafting';

const DISCIPLINE_CLASSES: Record<CraftingDiscipline, string> = {
  Armorsmith: 'discipline-armorsmith',
  Artificer: 'discipline-artificer',
  Chef: 'discipline-chef',
  Huntsman: 'discipline-huntsman',
  Jeweler: 'discipline-jeweler',
  Leatherworker: 'discipline-leatherworker',
  Scribe: 'discipline-scribe',
  Tailor: 'discipline-tailor',
  Weaponsmith: 'discipline-weaponsmith',
};

const DISCIPLINES: CraftingDiscipline[] = [
  'Armorsmith',
  'Artificer',
  'Chef',
  'Huntsman',
  'Jeweler',
  'Leatherworker',
  'Scribe',
  'Tailor',
  'Weaponsmith',
];

const RARITIES: Rarity[] = ['Fine', 'Masterwork', 'Rare', 'Exotic', 'Ascended', 'Legendary'];

const ITEM_TYPES = ['Weapon', 'Armor', 'Consumable', 'Refinement', 'Component', 'Trinket', 'Bag', 'Upgrade'];

// Type display name mappings for cleaner UI labels
const TYPE_DISPLAY_NAMES: Record<string, string> = {
  'CraftingMaterial': 'Crafting Material',
  'UpgradeComponent': 'Upgrade Component',
  'Consumable': 'Consumable',
  'Weapon': 'Weapon',
  'Armor': 'Armor',
  'Trinket': 'Trinket',
  'Back': 'Back Item',
  'Bag': 'Bag',
  'Tool': 'Tool',
  'Gizmo': 'Gizmo',
  'Gathering': 'Gathering Tool',
  'Container': 'Container',
  'MiniPet': 'Mini Pet',
  'Trophy': 'Trophy',
  'JadeBot': 'Jade Bot',
  'PowerCore': 'Power Core',
};

/**
 * Formats type names from PascalCase/camelCase to readable spaced format
 * Falls back to manual spacing if no mapping exists
 * @example formatTypeName('CraftingMaterial') => 'Crafting Material'
 * @example formatTypeName('UpgradeComponent') => 'Upgrade Component'
 */
function formatTypeName(type: string): string {
  // First check if we have a custom display name
  if (TYPE_DISPLAY_NAMES[type]) {
    return TYPE_DISPLAY_NAMES[type];
  }

  // Otherwise, convert PascalCase to spaced words
  return type
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
}

/**
 * Renders item stats section for HoverCard tooltips
 * Displays defense, damage, and attribute bonuses from item.details
 */
function renderItemStats(item: Item): React.ReactNode {
  const details = item.details;
  if (!details) return null;

  const stats: React.ReactNode[] = [];

  // Defense (for armor)
  if (details.defense !== undefined && details.defense > 0) {
    stats.push(
      <div key="defense" className="text-xs">
        <span className="text-muted-foreground">Defense: </span>
        <span className="text-green-700 dark:text-green-400">{details.defense}</span>
      </div>
    );
  }

  // Weapon damage range
  if (details.min_power !== undefined && details.max_power !== undefined) {
    stats.push(
      <div key="damage" className="text-xs">
        <span className="text-muted-foreground">Weapon Strength: </span>
        <span className="text-orange-700 dark:text-orange-400">{details.min_power} - {details.max_power}</span>
      </div>
    );
  }

  // Damage type (for weapons)
  if (details.damage_type) {
    stats.push(
      <div key="damage-type" className="text-xs">
        <span className="text-muted-foreground">Damage Type: </span>
        <span>{details.damage_type}</span>
      </div>
    );
  }

  // Attribute bonuses from infix_upgrade
  if (details.infix_upgrade?.attributes && details.infix_upgrade.attributes.length > 0) {
    const attributes = details.infix_upgrade.attributes.map((attr, idx) => (
      <div key={idx} className="text-xs text-green-700 dark:text-green-400">
        +{attr.modifier} {attr.attribute}
      </div>
    ));
    stats.push(
      <div key="attributes" className="space-y-0.5">
        {attributes}
      </div>
    );
  }

  // Weight class (for armor)
  if (details.weight_class && details.weight_class !== 'Clothing') {
    stats.push(
      <div key="weight" className="text-xs">
        <span className="text-muted-foreground">Weight: </span>
        <span>{details.weight_class}</span>
      </div>
    );
  }

  if (stats.length === 0) return null;

  return (
    <div className="space-y-1 mt-2 pt-2 border-t border-border/50">
      {stats}
    </div>
  );
}

/**
 * Renders complete item tooltip content for HoverCards
 */
function ItemTooltipContent({
  item,
  showInventory = false,
  available,
  needed
}: {
  item: Item | undefined;
  itemId?: number;
  showInventory?: boolean;
  available?: number | null;
  needed?: number;
}): React.ReactNode {
  if (!item) return null;

  const hasEnough = available !== null && available !== undefined && needed !== undefined && available >= needed;

  return (
    <>
      <div className="flex gap-3">
        {item.icon && (
          <img src={item.icon} alt={item.name} className="w-10 h-10 rounded" />
        )}
        <div className="flex-1">
          <div className="font-medium" style={{ color: getRarityColor(item.rarity as Rarity) }}>
            {item.name}
          </div>
          {item.type && (
            <div className="text-xs text-muted-foreground">
              {formatTypeName(item.type)}
              {item.details?.type && ` - ${formatTypeName(item.details.type)}`}
            </div>
          )}
          <div className="flex gap-1 mt-1 flex-wrap">
            <span className="text-[10px] px-1 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">{item.rarity}</span>
            {item.level > 0 && (
              <span className="text-[10px] px-1 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                Req. Level {item.level}
              </span>
            )}
          </div>
        </div>
      </div>
      {renderItemStats(item)}
      {showInventory && available !== null && available !== undefined && needed !== undefined && (
        <div className="mt-2 pt-2 border-t text-sm">
          <span className={hasEnough ? 'text-success' : 'text-destructive'}>
            Have: {available} / Need: {needed}
          </span>
        </div>
      )}
      {item.description && (
        <p className="mt-2 text-xs text-muted-foreground line-clamp-3">{item.description}</p>
      )}
    </>
  );
}

interface RecipeWithItem extends Recipe {
  outputItem?: Item;
}

interface Filters {
  search: string;
  disciplines: CraftingDiscipline[];
  rarity: string;
  minLevel: number;
  maxLevel: number;
  craftableOnly: boolean;
  type: string;
  characters: string[];
}

const PAGE_SIZE = 25;

export function RecipeBrowser() {
  const { hasApiKey } = useApiKey();
  const { data: materials = [] } = useMaterials({ enabled: hasApiKey });
  const { data: bankSlots = [] } = useBank({ enabled: hasApiKey });
  const { data: characterNames = [] } = useCharacters({ enabled: hasApiKey });
  const { items, recipes, isLoading, getItem } = useGameData();

  const [filters, setFilters] = useState<Filters>({
    search: '',
    disciplines: [],
    rarity: 'all',
    minLevel: 0,
    maxLevel: 500,
    craftableOnly: false,
    type: 'all',
    characters: [],
  });

  const [recipeFavorites, setRecipeFavorites] = useState<Set<number>>(() => {
    const saved = localStorage.getItem('gw2-recipe-favorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('gw2-recipe-favorites', JSON.stringify([...recipeFavorites]));
  }, [recipeFavorites]);

  const [pinnedPage, setPinnedPage] = useState(0);
  const PINNED_PAGE_SIZE = 10;

  const toggleRecipeFavorite = (id: number) => {
    setRecipeFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const [hasInitializedFilters, setHasInitializedFilters] = useState(false);

  // Initialize craftableOnly when API key becomes available (first time only)
  useEffect(() => {
    if (hasApiKey && !hasInitializedFilters) {
      setFilters(prev => ({ ...prev, craftableOnly: true }));
      setHasInitializedFilters(true);
    }
  }, [hasApiKey, hasInitializedFilters]);

  // Fetch all characters' crafting data using React Query
  const characterCraftingQueries = useQueries({
    queries: (characterNames || []).map(name => ({
      queryKey: queryKeys.characterCrafting(name),
      queryFn: () => getApiClient().get<CharacterCrafting[]>(accountEndpoints.crafting(name)),
      enabled: hasApiKey && !!name,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
  });

  // Fetch all characters' details to get professions
  const characterQueries = useQueries({
    queries: (characterNames || []).map(name => ({
      queryKey: queryKeys.character(name),
      queryFn: () => getApiClient().get<Character>(accountEndpoints.character(name)),
      enabled: hasApiKey && !!name,
      staleTime: 5 * 60 * 1000, // 5 minutes
    })),
  });

  // Build a map of character names to professions
  const characterProfessionMap = useMemo(() => {
    const map = new Map<string, string>();

    characterQueries.forEach((query, index) => {
      const characterName = characterNames[index];
      const character = query.data;

      if (query.isSuccess && character) {
        map.set(characterName, character.profession);
      }
    });

    return map;
  }, [characterQueries, characterNames]);

  // Build a map of discipline -> characters who have it
  const characterCraftingMap = useMemo(() => {
    const map = new Map<CraftingDiscipline, Array<{ name: string; rating: number }>>();

    characterCraftingQueries.forEach((query, index) => {
      const characterName = characterNames[index];

      // Only process if query has loaded successfully
      if (!query.isSuccess || !query.data) {
        return;
      }

      const craftingData = query.data;
      const crafting = Array.isArray(craftingData) ? craftingData : (craftingData as any)?.crafting;

      if (!crafting || !Array.isArray(crafting)) {
        return;
      }

      crafting.forEach((craft: CharacterCrafting) => {
        if (!map.has(craft.discipline)) {
          map.set(craft.discipline, []);
        }
        map.get(craft.discipline)!.push({ name: characterName, rating: craft.rating });
      });
    });

    return map;
  }, [characterCraftingQueries, characterNames]);

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(0); // Reset to first page on search
    }, 300);

    return () => clearTimeout(timer);
  }, [filters.search]);

  // Create inventory lookup map for craftability checks
  const inventoryMap = useMemo(() => {
    const map = new Map<number, number>();

    // Add materials
    materials.forEach(mat => {
      map.set(mat.id, (map.get(mat.id) || 0) + mat.count);
    });

    // Add bank items
    bankSlots.forEach(slot => {
      if (slot) {
        map.set(slot.id, (map.get(slot.id) || 0) + slot.count);
      }
    });

    return map;
  }, [materials, bankSlots]);

  // Pre-compute craftable status for all recipes (stores ALL capable characters)
  const craftableMap = useMemo(() => {
    if (!hasApiKey) return new Map<number, string[]>();

    const map = new Map<number, string[]>();
    recipes.forEach(recipe => {
      // Check ingredients first
      const hasAllIngredients = recipe.ingredients.every(ingredient => {
        const available = inventoryMap.get(ingredient.item_id) || 0;
        return available >= ingredient.count;
      });

      if (!hasAllIngredients) {
        map.set(recipe.id, []);
        return;
      }

      // Find ALL capable characters
      const capableCharacters: string[] = [];
      for (const discipline of recipe.disciplines) {
        const characters = characterCraftingMap.get(discipline);
        if (!characters) continue;

        characters.forEach(char => {
          if (char.rating >= recipe.min_rating && !capableCharacters.includes(char.name)) {
            capableCharacters.push(char.name);
          }
        });
      }

      map.set(recipe.id, capableCharacters);
    });

    return map;
  }, [hasApiKey, recipes, inventoryMap, characterCraftingMap]);

  // Get crafter display info (prioritizes filtered characters)
  const getCrafterDisplay = useCallback((recipeId: number): { name: string; others: number } | null => {
    const crafters = craftableMap.get(recipeId) || [];
    if (crafters.length === 0) return null;

    // If character filter active, prioritize filtered characters
    let displayChar = crafters[0];
    if (filters.characters.length > 0) {
      const filteredCrafter = crafters.find(c => filters.characters.includes(c));
      if (filteredCrafter) displayChar = filteredCrafter;
    }

    return { name: displayChar, others: crafters.length - 1 };
  }, [craftableMap, filters.characters]);

  // Filter and prepare recipes for display
  const filteredRecipes = useMemo(() => {
    let filtered: RecipeWithItem[] = [];

    // Start with all recipes or search results
    if (debouncedSearch.trim().length >= 2) {
      // Search mode: filter by item name
      const searchLower = debouncedSearch.toLowerCase();
      const matchingItems = items.filter(item =>
        item.name.toLowerCase().includes(searchLower)
      );
      const matchingItemIds = new Set(matchingItems.map(item => item.id));

      filtered = recipes.filter(recipe => matchingItemIds.has(recipe.output_item_id));
    } else if (filters.craftableOnly && hasApiKey) {
      // Default mode with craftable filter (has ingredients + capable character)
      filtered = recipes.filter(recipe => (craftableMap.get(recipe.id) || []).length > 0);
    } else {
      // Default mode: show interesting recipes (Exotic/Ascended or high-level)
      filtered = recipes.filter(recipe => {
        const item = getItem(recipe.output_item_id);
        if (!item) return false;

        return (
          item.rarity === 'Exotic' ||
          item.rarity === 'Ascended' ||
          item.rarity === 'Legendary' ||
          recipe.min_rating >= 400
        );
      });
    }

    // Apply discipline filter
    if (filters.disciplines.length > 0) {
      filtered = filtered.filter(recipe =>
        recipe.disciplines.some(d => filters.disciplines.includes(d))
      );
    }

    // Apply rarity filter
    if (filters.rarity !== 'all') {
      filtered = filtered.filter(recipe => {
        const item = getItem(recipe.output_item_id);
        return item?.rarity === filters.rarity;
      });
    }

    // Apply level filter
    filtered = filtered.filter(recipe =>
      recipe.min_rating >= filters.minLevel &&
      recipe.min_rating <= filters.maxLevel
    );

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(recipe => {
        const item = getItem(recipe.output_item_id);
        if (!item) return false;

        // Map broad types
        if (filters.type === 'Refinement') {
          return recipe.type === 'Refinement' || recipe.type === 'RefinementEctoplasm' || recipe.type === 'RefinementObsidian';
        }
        if (filters.type === 'Component') {
          return recipe.type === 'Component' || recipe.type === 'Inscription' || recipe.type === 'Insignia';
        }
        if (filters.type === 'Upgrade') {
          return recipe.type === 'UpgradeComponent';
        }

        return item.type === filters.type || recipe.type === filters.type;
      });
    }

    // Apply character filter
    if (filters.characters.length > 0) {
      filtered = filtered.filter(recipe => {
        const crafters = craftableMap.get(recipe.id) || [];
        return crafters.some(crafter => filters.characters.includes(crafter));
      });
    }

    // Attach item data to recipes
    return filtered.map(recipe => ({
      ...recipe,
      outputItem: getItem(recipe.output_item_id),
    }));
  }, [debouncedSearch, recipes, items, getItem, filters, hasApiKey, craftableMap]);

  // Paginate results
  const paginatedRecipes = useMemo(() => {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return filteredRecipes.slice(start, end);
  }, [filteredRecipes, page]);

  const totalPages = Math.ceil(filteredRecipes.length / PAGE_SIZE);

  const handleFilterChange = useCallback((key: keyof Filters, value: string | number | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0); // Reset to first page on filter change
  }, []);

  // Render a single recipe row
  const renderRecipeRow = useCallback((recipe: RecipeWithItem) => {
    const crafterInfo = getCrafterDisplay(recipe.id);
    const outputItem = recipe.outputItem;
    const rarityColor = outputItem ? getRarityColor(outputItem.rarity) : '#FFFFFF';

    return (
      <tr
        key={recipe.id}
        className="border-b border-gw2-accent/10 hover:bg-muted/50 even:bg-muted/20 odd:bg-background transition-colors duration-200"
      >
        {/* Pin Button */}
        <td className="py-1 px-2">
          <button
            onClick={(e) => { e.stopPropagation(); toggleRecipeFavorite(recipe.id); }}
            className="hover:scale-110 transition-transform"
            title={recipeFavorites.has(recipe.id) ? 'Unpin recipe' : 'Pin recipe'}
          >
            <Pin className={`h-4 w-4 ${recipeFavorites.has(recipe.id) ? 'text-gw2-accent fill-current' : 'text-muted-foreground'}`} />
          </button>
        </td>
        {/* Icon */}
        <td className="py-1 px-2">
          {outputItem?.icon && (
            <img
              src={outputItem.icon}
              alt={outputItem.name}
              className="w-6 h-6 rounded"
              loading="lazy"
            />
          )}
        </td>

        {/* Item Name with Type Tags */}
        <td className="py-1 px-2">
          <HoverCard openDelay={200} closeDelay={100}>
            <HoverCardTrigger asChild>
              <div className="cursor-help">
                <Link
                  to="/crafting/$recipeId"
                  params={{ recipeId: `${recipe.id}-${slugify(outputItem?.name || 'recipe')}` }}
                  className="font-medium text-xs hover:underline"
                  style={{ color: rarityColor }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {outputItem?.name || `Item ${recipe.output_item_id}`}
                  {recipe.output_item_count > 1 && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      x{recipe.output_item_count}
                    </span>
                  )}
                </Link>
                {outputItem && (
                  <div className="flex gap-1 mt-0.5">
                    {outputItem.type && (
                      <span className="text-[10px] px-1 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        {formatTypeName(outputItem.type)}
                      </span>
                    )}
                    {outputItem.details?.type && (
                      <span className="text-[10px] px-1 py-0.5 rounded bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                        {formatTypeName(outputItem.details.type)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80 p-3">
              <ItemTooltipContent item={outputItem} />
            </HoverCardContent>
          </HoverCard>
        </td>

        {/* Discipline */}
        <td className="py-1 px-2">
          <div className="flex flex-wrap gap-1">
            {recipe.disciplines.map(disc => (
              <span
                key={disc}
                className={`text-[10px] px-1.5 py-0.5 rounded ${DISCIPLINE_CLASSES[disc]} bg-discipline/20 text-discipline`}
              >
                {disc}
              </span>
            ))}
          </div>
        </td>

        {/* Level */}
        <td className="py-1 px-2">
          <span className="text-xs text-muted-foreground">
            {recipe.min_rating}
          </span>
        </td>

        {/* Ingredients */}
        <td className="py-1 px-2">
          <div className="flex flex-wrap gap-1 items-center">
            {recipe.ingredients.slice(0, 6).map((ing, idx) => {
              const ingItem = getItem(ing.item_id);
              const available = hasApiKey ? (inventoryMap.get(ing.item_id) || 0) : null;
              const needed = ing.count;
              const hasEnough = available !== null && available >= needed;

              return (
                <HoverCard key={idx} openDelay={200} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center gap-0.5 cursor-help">
                      {ingItem?.icon ? (
                        <img
                          src={ingItem.icon}
                          alt={ingItem.name}
                          className="w-4 h-4 rounded"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-4 h-4 bg-muted rounded flex items-center justify-center">
                          <HelpCircle className="w-2 h-2 text-muted-foreground" />
                        </div>
                      )}
                      {hasApiKey && available !== null ? (
                        <span
                          className={`text-xs font-medium ${hasEnough ? 'text-success' : 'text-destructive'}`}
                        >
                          {available}/{needed}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          x{needed}
                        </span>
                      )}
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80 p-3">
                    <ItemTooltipContent
                      item={ingItem}
                      showInventory={hasApiKey}
                      available={available}
                      needed={needed}
                    />
                    {!ingItem && (
                      <div className="text-sm text-muted-foreground">
                        Unknown Item #{ing.item_id}
                      </div>
                    )}
                  </HoverCardContent>
                </HoverCard>
              );
            })}
            {recipe.ingredients.length > 6 && (
              <span className="text-xs text-muted-foreground">
                +{recipe.ingredients.length - 6} more
              </span>
            )}
          </div>
        </td>

        {/* Crafter */}
        {hasApiKey && (
          <td className="py-1 px-2">
            {crafterInfo ? (
              <span className="flex items-center gap-1">
                <span
                  className="text-xs px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: characterProfessionMap.has(crafterInfo.name)
                      ? `${getProfessionColor(characterProfessionMap.get(crafterInfo.name)!)}33`
                      : '#22c55e33',
                    color: characterProfessionMap.has(crafterInfo.name)
                      ? getProfessionColor(characterProfessionMap.get(crafterInfo.name)!)
                      : '#4ade80'
                  }}
                >
                  {crafterInfo.name}
                </span>
                {crafterInfo.others > 0 && (
                  <span className="text-xs text-muted-foreground">(+{crafterInfo.others})</span>
                )}
              </span>
            ) : (
              <X className="h-4 w-4 text-destructive" />
            )}
          </td>
        )}
      </tr>
    );
  }, [getItem, hasApiKey, inventoryMap, getCrafterDisplay, characterProfessionMap, recipeFavorites, toggleRecipeFavorite]);

  // If no data available, show friendly message
  if (!isLoading && items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="mb-2">Recipe data not available.</p>
        <p className="text-sm">Run <code className="bg-muted px-1 rounded">npm run update-data</code> to enable crafting features.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={isLoading ? "Loading recipe database..." : "Search for recipes by item name (min 2 chars)..."}
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          disabled={isLoading}
          className="pl-9 pr-4"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {/* Discipline Filter - Multi-select Dropdown */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Disciplines</label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <span className="line-clamp-1">
                  {filters.disciplines.length === 0
                    ? 'All Disciplines'
                    : `${filters.disciplines.length} selected`}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 rounded-md border bg-popover text-popover-foreground shadow-md p-1">
              <div className="space-y-0.5">
                {DISCIPLINES.map(disc => (
                  <div
                    key={disc}
                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={() => {
                      setFilters(prev => ({
                        ...prev,
                        disciplines: prev.disciplines.includes(disc)
                          ? prev.disciplines.filter(d => d !== disc)
                          : [...prev.disciplines, disc]
                      }));
                      setPage(0);
                    }}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {filters.disciplines.includes(disc) && <Check className="h-4 w-4" />}
                    </span>
                    <span className={`${DISCIPLINE_CLASSES[disc]} text-discipline`}>{disc}</span>
                  </div>
                ))}
                {filters.disciplines.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => {
                      setFilters(prev => ({ ...prev, disciplines: [] }));
                      setPage(0);
                    }}
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Character Filter - Multi-select Dropdown */}
        {hasApiKey && characterNames.length > 0 && (
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Characters</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  <span className="line-clamp-1">
                    {filters.characters.length === 0
                      ? 'All Characters'
                      : `${filters.characters.length} selected`}
                  </span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 rounded-md border bg-popover text-popover-foreground shadow-md p-1">
                <div className="space-y-0.5">
                  {characterNames.map(name => {
                    const profession = characterProfessionMap.get(name);
                    const professionColor = profession ? getProfessionColor(profession) : '#FFFFFF';

                    return (
                      <div
                        key={name}
                        className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                        onClick={() => {
                          setFilters(prev => ({
                            ...prev,
                            characters: prev.characters.includes(name)
                              ? prev.characters.filter(c => c !== name)
                              : [...prev.characters, name]
                          }));
                          setPage(0);
                        }}
                      >
                        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                          {filters.characters.includes(name) && <Check className="h-4 w-4" />}
                        </span>
                        <span className="flex-1">{name}</span>
                        {profession && (
                          <span
                            className="text-xs px-1 py-0.5 rounded"
                            style={{
                              backgroundColor: `${professionColor}33`,
                              color: professionColor
                            }}
                          >
                            {profession}
                          </span>
                        )}
                      </div>
                    );
                  })}
                  {filters.characters.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        setFilters(prev => ({ ...prev, characters: [] }));
                        setPage(0);
                      }}
                    >
                      Clear all
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* Rarity Filter */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Rarity</label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <span className="line-clamp-1" style={filters.rarity !== 'all' ? { color: getRarityColor(filters.rarity as Rarity) } : undefined}>
                  {filters.rarity === 'all' ? 'All Rarities' : filters.rarity}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 rounded-md border bg-popover text-popover-foreground shadow-md p-1">
              <div className="space-y-0.5">
                <div
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => { handleFilterChange('rarity', 'all'); }}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {filters.rarity === 'all' && <Check className="h-4 w-4" />}
                  </span>
                  <span>All Rarities</span>
                </div>
                {RARITIES.map(rarity => (
                  <div
                    key={rarity}
                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={() => { handleFilterChange('rarity', rarity); }}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {filters.rarity === rarity && <Check className="h-4 w-4" />}
                    </span>
                    <span style={{ color: getRarityColor(rarity) }}>{rarity}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Type Filter */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Type</label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <span className="line-clamp-1">
                  {filters.type === 'all' ? 'All Types' : filters.type}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 rounded-md border bg-popover text-popover-foreground shadow-md p-1">
              <div className="space-y-0.5">
                <div
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => { handleFilterChange('type', 'all'); }}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {filters.type === 'all' && <Check className="h-4 w-4" />}
                  </span>
                  <span>All Types</span>
                </div>
                {ITEM_TYPES.map(type => (
                  <div
                    key={type}
                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={() => { handleFilterChange('type', type); }}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {filters.type === type && <Check className="h-4 w-4" />}
                    </span>
                    <span>{type}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Level Range */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Level Range</label>
          <div className="flex gap-2">
            <Input
              type="number"
              min="0"
              max="500"
              value={filters.minLevel}
              onChange={(e) => handleFilterChange('minLevel', parseInt(e.target.value) || 0)}
              placeholder="Min"
              className="w-full"
            />
            <Input
              type="number"
              min="0"
              max="500"
              value={filters.maxLevel}
              onChange={(e) => handleFilterChange('maxLevel', parseInt(e.target.value) || 500)}
              placeholder="Max"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Additional Options */}
      <div className="flex flex-wrap items-center gap-4">
        {hasApiKey && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.craftableOnly}
              onChange={(e) => handleFilterChange('craftableOnly', e.target.checked)}
              className="w-4 h-4 rounded border-input bg-background cursor-pointer"
            />
            <span className="text-sm">Show only craftable</span>
          </label>
        )}

        {recipeFavorites.size > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Pin className="h-4 w-4 text-gw2-accent" />
                Pinned Recipes ({recipeFavorites.size})
              </Button>
            </DialogTrigger>
            <DialogContent className="!max-w-[95vw] !w-[95vw] !h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-gw2-accent">
                  <Pin className="h-5 w-5" />
                  Pinned Recipes
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-y-auto">
                <div className="border border-gw2-accent/20 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gw2-accent/30 bg-card/95 text-left sticky top-0">
                        <th className="py-2 px-3 font-medium text-xs text-gw2-accent/70 w-10"></th>
                        <th className="py-2 px-3 font-medium text-xs text-gw2-accent/70 w-12"></th>
                        <th className="py-2 px-3 font-medium text-xs text-gw2-accent/70">Item Name</th>
                        <th className="py-2 px-3 font-medium text-xs text-gw2-accent/70">Discipline</th>
                        <th className="py-2 px-3 font-medium text-xs text-gw2-accent/70">Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recipes
                        .filter(r => recipeFavorites.has(r.id))
                        .slice(pinnedPage * PINNED_PAGE_SIZE, (pinnedPage + 1) * PINNED_PAGE_SIZE)
                        .map(recipe => {
                          const outputItem = getItem(recipe.output_item_id);
                          const rarityColor = outputItem ? getRarityColor(outputItem.rarity) : '#FFFFFF';
                          return (
                            <tr key={recipe.id} className="border-b border-gw2-accent/10 hover:bg-muted/50">
                              <td className="py-2 px-3">
                                <button
                                  onClick={() => toggleRecipeFavorite(recipe.id)}
                                  className="hover:scale-110 transition-transform"
                                  title="Unpin recipe"
                                >
                                  <Pin className="h-4 w-4 text-gw2-accent fill-current" />
                                </button>
                              </td>
                              <td className="py-2 px-3">
                                {outputItem?.icon && (
                                  <img src={outputItem.icon} alt={outputItem.name} className="w-8 h-8 rounded" />
                                )}
                              </td>
                              <td className="py-2 px-3">
                                <Link
                                  to="/crafting/$recipeId"
                                  params={{ recipeId: `${recipe.id}-${slugify(outputItem?.name || 'recipe')}` }}
                                  className="font-semibold text-sm hover:underline"
                                  style={{ color: rarityColor }}
                                >
                                  {outputItem?.name || `Item ${recipe.output_item_id}`}
                                </Link>
                              </td>
                              <td className="py-2 px-3">
                                <div className="flex flex-wrap gap-1">
                                  {recipe.disciplines.map(disc => (
                                    <span key={disc} className={`text-[10px] px-1.5 py-0.5 rounded ${DISCIPLINE_CLASSES[disc]} bg-discipline/20 text-discipline`}>
                                      {disc}
                                    </span>
                                  ))}
                                </div>
                              </td>
                              <td className="py-2 px-3 text-sm text-muted-foreground">{recipe.min_rating}</td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {recipeFavorites.size > PINNED_PAGE_SIZE && (
                <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                  <div className="text-sm text-muted-foreground">
                    Page {pinnedPage + 1} of {Math.ceil(recipeFavorites.size / PINNED_PAGE_SIZE)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPinnedPage(p => Math.max(0, p - 1))}
                      disabled={pinnedPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPinnedPage(p => Math.min(Math.ceil(recipeFavorites.size / PINNED_PAGE_SIZE) - 1, p + 1))}
                      disabled={pinnedPage >= Math.ceil(recipeFavorites.size / PINNED_PAGE_SIZE) - 1}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        {filteredRecipes.length > 0 ? (
          <>
            Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filteredRecipes.length)} of{' '}
            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
          </>
        ) : (
          <>No recipes to display</>
        )}
      </div>

      {/* Recipe Table or Grouped View */}
      {filteredRecipes.length > 0 ? (
        <>
          {/* Pagination - Top */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="border border-gw2-accent/20 rounded-lg overflow-hidden shadow-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="sticky top-0 z-10 border-b border-gw2-accent/30 bg-card/95 backdrop-blur-sm text-left">
                  <th className="py-1 px-2 font-medium text-xs text-gw2-accent/70 w-8"></th>
                  <th className="py-1 px-2 font-medium text-xs text-gw2-accent/70 w-10"></th>
                  <th className="py-1 px-2 font-medium text-xs text-gw2-accent/70">Item Name</th>
                  <th className="py-1 px-2 font-medium text-xs text-gw2-accent/70">Discipline</th>
                  <th className="py-1 px-2 font-medium text-xs text-gw2-accent/70">Level</th>
                  <th className="py-1 px-2 font-medium text-xs text-gw2-accent/70">Ingredients</th>
                  {hasApiKey && (
                    <th className="py-1 px-2 font-medium text-xs text-gw2-accent/70">Can Craft</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedRecipes?.map(recipe => renderRecipeRow(recipe))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      ) : debouncedSearch.trim().length >= 2 ? (
        <div className="text-center py-8 text-muted-foreground">
          No recipes found
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          Adjust filters to see recipes
        </div>
      )}
    </div>
  );
}
