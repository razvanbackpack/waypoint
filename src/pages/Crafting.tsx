import { Hammer } from 'lucide-react';
import { RecipeBrowser } from '@/components/crafting/RecipeBrowser';

export function Crafting() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Hammer className="h-6 w-6 text-gw2-gold" />
          <h1 className="text-2xl font-bold text-gw2-gold">Crafting</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Search and explore all crafting recipes in Guild Wars 2
        </p>
      </div>

      {/* Recipe Browser - floats directly on page */}
      <RecipeBrowser />
    </div>
  );
}
