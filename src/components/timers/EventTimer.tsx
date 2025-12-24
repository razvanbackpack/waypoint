import { useState, useEffect, useMemo } from 'react';
import { GAME_EVENTS, getNextSpawn } from '@/data/eventSchedule';
import type { GameEvent } from '@/data/eventSchedule';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Copy, Star, ChevronDown, ChevronRight } from 'lucide-react';

interface EventWithSpawn {
  event: GameEvent;
  nextSpawn: Date;
  minutesUntil: number;
}

interface EventTimerProps {
  favorites: Set<string>;
  toggleFavorite: (id: string) => void;
}

export function EventTimer({ favorites, toggleFavorite }: EventTimerProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifiedEvents, setNotifiedEvents] = useState<Set<string>>(new Set());
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCollapsed, setActiveCollapsed] = useState(false);
  const [upcomingCollapsed, setUpcomingCollapsed] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const eventsWithSpawns = useMemo(() => {
    const events: EventWithSpawn[] = GAME_EVENTS.map((event) => {
      const { nextSpawn, minutesUntil } = getNextSpawn(event.spawnMinutes, event.duration);
      return { event, nextSpawn, minutesUntil };
    });

    return events.sort((a, b) => a.minutesUntil - b.minutesUntil);
  }, [currentTime]);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'granted') {
      eventsWithSpawns.forEach(({ event, minutesUntil }) => {
        const notificationKey = `${event.id}-${Math.floor(Date.now() / 60000)}`;

        if (minutesUntil === 5 && !notifiedEvents.has(notificationKey)) {
          new Notification(`${event.name} starting in 5 minutes!`, {
            silent: true,
            icon: event.icon,
            body: `Get ready at ${event.map}`,
          });
          setNotifiedEvents((prev) => new Set(prev).add(notificationKey));
        }
      });
    }
  }, [eventsWithSpawns, notifiedEvents]);

  const filteredEvents = useMemo(() => {
    return eventsWithSpawns.filter(({ event, minutesUntil }) => {
      // Type filter
      if (typeFilter !== 'all' && event.type !== typeFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && event.category !== categoryFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === 'active' && !(minutesUntil <= 0 && minutesUntil > -event.duration)) {
        return false;
      }
      if (statusFilter === '15min' && minutesUntil > 15) {
        return false;
      }
      if (statusFilter === '30min' && minutesUntil > 30) {
        return false;
      }

      // Search filter
      if (searchQuery && !event.name.toLowerCase().includes(searchQuery.toLowerCase()) && !event.map.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [eventsWithSpawns, typeFilter, categoryFilter, statusFilter, searchQuery]);

  const formatCountdown = (minutesUntil: number, nextSpawn: Date, duration: number) => {
    if (minutesUntil <= 0 && minutesUntil > -duration) {
      return <span className="font-bold text-green-500 text-base">NOW</span>;
    }

    const now = new Date();
    const diff = nextSpawn.getTime() - now.getTime();
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Add urgency styling for events starting soon
    const isUrgent = minutesUntil > 0 && minutesUntil <= 5;
    const timeClass = isUrgent ? 'text-red-500 font-bold' : 'text-gw2-gold';

    if (hours > 0) {
      return <span className={timeClass}>{hours}h {minutes}m {seconds}s</span>;
    }
    return <span className={timeClass}>{minutes}m {seconds}s</span>;
  };

  const getStatusBadge = (minutesUntil: number, duration: number) => {
    if (minutesUntil <= 0 && minutesUntil > -duration) {
      return <Badge className="bg-green-500/20 text-green-500 border-green-500/50 font-bold text-xs py-0 px-1.5">Active</Badge>;
    }
    if (minutesUntil > 0 && minutesUntil <= 15) {
      return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/50 text-xs py-0 px-1.5">Soon</Badge>;
    }
    return <Badge variant="outline" className="text-muted-foreground text-xs py-0 px-1.5">Upcoming</Badge>;
  };

  const getTypeBadge = (type: 'boss' | 'meta') => {
    if (type === 'boss') {
      return <Badge className="bg-red-500/20 text-red-500 border-red-500/50 text-xs py-0 px-1.5">Boss</Badge>;
    }
    return <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/50 text-xs py-0 px-1.5">Meta</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      core: 'bg-gray-500/20 text-gray-400 border-gray-500/50',
      hot: 'bg-teal-500/20 text-teal-400 border-teal-500/50',
      pof: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      ibs: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      eod: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      soto: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    };

    const categoryLabels: Record<string, string> = {
      core: 'Core',
      hot: 'HoT',
      pof: 'PoF',
      ibs: 'IBS',
      eod: 'EoD',
      soto: 'SotO',
    };

    return (
      <Badge className={`${categoryColors[category]} text-xs py-0 px-1.5`}>
        {categoryLabels[category]}
      </Badge>
    );
  };

  const getRowClass = (minutesUntil: number, duration: number, index: number) => {
    // Active events - green glow
    if (minutesUntil <= 0 && minutesUntil > -duration) {
      return 'bg-green-500/10 hover:bg-green-500/15 transition-all duration-200';
    }
    // Urgent events (< 5 min) - gold glow with animation
    if (minutesUntil > 0 && minutesUntil <= 5) {
      return 'bg-gw2-gold/20 hover:bg-gw2-gold/30 shadow-[0_0_15px_rgba(201,162,39,0.3)] transition-all duration-200';
    }
    // Soon events (5-15 min) - yellow highlight
    if (minutesUntil > 0 && minutesUntil <= 15) {
      return 'bg-yellow-500/10 hover:bg-yellow-500/15 transition-all duration-200';
    }
    return index % 2 === 0 ? 'bg-muted/20 hover:bg-muted/30 transition-colors duration-200' : 'bg-background hover:bg-muted/20 transition-colors duration-200';
  };

  if (eventsWithSpawns.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No events available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex items-center justify-end gap-4 flex-wrap">
        <div className="flex flex-wrap gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="boss">Bosses</SelectItem>
              <SelectItem value="meta">Metas</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px] h-8 text-xs">
              <SelectValue placeholder="Expansion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Expansions</SelectItem>
              <SelectItem value="core">Core Tyria</SelectItem>
              <SelectItem value="hot">Heart of Thorns</SelectItem>
              <SelectItem value="pof">Path of Fire</SelectItem>
              <SelectItem value="ibs">Icebrood Saga</SelectItem>
              <SelectItem value="eod">End of Dragons</SelectItem>
              <SelectItem value="soto">Secrets of the Obscure</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active Now</SelectItem>
              <SelectItem value="15min">Next 15min</SelectItem>
              <SelectItem value="30min">Next 30min</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[160px] h-8 text-xs"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-gw2-gold/20 rounded-lg overflow-hidden shadow-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="sticky top-0 z-10 border-b border-gw2-gold/30 bg-card/95 backdrop-blur text-left">
              <th className="py-2 px-3 font-medium text-xs w-8 text-gw2-gold/70"></th>
              <th className="py-2 px-3 font-medium text-xs text-gw2-gold/70">Event ({filteredEvents.length})</th>
              <th className="py-2 px-3 font-medium text-xs text-gw2-gold/70">Map</th>
              <th className="py-2 px-3 font-medium text-xs text-gw2-gold/70">Time</th>
              <th className="py-2 px-3 font-medium text-xs text-gw2-gold/70">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground text-xs">
                  No events match your filters
                </td>
              </tr>
            ) : (
              <>
                {/* Active Events Section */}
                {(() => {
                  const activeEvents = filteredEvents.filter(
                    ({ event, minutesUntil }) => minutesUntil <= 0 && minutesUntil > -event.duration
                  );
                  if (activeEvents.length === 0) return null;
                  return (
                    <>
                      <tr
                        className="bg-green-500/20 cursor-pointer hover:bg-green-500/30 transition-colors border-y border-green-500/30"
                        onClick={() => setActiveCollapsed(!activeCollapsed)}
                      >
                        <td colSpan={5} className="py-3 px-3">
                          <div className="flex items-center gap-2 font-semibold text-green-400 text-sm">
                            {activeCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            Active Now ({activeEvents.length})
                          </div>
                        </td>
                      </tr>
                      {!activeCollapsed && activeEvents.map(({ event, nextSpawn, minutesUntil }, index) => (
                        <tr key={event.id} className={`border-b border-gw2-gold/10 ${getRowClass(minutesUntil, event.duration, index)}`}>
                          <td className="py-2 px-3">
                            <button
                              onClick={() => toggleFavorite(event.id)}
                              className="hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  favorites.has(event.id)
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{event.icon}</span>
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-sm">{event.name}</span>
                                <div className="flex gap-1">
                                  {getTypeBadge(event.type)}
                                  {getCategoryBadge(event.category)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td
                            className="py-2 px-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => {
                              if (event.waypoint) {
                                navigator.clipboard.writeText(event.waypoint);
                                toast.success('Waypoint copied!');
                              }
                            }}
                            title={event.waypoint ? `Click to copy: ${event.waypoint}` : undefined}
                          >
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                <span className="text-sm">{event.map}</span>
                                {event.waypoint && <Copy className="h-3 w-3 opacity-50" />}
                              </div>
                              {event.waypoint && (
                                <code className="text-xs text-muted-foreground/70 font-mono">{event.waypoint}</code>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <div className="font-mono text-sm">
                              {formatCountdown(minutesUntil, nextSpawn, event.duration)}
                            </div>
                            {minutesUntil > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {nextSpawn.toLocaleTimeString([], {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-3">{getStatusBadge(minutesUntil, event.duration)}</td>
                        </tr>
                      ))}
                    </>
                  );
                })()}

                {/* Upcoming Events Section */}
                {(() => {
                  const upcomingEvents = filteredEvents.filter(({ minutesUntil }) => minutesUntil > 0);
                  if (upcomingEvents.length === 0) return null;
                  return (
                    <>
                      <tr
                        className="bg-blue-500/20 cursor-pointer hover:bg-blue-500/30 transition-colors border-y border-blue-500/30"
                        onClick={() => setUpcomingCollapsed(!upcomingCollapsed)}
                      >
                        <td colSpan={5} className="py-3 px-3">
                          <div className="flex items-center gap-2 font-semibold text-blue-400 text-sm">
                            {upcomingCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                            Upcoming ({upcomingEvents.length})
                          </div>
                        </td>
                      </tr>
                      {!upcomingCollapsed && upcomingEvents.map(({ event, nextSpawn, minutesUntil }, index) => (
                        <tr key={event.id} className={`border-b border-gw2-gold/10 ${getRowClass(minutesUntil, event.duration, index)}`}>
                          <td className="py-2 px-3">
                            <button
                              onClick={() => toggleFavorite(event.id)}
                              className="hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`h-4 w-4 ${
                                  favorites.has(event.id)
                                    ? 'text-yellow-500 fill-yellow-500'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="py-2 px-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{event.icon}</span>
                              <div className="flex flex-col gap-1">
                                <span className="font-medium text-sm">{event.name}</span>
                                <div className="flex gap-1">
                                  {getTypeBadge(event.type)}
                                  {getCategoryBadge(event.category)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td
                            className="py-2 px-3 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => {
                              if (event.waypoint) {
                                navigator.clipboard.writeText(event.waypoint);
                                toast.success('Waypoint copied!');
                              }
                            }}
                            title={event.waypoint ? `Click to copy: ${event.waypoint}` : undefined}
                          >
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                <span className="text-sm">{event.map}</span>
                                {event.waypoint && <Copy className="h-3 w-3 opacity-50" />}
                              </div>
                              {event.waypoint && (
                                <code className="text-xs text-muted-foreground/70 font-mono">{event.waypoint}</code>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <div className="font-mono text-sm">
                              {formatCountdown(minutesUntil, nextSpawn, event.duration)}
                            </div>
                            {minutesUntil > 0 && (
                              <div className="text-xs text-muted-foreground">
                                {nextSpawn.toLocaleTimeString([], {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </div>
                            )}
                          </td>
                          <td className="py-2 px-3">{getStatusBadge(minutesUntil, event.duration)}</td>
                        </tr>
                      ))}
                    </>
                  );
                })()}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Results count */}
      <div className="text-xs text-muted-foreground">
        Showing {filteredEvents.length} of {eventsWithSpawns.length} events
      </div>
    </div>
  );
}
