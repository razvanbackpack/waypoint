import { useState, useEffect, useMemo } from 'react';
import { GAME_EVENTS, getNextSpawn } from '@/data/eventSchedule';
import type { GameEvent } from '@/data/eventSchedule';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { Copy, Star, ChevronRight, ChevronDown, Check } from 'lucide-react';

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
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const [categoryFilters, setCategoryFilters] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Color definitions for filter options
  const typeColors: Record<string, string> = {
    boss: '#f97316', // orange
    meta: '#a855f7', // purple
  };

  const categoryColors: Record<string, string> = {
    core: '#9ca3af', // gray
    hot: '#22c55e', // green
    pof: '#eab308', // yellow/gold
    ibs: '#3b82f6', // blue
    eod: '#14b8a6', // teal/cyan
    soto: '#ec4899', // pink/magenta
    jw: '#10b981',  // emerald green for Janthir Wilds
    voe: '#f59e0b', // amber/orange for Visions of Eternity
  };

  // Toggle helper for multi-select filters
  const toggleTypeFilter = (type: string) => {
    setTypeFilters(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const toggleCategoryFilter = (category: string) => {
    setCategoryFilters(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
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
      // Type filter (multi-select: empty array = show all)
      if (typeFilters.length > 0 && !typeFilters.includes(event.type)) {
        return false;
      }

      // Category filter (multi-select: empty array = show all)
      if (categoryFilters.length > 0 && !categoryFilters.includes(event.category)) {
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
  }, [eventsWithSpawns, typeFilters, categoryFilters, statusFilter, searchQuery]);

  const formatCountdown = (minutesUntil: number, nextSpawn: Date, duration: number) => {
    if (minutesUntil <= 0 && minutesUntil > -duration) {
      return <span className="font-bold text-success text-base">NOW</span>;
    }

    const now = new Date();
    const diff = nextSpawn.getTime() - now.getTime();
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Add urgency styling for events starting soon
    const isUrgent = minutesUntil > 0 && minutesUntil <= 5;
    const isUpcoming = minutesUntil > 5 && minutesUntil <= 15;
    const timeClass = isUrgent ? 'text-destructive font-bold' : isUpcoming ? 'text-warning' : 'text-gw2-gold';

    if (hours > 0) {
      return <span className={`font-mono tabular-nums ${timeClass}`}>{hours}h {minutes}m {seconds}s</span>;
    }
    return <span className={`font-mono tabular-nums ${timeClass}`}>{minutes}m {seconds}s</span>;
  };

  const getStatusBadge = (minutesUntil: number, duration: number) => {
    if (minutesUntil <= 0 && minutesUntil > -duration) {
      return <Badge className="bg-success/10 text-success border-success/50 font-bold text-xs py-0 px-1.5">Active</Badge>;
    }
    if (minutesUntil > 0 && minutesUntil <= 15) {
      return <Badge className="bg-warning/10 text-warning border-warning/50 text-xs py-0 px-1.5">Soon</Badge>;
    }
    return <Badge variant="outline" className="text-muted-foreground text-xs py-0 px-1.5">Upcoming</Badge>;
  };

  const getTypeBadge = (type: 'boss' | 'meta') => {
    if (type === 'boss') {
      return <Badge className="bg-red-700/20 text-red-700 border-red-700/50 dark:bg-red-500/20 dark:text-red-500 dark:border-red-500/50 text-xs py-0 px-1.5">Boss</Badge>;
    }
    return <Badge className="bg-blue-700/20 text-blue-700 border-blue-700/50 dark:bg-blue-500/20 dark:text-blue-500 dark:border-blue-500/50 text-xs py-0 px-1.5">Meta</Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      core: 'bg-gray-600/20 text-gray-600 border-gray-600/50 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/50',
      hot: 'bg-teal-700/20 text-teal-700 border-teal-700/50 dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/50',
      pof: 'bg-orange-700/20 text-orange-700 border-orange-700/50 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/50',
      ibs: 'bg-blue-700/20 text-blue-700 border-blue-700/50 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-500/50',
      eod: 'bg-purple-700/20 text-purple-700 border-purple-700/50 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/50',
      soto: 'bg-yellow-700/20 text-yellow-700 border-yellow-700/50 dark:bg-yellow-500/20 dark:text-yellow-400 dark:border-yellow-500/50',
      jw: 'bg-emerald-700/20 text-emerald-700 border-emerald-700/30 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30',
      voe: 'bg-amber-700/20 text-amber-700 border-amber-700/30 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30',
    };

    const categoryLabels: Record<string, string> = {
      core: 'Core',
      hot: 'HoT',
      pof: 'PoF',
      ibs: 'IBS',
      eod: 'EoD',
      soto: 'SotO',
      jw: 'Janthir Wilds',
      voe: 'Visions of Eternity',
    };

    return (
      <Badge className={`${categoryColors[category]} text-xs py-0 px-1.5`}>
        {categoryLabels[category]}
      </Badge>
    );
  };

  const getRowClass = (minutesUntil: number, duration: number, index: number) => {
    // Active events - success glow
    if (minutesUntil <= 0 && minutesUntil > -duration) {
      return 'bg-success/10 hover:bg-success/15 transition-colors duration-200';
    }
    // Urgent events (< 5 min) - gold glow with animation
    if (minutesUntil > 0 && minutesUntil <= 5) {
      return 'bg-gw2-gold/20 hover:bg-gw2-gold/30 glow-gold-sm transition-colors duration-200';
    }
    // Soon events (5-15 min) - warning highlight
    if (minutesUntil > 0 && minutesUntil <= 15) {
      return 'bg-warning/10 hover:bg-warning/15 transition-colors duration-200';
    }
    return index % 2 === 0 ? 'bg-muted/20 hover:bg-muted/50 transition-colors duration-200' : 'bg-background hover:bg-muted/50 transition-colors duration-200';
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Type</label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <span className="line-clamp-1">
                  {typeFilters.length === 0
                    ? 'All Types'
                    : `${typeFilters.length} selected`}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 rounded-md border bg-popover text-popover-foreground shadow-md p-1">
              <div className="space-y-0.5">
                <div
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => toggleTypeFilter('boss')}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {typeFilters.includes('boss') && <Check className="h-4 w-4" />}
                  </span>
                  <span style={{ color: typeColors.boss }}>Bosses</span>
                </div>
                <div
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => toggleTypeFilter('meta')}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {typeFilters.includes('meta') && <Check className="h-4 w-4" />}
                  </span>
                  <span style={{ color: typeColors.meta }}>Metas</span>
                </div>
                {typeFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setTypeFilters([])}
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Category</label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <span className="line-clamp-1">
                  {categoryFilters.length === 0
                    ? 'All Expansions'
                    : `${categoryFilters.length} selected`}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 rounded-md border bg-popover text-popover-foreground shadow-md p-1">
              <div className="space-y-0.5">
                {[
                  { value: 'core', label: 'Core Tyria' },
                  { value: 'hot', label: 'Heart of Thorns' },
                  { value: 'pof', label: 'Path of Fire' },
                  { value: 'ibs', label: 'Icebrood Saga' },
                  { value: 'eod', label: 'End of Dragons' },
                  { value: 'soto', label: 'Secrets of the Obscure' },
                  { value: 'jw', label: 'Janthir Wilds' },
                  { value: 'voe', label: 'Visions of Eternity' },
                ].map(option => (
                  <div
                    key={option.value}
                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={() => toggleCategoryFilter(option.value)}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {categoryFilters.includes(option.value) && <Check className="h-4 w-4" />}
                    </span>
                    <span style={{ color: categoryColors[option.value] }}>{option.label}</span>
                  </div>
                ))}
                {categoryFilters.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => setCategoryFilters([])}
                  >
                    Clear all
                  </Button>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Status</label>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <span className="line-clamp-1">
                  {statusFilter === 'all' ? 'All Status' :
                   statusFilter === 'active' ? 'Active Now' :
                   statusFilter === '15min' ? 'Next 15min' : 'Next 30min'}
                </span>
                <ChevronDown className="h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-48 rounded-md border bg-popover text-popover-foreground shadow-md p-1">
              <div className="space-y-0.5">
                {[
                  { value: 'all', label: 'All Status' },
                  { value: 'active', label: 'Active Now' },
                  { value: '15min', label: 'Next 15min' },
                  { value: '30min', label: 'Next 30min' },
                ].map(option => (
                  <div
                    key={option.value}
                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                    onClick={() => setStatusFilter(option.value)}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {statusFilter === option.value && <Check className="h-4 w-4" />}
                    </span>
                    <span>{option.label}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Search</label>
          <Input
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border border-gw2-gold/20 rounded-lg overflow-hidden shadow-lg">
        <table className="w-full text-sm">
          <thead>
            <tr className="sticky top-0 z-10 border-b border-gw2-gold/30 bg-card/95 backdrop-blur-sm text-left">
              <th className="py-1 px-2 font-medium text-xs w-6 text-gw2-gold/70"></th>
              <th className="py-1 px-2 font-medium text-xs text-gw2-gold/70">Event ({filteredEvents.length})</th>
              <th className="py-1 px-2 font-medium text-xs text-gw2-gold/70">Map</th>
              <th className="py-1 px-2 font-medium text-xs text-gw2-gold/70">Time</th>
              <th className="py-1 px-2 font-medium text-xs text-gw2-gold/70">Status</th>
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
                        className="bg-success/20 cursor-pointer hover:bg-success/30 transition-colors duration-200 border-y border-success/30"
                        onClick={() => setActiveCollapsed(!activeCollapsed)}
                      >
                        <td colSpan={5} className="py-1.5 px-2">
                          <div className="flex items-center gap-1.5 font-semibold text-success text-xs">
                            <span className={`transition-transform duration-200 ${activeCollapsed ? '' : 'rotate-90'}`}>
                              <ChevronRight className="h-4 w-4" />
                            </span>
                            Active Now ({activeEvents.length})
                          </div>
                        </td>
                      </tr>
                      {!activeCollapsed && activeEvents.map(({ event, nextSpawn, minutesUntil }, index) => (
                        <tr key={event.id} className={`border-b border-gw2-gold/10 ${getRowClass(minutesUntil, event.duration, index)}`}>
                          <td className="py-1 px-2">
                            <button
                              onClick={() => toggleFavorite(event.id)}
                              className="hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`h-3.5 w-3.5 ${
                                  favorites.has(event.id)
                                    ? 'text-gw2-gold fill-current'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="py-1 px-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-base">{event.icon}</span>
                              <div className="flex flex-col gap-0.5">
                                <span className="font-medium text-xs">{event.name}</span>
                                <div className="flex gap-0.5">
                                  {getTypeBadge(event.type)}
                                  {getCategoryBadge(event.category)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td
                            className="py-1 px-2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => {
                              if (event.waypoint) {
                                navigator.clipboard.writeText(event.waypoint);
                                toast.success('Waypoint copied!');
                              }
                            }}
                            title={event.waypoint ? `Click to copy: ${event.waypoint}` : undefined}
                          >
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1">
                                <span className="text-xs">{event.map}</span>
                                {event.waypoint && <Copy className="h-2.5 w-2.5 opacity-50" />}
                              </div>
                              {event.waypoint && (
                                <code className="text-[10px] text-muted-foreground/70 font-mono">{event.waypoint}</code>
                              )}
                            </div>
                          </td>
                          <td className="py-1 px-2">
                            <div className="font-mono text-xs">
                              {formatCountdown(minutesUntil, nextSpawn, event.duration)}
                            </div>
                            {minutesUntil > 0 && (
                              <div className="text-[10px] text-muted-foreground">
                                {nextSpawn.toLocaleTimeString([], {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </div>
                            )}
                          </td>
                          <td className="py-1 px-2">{getStatusBadge(minutesUntil, event.duration)}</td>
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
                        className="bg-info/20 cursor-pointer hover:bg-info/30 transition-colors duration-200 border-y border-info/30"
                        onClick={() => setUpcomingCollapsed(!upcomingCollapsed)}
                      >
                        <td colSpan={5} className="py-1.5 px-2">
                          <div className="flex items-center gap-1.5 font-semibold text-info text-xs">
                            <span className={`transition-transform duration-200 ${upcomingCollapsed ? '' : 'rotate-90'}`}>
                              <ChevronRight className="h-4 w-4" />
                            </span>
                            Upcoming ({upcomingEvents.length})
                          </div>
                        </td>
                      </tr>
                      {!upcomingCollapsed && upcomingEvents.map(({ event, nextSpawn, minutesUntil }, index) => (
                        <tr key={event.id} className={`border-b border-gw2-gold/10 ${getRowClass(minutesUntil, event.duration, index)}`}>
                          <td className="py-1 px-2">
                            <button
                              onClick={() => toggleFavorite(event.id)}
                              className="hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`h-3.5 w-3.5 ${
                                  favorites.has(event.id)
                                    ? 'text-gw2-gold fill-current'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </button>
                          </td>
                          <td className="py-1 px-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-base">{event.icon}</span>
                              <div className="flex flex-col gap-0.5">
                                <span className="font-medium text-xs">{event.name}</span>
                                <div className="flex gap-0.5">
                                  {getTypeBadge(event.type)}
                                  {getCategoryBadge(event.category)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td
                            className="py-1 px-2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                            onClick={() => {
                              if (event.waypoint) {
                                navigator.clipboard.writeText(event.waypoint);
                                toast.success('Waypoint copied!');
                              }
                            }}
                            title={event.waypoint ? `Click to copy: ${event.waypoint}` : undefined}
                          >
                            <div className="flex flex-col gap-0.5">
                              <div className="flex items-center gap-1">
                                <span className="text-xs">{event.map}</span>
                                {event.waypoint && <Copy className="h-2.5 w-2.5 opacity-50" />}
                              </div>
                              {event.waypoint && (
                                <code className="text-[10px] text-muted-foreground/70 font-mono">{event.waypoint}</code>
                              )}
                            </div>
                          </td>
                          <td className="py-1 px-2">
                            <div className="font-mono text-xs">
                              {formatCountdown(minutesUntil, nextSpawn, event.duration)}
                            </div>
                            {minutesUntil > 0 && (
                              <div className="text-[10px] text-muted-foreground">
                                {nextSpawn.toLocaleTimeString([], {
                                  hour: 'numeric',
                                  minute: '2-digit',
                                })}
                              </div>
                            )}
                          </td>
                          <td className="py-1 px-2">{getStatusBadge(minutesUntil, event.duration)}</td>
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
