import { Card, CardContent, CardHeader, CardTitle, CardAction } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Recipe } from '@/api/types/crafting';
import type { Item } from '@/api/types';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  outputItem: Item;
  ingredients: Array<{
    item: Item;
    required: number;
    owned: number;
  }>;
  isLearned?: boolean;
  isTracked?: boolean;
  onToggleTrack?: (recipeId: number) => void;
}

const rarityColors: Record<string, string> = {
  Junk: 'text-gray-500',
  Basic: 'text-gray-300',
  Fine: 'text-blue-400',
  Masterwork: 'text-green-400',
  Rare: 'text-yellow-400',
  Exotic: 'text-orange-400',
  Ascended: 'text-pink-400',
  Legendary: 'text-purple-400',
};

const rarityBorderColors: Record<string, string> = {
  Junk: '#AAA',
  Basic: '#000',
  Fine: '#62A4DA',
  Masterwork: '#1a9306',
  Rare: '#fcd00b',
  Exotic: '#ffa405',
  Ascended: '#fb3e8d',
  Legendary: '#4C139D',
};

export function RecipeCard({
  recipe,
  outputItem,
  ingredients,
  isLearned = false,
  isTracked = false,
  onToggleTrack,
}: RecipeCardProps) {
  // Calculate material ownership percentage
  const totalRequired = ingredients.reduce((sum, ing) => sum + ing.required, 0);
  const totalOwned = ingredients.reduce(
    (sum, ing) => sum + Math.min(ing.owned, ing.required),
    0
  );
  const progressPercentage = totalRequired > 0 ? (totalOwned / totalRequired) * 100 : 0;

  // Determine progress bar color
  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'bg-green-500';
    if (progressPercentage > 0) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleToggleTrack = () => {
    if (onToggleTrack) {
      onToggleTrack(recipe.id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          {outputItem.icon && (
            <img
              src={outputItem.icon}
              alt={outputItem.name}
              className="w-8 h-8 rounded"
              style={{
                borderWidth: '2px',
                borderStyle: 'solid',
                borderColor: rarityBorderColors[outputItem.rarity] || '#AAA',
              }}
            />
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className={cn('text-base truncate', rarityColors[outputItem.rarity])}>
              {outputItem.name}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {recipe.disciplines.map((discipline) => (
                <Badge key={discipline} variant="outline" className="text-xs">
                  {discipline}
                </Badge>
              ))}
              {recipe.min_rating > 0 && (
                <Badge variant="secondary" className="text-xs">
                  Level {recipe.min_rating}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <CardAction>
          {onToggleTrack && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleToggleTrack}
              className={cn(isTracked && 'text-yellow-500')}
              aria-label={isTracked ? 'Untrack recipe' : 'Track recipe'}
            >
              <Star className={cn('w-4 h-4', isTracked && 'fill-current')} />
            </Button>
          )}
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Ingredients section */}
        <div>
          <div className="text-xs font-semibold mb-2 text-muted-foreground">Ingredients</div>
          <div className="space-y-2">
            {ingredients.map((ingredient) => {
              const hasEnough = ingredient.owned >= ingredient.required;
              return (
                <div key={ingredient.item.id} className="flex items-center gap-2">
                  {ingredient.item.icon && (
                    <img
                      src={ingredient.item.icon}
                      alt={ingredient.item.name}
                      className="w-6 h-6 rounded"
                      style={{
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: rarityBorderColors[ingredient.item.rarity] || '#AAA',
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        'text-sm truncate',
                        rarityColors[ingredient.item.rarity]
                      )}
                    >
                      {ingredient.item.name}
                    </div>
                  </div>
                  <div
                    className={cn(
                      'text-sm font-medium',
                      hasEnough ? 'text-green-400' : 'text-red-400'
                    )}
                  >
                    {ingredient.owned}/{ingredient.required}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-semibold text-muted-foreground">Materials</div>
            <div className="text-xs text-muted-foreground">
              {progressPercentage.toFixed(0)}%
            </div>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn('h-full transition-all', getProgressColor())}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Status badges */}
        {isLearned && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Learned
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
