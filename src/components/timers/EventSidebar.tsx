import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GAME_EVENTS, getNextSpawn } from '@/data/eventSchedule';
import { Clock, Star, Copy, X } from 'lucide-react';
import { toast } from 'sonner';

interface EventSidebarProps {
  currentTime: Date;
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
}

export function EventSidebar({ currentTime, favorites, toggleFavorite }: EventSidebarProps) {
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
      <Card className="border-0">
        <CardContent className="py-2 px-3 space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-gw2-gold" />
            <span className="font-mono tabular-nums font-bold">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'UTC', hour12: false })}
            </span>
            <span className="text-muted-foreground text-xs">UTC</span>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="flex-1 justify-center py-1 text-xs bg-success/10 text-success border-success/30">
              {activeEvents.length} Active
            </Badge>
            <Badge variant="outline" className="flex-1 justify-center py-1 text-xs bg-warning/10 text-warning border-warning/30">
              {soonCount} in 15m
            </Badge>
          </div>
        </CardContent>
      </Card>


      {/* Favorites - only show if there are actual matching events */}
      {(() => {
        const favoriteEvents = eventsWithSpawns.filter(e => favorites.has(e.event.id));
        if (favoriteEvents.length === 0) return null;
        return (
          <Card className="border-0">
            <CardContent className="py-2 px-2 space-y-1.5">
              <div className="text-xs font-medium text-gw2-gold flex items-center gap-1 heading-accent">
                <Star className="h-3.5 w-3.5 fill-current" /> Favorites
              </div>
              {favoriteEvents
              .map(({ event, minutesUntil }) => (
                <div key={event.id} className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm">{event.icon}</span>
                    <span className="font-medium text-xs flex-1 truncate">{event.name}</span>
                    <Badge className={event.type === 'boss'
                      ? 'bg-red-700/20 text-red-700 border-red-700/50 dark:bg-red-500/20 dark:text-red-500 dark:border-red-500/50 text-[10px] py-0 px-1'
                      : 'bg-blue-700/20 text-blue-700 border-blue-700/50 dark:bg-blue-500/20 dark:text-blue-500 dark:border-blue-500/50 text-[10px] py-0 px-1'
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
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-[10px] pl-5">
                    <span
                      className="text-muted-foreground cursor-pointer hover:text-foreground transition-colors flex items-center gap-1"
                      onClick={() => {
                        if (event.waypoint) {
                          navigator.clipboard.writeText(event.waypoint);
                          toast.success('Waypoint copied!');
                        }
                      }}
                      title={event.waypoint ? `Click to copy: ${event.waypoint}` : undefined}
                    >
                      {event.map}
                      {event.waypoint && <Copy className="h-2.5 w-2.5 opacity-50" />}
                    </span>
                    <span className={`font-mono tabular-nums font-bold ${minutesUntil <= 0 ? 'text-success' : minutesUntil <= 15 ? 'text-warning' : 'text-gw2-gold'}`}>
                      {minutesUntil <= 0 ? 'NOW' : minutesUntil < 60 ? `${Math.floor(minutesUntil)}m` : `${Math.floor(minutesUntil / 60)}h ${Math.floor(minutesUntil % 60)}m`}
                    </span>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
        );
      })()}
    </>
  );
}
