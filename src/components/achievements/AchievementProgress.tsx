import type { Achievement, AccountAchievement } from '@/api/types';
import { Progress } from '@/components/ui/progress';

interface AchievementProgressProps {
  achievement: Achievement;
  accountProgress?: AccountAchievement;
}

export function AchievementProgress({ achievement, accountProgress }: AchievementProgressProps) {
  const current = accountProgress?.current || 0;
  const max = accountProgress?.max || achievement.tiers[0]?.count || 1;
  const percentage = (current / max) * 100;

  if (achievement.bits && achievement.bits.length > 0) {
    const completedBits = accountProgress?.bits || [];
    return (
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          {completedBits.length} / {achievement.bits.length} objectives completed
        </div>
        <div className="space-y-1">
          {achievement.bits.map((bit, index) => {
            const isCompleted = completedBits.includes(index);
            return (
              <label
                key={index}
                className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isCompleted}
                  readOnly
                  className="h-4 w-4 rounded border-border"
                />
                <span className={isCompleted ? 'line-through text-muted-foreground' : ''}>
                  {bit.text || `Objective ${index + 1}`}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  if (achievement.tiers.length > 1) {
    return (
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          Tier {(accountProgress?.repeated || 0) + 1} of {achievement.tiers.length}
        </div>
        {achievement.tiers.map((tier, index) => {
          const isComplete = (accountProgress?.repeated || 0) > index;
          const isCurrent = (accountProgress?.repeated || 0) === index;
          return (
            <div key={index} className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full ${
                  isComplete
                    ? 'bg-success'
                    : isCurrent
                    ? 'bg-gw2-gold'
                    : 'bg-muted'
                }`}
              />
              <span className={isComplete ? 'text-muted-foreground' : ''}>
                Tier {index + 1}: {tier.count} ({tier.points} AP)
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  if (accountProgress?.repeated && accountProgress.repeated > 0) {
    return (
      <div className="space-y-2">
        <div className="text-sm">
          Completed {accountProgress.repeated} time{accountProgress.repeated !== 1 ? 's' : ''}
        </div>
        {achievement.point_cap && (
          <div className="text-sm text-muted-foreground">
            Points earned: {Math.min(accountProgress.repeated * (achievement.tiers[0]?.points || 0), achievement.point_cap)} / {achievement.point_cap}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progress</span>
        <span className="font-mono">
          {current} / {max} <span className="text-muted-foreground">({Math.round(percentage)}%)</span>
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
