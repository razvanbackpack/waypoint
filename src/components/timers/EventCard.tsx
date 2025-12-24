import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import type { GameEvent } from '@/data/eventSchedule';

interface EventCardProps {
  boss: GameEvent;
  nextSpawn: Date;
}

export function EventCard({ boss, nextSpawn }: EventCardProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const diff = nextSpawn.getTime() - now.getTime();
      setTimeLeft(Math.max(0, diff));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [nextSpawn]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const totalMinutes = Math.floor(timeLeft / (1000 * 60));
  const isActive = totalMinutes <= 0 && totalMinutes > -15;
  const isImminentGreen = totalMinutes > 0 && totalMinutes < 15;
  const isImminentYellow = totalMinutes >= 15 && totalMinutes < 30;

  let cardClass = 'border-border';
  let timeColor = 'text-foreground';

  if (isActive) {
    cardClass = 'border-[#C59C61] bg-[#C59C61]/5';
    timeColor = 'text-[#C59C61]';
  } else if (isImminentGreen) {
    cardClass = 'border-green-500/50 bg-green-500/5';
    timeColor = 'text-green-500';
  } else if (isImminentYellow) {
    cardClass = 'border-yellow-500/50 bg-yellow-500/5';
    timeColor = 'text-yellow-500';
  }

  const formatTime = () => {
    if (isActive) {
      return 'Active now!';
    }
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  return (
    <Card className={`transition-colors ${cardClass}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{boss.icon}</div>
            <div>
              <div className="font-semibold">{boss.name}</div>
              <div className="text-sm text-muted-foreground">{boss.map}</div>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold font-mono ${timeColor}`}>
              {formatTime()}
            </div>
            {!isActive && (
              <div className="text-xs text-muted-foreground">
                {nextSpawn.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: 'UTC',
                  hour12: false,
                })}{' '}
                UTC
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
