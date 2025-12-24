import { Check } from 'lucide-react';
import type { Achievement, AccountAchievement } from '@/api/types';

interface DailyCardProps {
  achievement: Achievement;
  accountProgress?: AccountAchievement;
  levelReq?: { min: number; max: number };
  onToggle?: () => void;
  manualCompletion?: boolean;
  compact?: boolean;
}

export function DailyCard({
  achievement,
  accountProgress,
  levelReq,
  onToggle,
  manualCompletion = false,
  compact = false
}: DailyCardProps) {
  const isCompleted = accountProgress?.done || manualCompletion;
  const points = achievement.tiers[0]?.points || 0;
  const showLevelBadge = levelReq && (levelReq.min !== 1 || levelReq.max !== 80);

  if (compact) {
    return (
      <div
        className={`flex items-center gap-2 p-2 rounded border transition-colors cursor-pointer ${
          isCompleted
            ? 'bg-green-500/10 border-green-500/30'
            : 'bg-card hover:bg-muted/50'
        }`}
        onClick={onToggle}
        title={achievement.description || achievement.name}
      >
        {achievement.icon && (
          <img
            src={achievement.icon}
            alt=""
            className="w-6 h-6 rounded flex-shrink-0"
            loading="lazy"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
            {achievement.name}
          </p>
        </div>
        {isCompleted && <Check className="h-4 w-4 text-green-500 flex-shrink-0" />}
      </div>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border transition-colors ${
        isCompleted
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-card hover:bg-muted/50'
      }`}
    >
      {achievement.icon && (
        <img
          src={achievement.icon}
          alt=""
          className="w-12 h-12 rounded flex-shrink-0"
          loading="lazy"
        />
      )}

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <h4 className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
            {achievement.name}
          </h4>
          <div className="flex items-center gap-2 flex-shrink-0">
            {showLevelBadge && (
              <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-medium">
                Lvl {levelReq.min}-{levelReq.max}
              </span>
            )}
            <span className="text-sm font-bold" style={{ color: '#C9A227' }}>
              {points} AP
            </span>
          </div>
        </div>

        {achievement.description && (
          <p className="text-sm text-muted-foreground">
            {achievement.description}
          </p>
        )}

        {achievement.requirement && achievement.requirement !== achievement.description && (
          <p className="text-xs text-muted-foreground/80 italic">
            {achievement.requirement}
          </p>
        )}
      </div>

      {isCompleted && <Check className="h-5 w-5 text-green-500 flex-shrink-0" />}
    </div>
  );
}
