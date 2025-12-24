import { useState, useEffect } from 'react';
import { EventTimer } from '@/components/timers/EventTimer';
import { EventSidebar } from '@/components/timers/EventSidebar';
import { getTimeUntilDailyReset } from '@/data/eventSchedule';
import { Clock } from 'lucide-react';

export function Timers() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [resetTime, setResetTime] = useState(getTimeUntilDailyReset());
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('gw2-event-favorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      setResetTime(getTimeUntilDailyReset());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('gw2-event-favorites', JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-gw2-gold" />
          <h1 className="text-2xl font-bold text-gw2-gold">Event Timers</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Track world bosses and meta events across Tyria. Never miss a spawn again.
        </p>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-6">
        {/* Main content - table */}
        <div className="flex-1 min-w-0 max-w-4xl">
          <EventTimer favorites={favorites} toggleFavorite={toggleFavorite} />
        </div>

        {/* Sidebar - sticky on scroll */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-20 space-y-4">
            <EventSidebar currentTime={currentTime} resetTime={resetTime} favorites={favorites} toggleFavorite={toggleFavorite} />
          </div>
        </div>
      </div>
    </div>
  );
}
