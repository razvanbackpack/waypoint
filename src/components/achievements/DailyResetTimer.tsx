import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export function DailyResetTimer() {
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTimeUntilReset = () => {
      const now = new Date();
      const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

      const resetTime = new Date(utcNow);
      resetTime.setUTCHours(24, 0, 0, 0);

      const diff = resetTime.getTime() - utcNow.getTime();

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Check if less than 1 hour remaining
      setIsUrgent(hours < 1);

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const updateTimer = () => {
      setTimeUntilReset(calculateTimeUntilReset());
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <Clock className={`h-4 w-4 ${isUrgent ? 'text-warning' : 'text-muted-foreground'}`} />
      <span className="text-sm text-muted-foreground">Daily reset in:</span>
      <span className={`font-mono text-lg font-bold ${isUrgent ? 'text-warning' : 'text-gw2-accent'}`}>
        {timeUntilReset}
      </span>
    </div>
  );
}
