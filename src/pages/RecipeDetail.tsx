import { useMemo } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useQueries } from '@tanstack/react-query';
import { ArrowLeft, Clock, Copy, Check, Loader2, HelpCircle, ChefHat } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGameData } from '@/contexts/GameDataContext';
import { useApiKey } from '@/api/hooks/useApiKey';
import { useMaterials, useBank, useCharacters, queryKeys } from '@/api/hooks/useGW2Api';
import { getApiClient } from '@/api/client';
import { accountEndpoints } from '@/api/endpoints';
import { getRarityColor, getProfessionColor } from '@/lib/professionColors';
import { parseRecipeSlug, slugify } from '@/lib/utils';
import type { CraftingDiscipline, Rarity, Character } from '@/api/types';
import type { CharacterCrafting } from '@/api/types/crafting';
import { useState } from 'react';

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

/**
 * Formats time in milliseconds to a human-readable string
 */
function formatCraftTime(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (remainingSeconds === 0) return `${minutes}m`;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Formats type names from PascalCase/camelCase to readable spaced format
 */
function formatTypeName(type: string): string {
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

  if (TYPE_DISPLAY_NAMES[type]) {
    return TYPE_DISPLAY_NAMES[type];
  }

  return type
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
}

export function RecipeDetailPage() {
  const { recipeId } = useParams({ from: '/crafting/$recipeId' });
  const { getRecipe, getItem, getRecipeByOutput, isLoading: isGameDataLoading } = useGameData();
  const { hasApiKey } = useApiKey();
  const { data: materials = [] } = useMaterials({ enabled: hasApiKey });
  const { data: bankSlots = [] } = useBank({ enabled: hasApiKey });
  const { data: characterNames = [] } = useCharacters({ enabled: hasApiKey });

  const [copied, setCopied] = useState(false);

  // Parse recipe ID from slug (e.g., "12345-bolt-of-silk" -> 12345)
  const parsedRecipeId = parseRecipeSlug(recipeId);
  const recipe = parsedRecipeId ? getRecipe(parsedRecipeId) : undefined;
  const outputItem = recipe ? getItem(recipe.output_item_id) : undefined;

  // Get ingredient items
  const ingredientItems = useMemo(() => {
    if (!recipe) return [];
    return recipe.ingredients.map(ing => ({
      ...ing,
      item: getItem(ing.item_id),
      recipe: getRecipeByOutput(ing.item_id),
    }));
  }, [recipe, getItem, getRecipeByOutput]);

  // Fetch all characters' crafting data
  const characterCraftingQueries = useQueries({
    queries: (characterNames || []).map(name => ({
      queryKey: queryKeys.characterCrafting(name),
      queryFn: () => getApiClient().get<CharacterCrafting[]>(accountEndpoints.crafting(name)),
      enabled: hasApiKey && !!name,
      staleTime: 5 * 60 * 1000,
    })),
  });

  // Fetch character professions
  const characterQueries = useQueries({
    queries: (characterNames || []).map(name => ({
      queryKey: queryKeys.character(name),
      queryFn: () => getApiClient().get<Character>(accountEndpoints.character(name)),
      enabled: hasApiKey && !!name,
      staleTime: 5 * 60 * 1000,
    })),
  });

  // Build inventory map
  const inventoryMap = useMemo(() => {
    const map = new Map<number, number>();
    materials.forEach(mat => {
      map.set(mat.id, (map.get(mat.id) || 0) + mat.count);
    });
    bankSlots.forEach(slot => {
      if (slot) {
        map.set(slot.id, (map.get(slot.id) || 0) + slot.count);
      }
    });
    return map;
  }, [materials, bankSlots]);

  // Build character crafting map
  const characterCraftingMap = useMemo(() => {
    const map = new Map<string, { profession: string; crafting: CharacterCrafting[] }>();

    characterNames.forEach((name, index) => {
      const craftingQuery = characterCraftingQueries[index];
      const characterQuery = characterQueries[index];

      if (craftingQuery.isSuccess && craftingQuery.data && characterQuery.isSuccess && characterQuery.data) {
        const craftingData = craftingQuery.data;
        const crafting = Array.isArray(craftingData) ? craftingData : (craftingData as any)?.crafting;

        if (crafting && Array.isArray(crafting)) {
          map.set(name, {
            profession: characterQuery.data.profession,
            crafting,
          });
        }
      }
    });

    return map;
  }, [characterNames, characterCraftingQueries, characterQueries]);

  // Find characters that can craft this recipe
  const capableCrafters = useMemo(() => {
    if (!recipe) return [];

    const crafters: Array<{ name: string; profession: string; discipline: CraftingDiscipline; rating: number }> = [];

    characterCraftingMap.forEach((data, characterName) => {
      data.crafting.forEach(craft => {
        if (
          recipe.disciplines.includes(craft.discipline) &&
          craft.rating >= recipe.min_rating
        ) {
          crafters.push({
            name: characterName,
            profession: data.profession,
            discipline: craft.discipline,
            rating: craft.rating,
          });
        }
      });
    });

    return crafters;
  }, [recipe, characterCraftingMap]);

  // Copy chat link to clipboard
  const handleCopyChatLink = async () => {
    if (!recipe?.chat_link) return;
    try {
      await navigator.clipboard.writeText(recipe.chat_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy chat link:', err);
    }
  };

  // Loading state
  if (isGameDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-gw2-gold" />
      </div>
    );
  }

  // Recipe not found
  if (!recipe) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Link to="/crafting" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gw2-gold transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Crafting
        </Link>

        <Card>
          <CardContent className="py-12 text-center">
            <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Recipe Not Found</h2>
            <p className="text-muted-foreground">
              The recipe with ID {recipeId} could not be found.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const rarityColor = outputItem ? getRarityColor(outputItem.rarity as Rarity) : '#FFFFFF';

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Back Link */}
      <Link to="/crafting" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gw2-gold transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Crafting
      </Link>

      {/* Main Recipe Card */}
      <Card>
        <CardHeader className="border-b border-gw2-gold/20">
          <div className="flex items-start gap-4">
            {/* Output Item Icon */}
            {outputItem?.icon && (
              <div className="relative">
                <img
                  src={outputItem.icon}
                  alt={outputItem.name}
                  className="w-16 h-16 rounded-lg border-2"
                  style={{ borderColor: rarityColor }}
                />
                {recipe.output_item_count > 1 && (
                  <span className="absolute -bottom-1 -right-1 bg-background border border-border rounded px-1.5 text-xs font-medium">
                    x{recipe.output_item_count}
                  </span>
                )}
              </div>
            )}

            <div className="flex-1 min-w-0">
              {/* Item Name */}
              <CardTitle
                className="text-xl"
                style={{ color: rarityColor }}
              >
                {outputItem?.name || `Recipe ${recipe.id}`}
              </CardTitle>

              {/* Item Type */}
              {outputItem && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {outputItem.type && (
                    <Badge variant="secondary" className="text-xs">
                      {formatTypeName(outputItem.type)}
                    </Badge>
                  )}
                  {outputItem.details?.type && (
                    <Badge variant="secondary" className="text-xs">
                      {formatTypeName(outputItem.details.type)}
                    </Badge>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {outputItem.rarity}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Recipe Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Level Requirement */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Level Required</div>
              <div className="text-lg font-semibold">{recipe.min_rating}</div>
            </div>

            {/* Time to Craft */}
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Craft Time</div>
              <div className="flex items-center gap-1.5 text-lg font-semibold">
                <Clock className="h-4 w-4 text-muted-foreground" />
                {formatCraftTime(recipe.time_to_craft_ms)}
              </div>
            </div>

            {/* Disciplines */}
            <div className="space-y-1 sm:col-span-2">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">Disciplines</div>
              <div className="flex flex-wrap gap-1.5">
                {recipe.disciplines.map(disc => (
                  <span
                    key={disc}
                    className={`text-xs px-2 py-1 rounded ${DISCIPLINE_CLASSES[disc]} bg-discipline/20 text-discipline`}
                  >
                    {disc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Link */}
          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Chat Link</div>
            <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{recipe.chat_link}</code>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyChatLink}
              className="h-7 px-2"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>

          {/* Ingredients Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gw2-gold uppercase tracking-wider">Ingredients</h3>
            <div className="border border-gw2-gold/20 rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gw2-gold/20 bg-muted/50">
                    <th className="py-2 px-3 text-left font-medium text-xs text-gw2-gold/70 w-10"></th>
                    <th className="py-2 px-3 text-left font-medium text-xs text-gw2-gold/70">Item</th>
                    <th className="py-2 px-3 text-right font-medium text-xs text-gw2-gold/70 w-24">Required</th>
                    {hasApiKey && (
                      <th className="py-2 px-3 text-right font-medium text-xs text-gw2-gold/70 w-24">Available</th>
                    )}
                    <th className="py-2 px-3 text-right font-medium text-xs text-gw2-gold/70 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  {ingredientItems.map((ing, idx) => {
                    const available = hasApiKey ? (inventoryMap.get(ing.item_id) || 0) : null;
                    const hasEnough = available !== null && available >= ing.count;
                    const ingRarityColor = ing.item ? getRarityColor(ing.item.rarity as Rarity) : '#FFFFFF';

                    return (
                      <tr
                        key={idx}
                        className="border-b border-gw2-gold/10 last:border-b-0 hover:bg-muted/30 transition-colors"
                      >
                        <td className="py-2 px-3">
                          {ing.item?.icon ? (
                            <img
                              src={ing.item.icon}
                              alt={ing.item.name}
                              className="w-8 h-8 rounded"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                              <HelpCircle className="w-4 h-4 text-muted-foreground" />
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          <div className="font-medium" style={{ color: ingRarityColor }}>
                            {ing.item?.name || `Item ${ing.item_id}`}
                          </div>
                          {ing.item?.type && (
                            <div className="text-xs text-muted-foreground">
                              {formatTypeName(ing.item.type)}
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right font-medium">
                          {ing.count}
                        </td>
                        {hasApiKey && (
                          <td className="py-2 px-3 text-right">
                            <span className={hasEnough ? 'text-green-500' : 'text-red-500'}>
                              {available}
                            </span>
                          </td>
                        )}
                        <td className="py-2 px-3 text-right">
                          {ing.recipe && (
                            <Link
                              to="/crafting/$recipeId"
                              params={{ recipeId: `${ing.recipe.id}-${slugify(ing.item?.name || 'recipe')}` }}
                              className="inline-flex items-center gap-1 text-xs text-gw2-gold hover:text-gw2-gold/80 transition-colors"
                            >
                              <ChefHat className="h-3.5 w-3.5" />
                              Recipe
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Capable Crafters Section (Authenticated Only) */}
          {hasApiKey && capableCrafters.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gw2-gold uppercase tracking-wider">Characters Who Can Craft</h3>
              <div className="flex flex-wrap gap-2">
                {capableCrafters.map((crafter, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-muted/30"
                  >
                    <span
                      className="font-medium"
                      style={{ color: getProfessionColor(crafter.profession) }}
                    >
                      {crafter.name}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${DISCIPLINE_CLASSES[crafter.discipline]} bg-discipline/20 text-discipline`}
                    >
                      {crafter.discipline} {crafter.rating}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasApiKey && capableCrafters.length === 0 && (
            <div className="text-sm text-muted-foreground">
              None of your characters have the required crafting level to make this recipe.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
