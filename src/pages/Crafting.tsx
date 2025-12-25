import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Hammer } from 'lucide-react';
import { RecipeBrowser } from '@/components/crafting/RecipeBrowser';

export function Crafting() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gw2-gold/10 glow-gold-sm">
            <Hammer className="h-5 w-5 text-gw2-gold" />
          </div>
          <h1 className="text-2xl font-bold heading-accent">Crafting</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Search and browse crafting recipes
        </p>
      </div>

      {/* Main Content Card */}
      <Card variant="featured">
        <CardHeader>
          <CardTitle className="text-xl">Recipe Browser</CardTitle>
          <CardDescription>
            Search and explore all crafting recipes in Guild Wars 2
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecipeBrowser />
        </CardContent>
      </Card>
    </div>
  );
}
