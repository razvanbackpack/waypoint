import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DailyCard } from './DailyCard';
import type { Achievement, AccountAchievement } from '@/api/types';

interface DailyCategoryProps {
  title: string;
  dailyIds: number[];
  achievements?: Achievement[];
  accountAchievements?: AccountAchievement[];
  levelReqs?: Array<{ id: number; level: { min: number; max: number } }>;
  completedIds?: Set<number>;
  onToggleDaily?: (id: number) => void;
  defaultExpanded?: boolean;
  compact?: boolean;
}

export function DailyCategory({
  title,
  dailyIds,
  achievements = [],
  accountAchievements = [],
  levelReqs = [],
  completedIds = new Set(),
  onToggleDaily,
  defaultExpanded = true,
  compact = false
}: DailyCategoryProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (dailyIds.length === 0) {
    return null;
  }

  const categoryAchievements = achievements.filter(a => dailyIds.includes(a.id));
  const completedCount = categoryAchievements.filter(achievement => {
    const accountProgress = accountAchievements.find(a => a.id === achievement.id);
    return accountProgress?.done || completedIds.has(achievement.id);
  }).length;

  return (
    <Card className={compact ? 'border-0 shadow-none' : ''}>
      <CardHeader
        className={`cursor-pointer hover:bg-muted/50 transition-colors ${compact ? 'py-2 px-3' : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className={`flex items-center gap-2 heading-accent ${compact ? 'text-base' : ''}`}>
            {isExpanded ? (
              <ChevronDown className={`text-muted-foreground transition-transform duration-200 ${compact ? 'h-4 w-4' : 'h-5 w-5'}`} />
            ) : (
              <ChevronRight className={`text-muted-foreground transition-transform duration-200 ${compact ? 'h-4 w-4' : 'h-5 w-5'}`} />
            )}
            <span className="text-gw2-accent">{title}</span>
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {completedCount} / {categoryAchievements.length}
          </span>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className={compact ? 'px-3 pb-3 pt-0' : ''}>
          {categoryAchievements.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No {title.toLowerCase()} dailies available
            </div>
          ) : (
            <div className={compact ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2' : 'space-y-2'}>
              {categoryAchievements.map(achievement => {
                const accountProgress = accountAchievements.find(a => a.id === achievement.id);
                const levelReq = levelReqs.find(l => l.id === achievement.id)?.level;
                const manualCompletion = completedIds.has(achievement.id);

                return (
                  <DailyCard
                    key={achievement.id}
                    achievement={achievement}
                    accountProgress={accountProgress}
                    levelReq={levelReq}
                    onToggle={onToggleDaily ? () => onToggleDaily(achievement.id) : undefined}
                    manualCompletion={manualCompletion}
                    compact={compact}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
