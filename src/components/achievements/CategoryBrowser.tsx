import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  achievementIds: number[];
}

interface CategoryGroup {
  name: string;
  categories: Category[];
}

interface CategoryBrowserProps {
  onSelectAchievements?: (achievementIds: number[]) => void;
}

export function CategoryBrowser({ onSelectAchievements }: CategoryBrowserProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const categoryGroups: CategoryGroup[] = [
    {
      name: 'Core Tyria',
      categories: [
        { id: 1, name: 'General', achievementIds: [] },
        { id: 2, name: 'Explorer', achievementIds: [] },
        { id: 3, name: 'Combat', achievementIds: [] },
        { id: 4, name: 'Crafting', achievementIds: [] },
        { id: 5, name: 'Story', achievementIds: [] },
      ],
    },
    {
      name: 'Heart of Thorns',
      categories: [
        { id: 101, name: 'Story', achievementIds: [] },
        { id: 102, name: 'Masteries', achievementIds: [] },
        { id: 103, name: 'Adventures', achievementIds: [] },
        { id: 104, name: 'Exploration', achievementIds: [] },
      ],
    },
    {
      name: 'Path of Fire',
      categories: [
        { id: 201, name: 'Story', achievementIds: [] },
        { id: 202, name: 'Masteries', achievementIds: [] },
        { id: 203, name: 'Collections', achievementIds: [] },
        { id: 204, name: 'Exploration', achievementIds: [] },
      ],
    },
    {
      name: 'End of Dragons',
      categories: [
        { id: 301, name: 'Story', achievementIds: [] },
        { id: 302, name: 'Fishing', achievementIds: [] },
        { id: 303, name: 'Skiffs', achievementIds: [] },
        { id: 304, name: 'Exploration', achievementIds: [] },
      ],
    },
    {
      name: 'Secrets of the Obscure',
      categories: [
        { id: 401, name: 'Story', achievementIds: [] },
        { id: 402, name: 'Rifts', achievementIds: [] },
        { id: 403, name: 'Collections', achievementIds: [] },
        { id: 404, name: 'Exploration', achievementIds: [] },
      ],
    },
  ];

  const toggleGroup = (groupName: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupName)) {
      newExpanded.delete(groupName);
    } else {
      newExpanded.add(groupName);
    }
    setExpandedGroups(newExpanded);
  };

  const selectCategory = (category: Category) => {
    setSelectedCategory(category.id);
    if (onSelectAchievements) {
      onSelectAchievements(category.achievementIds);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievement Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {categoryGroups.map(group => {
            const isExpanded = expandedGroups.has(group.name);
            return (
              <div key={group.name}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 font-semibold"
                  onClick={() => toggleGroup(group.name)}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  {group.name}
                </Button>
                {isExpanded && (
                  <div className="ml-6 space-y-1">
                    {group.categories.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'secondary' : 'ghost'}
                        className="w-full justify-start text-sm"
                        onClick={() => selectCategory(category)}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Note: Full category integration with the GW2 API requires additional endpoints.
            This is a placeholder structure showing how categories would be organized.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
