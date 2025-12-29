import { CheckCircle2, Circle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { WizardsVaultObjective } from '@/api/types';

interface AchievementObjectiveCardProps {
  objective: WizardsVaultObjective;
}

export function AchievementObjectiveCard({ objective }: AchievementObjectiveCardProps) {
  const isComplete = objective.progress_current >= objective.progress_complete;
  const progressPercent = (objective.progress_current / objective.progress_complete) * 100;

  return (
    <Card className={isComplete ? 'bg-muted/50' : ''}>
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          {isComplete ? (
            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
          ) : (
            <Circle className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          )}

          <div className="flex-1 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm font-medium ${isComplete ? 'line-through text-muted-foreground' : ''}`}>
                  {objective.title}
                </h4>
                {objective.track && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {objective.track}
                  </p>
                )}
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-xs font-medium text-gw2-accent">
                  {objective.acclaim}
                </div>
                <div className="text-xs text-muted-foreground font-mono">
                  {objective.progress_current}/{objective.progress_complete}
                </div>
              </div>
            </div>

            {!isComplete && (
              <Progress value={progressPercent} className="h-1.5" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
