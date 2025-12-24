import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GAME_EVENTS, getNextSpawn } from '@/data/eventSchedule';
import { Clock, Bell, BellOff, Star, Copy, X } from 'lucide-react';
import { toast } from 'sonner';

interface EventSidebarProps {
  currentTime: Date;
  resetTime: { hours: number; minutes: number; seconds: number };
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
}

export function EventSidebar({ currentTime, resetTime, favorites, toggleFavorite }: EventSidebarProps) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const eventsWithSpawns = useMemo(() => {
    return GAME_EVENTS.map(event => {
      const { nextSpawn, minutesUntil } = getNextSpawn(event.spawnMinutes, event.duration);
      return { event, nextSpawn, minutesUntil };
    }).sort((a, b) => a.minutesUntil - b.minutesUntil);
  }, [currentTime]);

  const activeEvents = eventsWithSpawns.filter(e => e.minutesUntil <= 0 && e.minutesUntil > -e.event.duration);
  const soonCount = eventsWithSpawns.filter(e => e.minutesUntil > 0 && e.minutesUntil <= 15).length;

  return (
    <>
      {/* Compact Time, Reset & Stats */}
      <Card>
        <CardContent className="py-2 px-3 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#C59C61]" />
              <span className="font-mono font-bold">
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC', hour12: false })}
              </span>
              <span className="text-muted-foreground text-xs">UTC</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-muted-foreground">Reset </span>
              <span className="font-mono text-[#C59C61] text-xs">{resetTime.hours}h {resetTime.minutes}m</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex-1 justify-center py-1 text-xs bg-green-500/10 text-green-500 border-green-500/30">
              {activeEvents.length} Active
            </Badge>
            <Badge variant="outline" className="flex-1 justify-center py-1 text-xs bg-yellow-500/10 text-yellow-500 border-yellow-500/30">
              {soonCount} in 15m
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Notifications Toggle */}
      <Button
        variant="outline"
        size="sm"
        className="w-full h-8"
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

      {/* Active Now */}
      {activeEvents.length > 0 && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardContent className="py-2 px-3 space-y-1.5">
            <div className="text-xs font-medium text-green-500 mb-1">Active Now</div>
            {activeEvents.slice(0, 3).map(({ event }) => (
              <div key={event.id} className="flex items-center gap-2 text-xs">
                <span className="text-sm">{event.icon}</span>
                <span className="truncate flex-1">{event.name}</span>
                <Badge className="bg-green-500/20 text-green-500 text-xs py-0 px-1">NOW</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Favorites */}
      {favorites.size > 0 && (
        <Card className="border-yellow-500/30">
          <CardContent className="py-3 px-3 space-y-3">
            <div className="text-sm font-medium text-yellow-500 flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-yellow-500" /> Favorites
            </div>
            {eventsWithSpawns
              .filter(e => favorites.has(e.event.id))
              .map(({ event, nextSpawn, minutesUntil }) => (
                <div key={event.id} className="space-y-1 pb-2 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{event.icon}</span>
                    <span className="font-medium text-sm flex-1 truncate">{event.name}</span>
                    <Badge className={event.type === 'boss'
                      ? 'bg-red-500/20 text-red-500 border-red-500/50 text-xs py-0 px-1'
                      : 'bg-blue-500/20 text-blue-500 border-blue-500/50 text-xs py-0 px-1'
                    }>
                      {event.type === 'boss' ? 'Boss' : 'Meta'}
                    </Badge>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(event.id);
                      }}
                      className="opacity-50 hover:opacity-100 hover:text-red-500 transition-all"
                      title="Remove from favorites"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div
                    className="flex items-center gap-1 text-xs text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => {
                      if (event.waypoint) {
                        navigator.clipboard.writeText(event.waypoint);
                        toast.success('Waypoint copied!');
                      }
                    }}
                    title={event.waypoint ? `Click to copy: ${event.waypoint}` : undefined}
                  >
                    <span>{event.map}</span>
                    {event.waypoint && <Copy className="h-3 w-3 opacity-50" />}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {nextSpawn.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </span>
                    <span className="font-mono font-bold text-[#C59C61]">
                      {minutesUntil <= 0 ? 'NOW' : minutesUntil < 60 ? `${Math.floor(minutesUntil)}m` : `${Math.floor(minutesUntil / 60)}h ${Math.floor(minutesUntil % 60)}m`}
                    </span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </>
  );
}
