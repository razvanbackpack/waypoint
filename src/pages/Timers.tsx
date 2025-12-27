import { useState, useEffect } from 'react';
import { EventTimer } from '@/components/timers/EventTimer';
import { EventSidebar } from '@/components/timers/EventSidebar';
import { Button } from '@/components/ui/button';
import { Clock, Bell, BellOff } from 'lucide-react';

export function Timers() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('gw2-event-favorites');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-6 w-6 text-gw2-gold" />
            <h1 className="text-2xl font-bold text-gw2-gold">Event Timers</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => {
              if (!notificationsEnabled && 'Notification' in window) {
                Notification.requestPermission().then(p => {
                  if (p === 'granted') setNotificationsEnabled(true);
                });
              } else {
                setNotificationsEnabled(!notificationsEnabled);
              }
            }}
          >
            {notificationsEnabled ? <Bell className="h-4 w-4 mr-2" /> : <BellOff className="h-4 w-4 mr-2" />}
            <span className="text-xs">{notificationsEnabled ? 'Notifications On' : 'Notifications Off'}</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-6">
        {/* Main content - table */}
        <div className="flex-1 min-w-0">
          <EventTimer favorites={favorites} toggleFavorite={toggleFavorite} />
        </div>

        {/* Sidebar - sticky on scroll */}
        <div className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-20 space-y-4">
            <EventSidebar currentTime={currentTime} favorites={favorites} toggleFavorite={toggleFavorite} />
          </div>
        </div>
      </div>
    </div>
  );
}
