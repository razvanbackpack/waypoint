import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export function MonthlyResetTimer() {
  const [timeUntilReset, setTimeUntilReset] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTimeUntilReset = () => {
      const now = new Date();
      const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);

      // Find 1st of next month at 00:00 UTC
      const resetTime = new Date(utcNow);
      resetTime.setUTCMonth(resetTime.getUTCMonth() + 1);
      resetTime.setUTCDate(1);
      resetTime.setUTCHours(0, 0, 0, 0);

      const diff = resetTime.getTime() - utcNow.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Check if less than 1 hour remaining
      setIsUrgent(days === 0 && hours < 1);

      if (days > 0) {
        return `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
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
      <span className="text-sm text-muted-foreground">Monthly reset in:</span>
      <span className={`font-mono text-lg font-bold ${isUrgent ? 'text-warning' : 'text-gw2-accent'}`}>
        {timeUntilReset}
      </span>
    </div>
  );
}
