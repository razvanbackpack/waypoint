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

const rarityClasses: Record<string, string> = {
  Junk: 'rarity-junk',
  Basic: 'rarity-basic',
  Fine: 'rarity-fine',
  Masterwork: 'rarity-masterwork',
  Rare: 'rarity-rare',
  Exotic: 'rarity-exotic',
  Ascended: 'rarity-ascended',
  Legendary: 'rarity-legendary',
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
    if (progressPercentage >= 100) return 'bg-success';
    if (progressPercentage > 0) return 'bg-warning';
    return 'bg-destructive';
  };

  const handleToggleTrack = () => {
    if (onToggleTrack) {
      onToggleTrack(recipe.id);
    }
  };

  return (
    <Card className="card-interactive">
      <CardHeader>
        <div className="flex items-start gap-3">
          {outputItem.icon && (
            <img
              src={outputItem.icon}
              alt={outputItem.name}
              className={cn('w-8 h-8 rounded border-2 border-rarity', rarityClasses[outputItem.rarity])}
            />
          )}
          <div className="flex-1 min-w-0">
            <CardTitle className={cn('text-base truncate text-rarity', rarityClasses[outputItem.rarity])}>
              {outputItem.name}
            </CardTitle>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              {recipe.disciplines.map((discipline) => (
                <Badge
                  key={discipline}
                  variant="outline"
                  className={cn('text-xs text-discipline border-discipline/50', `discipline-${discipline.toLowerCase()}`)}
                >
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
              className={cn(isTracked && 'text-gw2-accent')}
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
                      className={cn(
                        'w-6 h-6 rounded border border-rarity',
                        rarityClasses[ingredient.item.rarity]
                      )}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        'text-sm truncate text-rarity',
                        rarityClasses[ingredient.item.rarity]
                      )}
                    >
                      {ingredient.item.name}
                    </div>
                  </div>
                  <div
                    className={cn(
                      'text-sm font-medium',
                      hasEnough ? 'text-success' : 'text-destructive'
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
