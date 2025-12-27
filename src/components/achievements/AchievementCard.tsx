import type { Achievement, AccountAchievement } from '@/api/types';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AchievementProgress } from './AchievementProgress';
import { Lock, Trophy, Gift } from 'lucide-react';

interface AchievementCardProps {
  achievement: Achievement;
  accountProgress?: AccountAchievement;
}

export function AchievementCard({ achievement, accountProgress }: AchievementCardProps) {
  const isLocked = achievement.flags.includes('Locked') ||
    (achievement.prerequisites && achievement.prerequisites.length > 0 && !accountProgress);
  const isCompleted = accountProgress?.done || false;
  const totalPoints = achievement.tiers.reduce((sum, tier) => sum + tier.points, 0);

  return (
    <Card className={`card-interactive ${isCompleted ? 'border-success/30 bg-success/5' : ''}`}>
      <CardHeader>
        <div className="flex items-start gap-4">
          {achievement.icon && (
            <img
              loading="lazy"
              src={achievement.icon}
              alt={achievement.name}
              className="w-16 h-16 rounded-lg"
            />
          )}
          <div className="flex-1 space-y-1">
            <CardTitle className="flex items-center gap-2">
              {achievement.name}
              {isCompleted && <Trophy className="h-5 w-5 text-success" />}
              {isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{achievement.type}</span>
              <span>•</span>
              <span className="font-bold text-gw2-gold">
                {totalPoints} AP
              </span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLocked ? (
          <div className="text-sm text-muted-foreground italic">
            {achievement.locked_text || 'This achievement is locked.'}
          </div>
        ) : (
          <>
            <div className="text-sm">{achievement.description}</div>
            {achievement.requirement && (
              <div className="text-sm text-muted-foreground">
                {achievement.requirement}
              </div>
            )}
          </>
        )}

        {!isLocked && accountProgress && (
          <AchievementProgress achievement={achievement} accountProgress={accountProgress} />
        )}

        {achievement.rewards && achievement.rewards.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Gift className="h-4 w-4" />
              Rewards
            </div>
            <div className="flex flex-wrap gap-2">
              {achievement.rewards.map((reward, index) => (
                <div
                  key={index}
                  className="px-3 py-1 bg-muted rounded-full text-xs"
                >
                  {reward.type === 'Item' && reward.count && `${reward.count}x `}
                  {reward.type}
                  {reward.id && ` #${reward.id}`}
                </div>
              ))}
            </div>
          </div>
        )}

        {achievement.flags.includes('Repeatable') && (
          <div className="text-xs text-muted-foreground">
            Repeatable achievement
            {achievement.point_cap && ` (max ${achievement.point_cap} AP)`}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
