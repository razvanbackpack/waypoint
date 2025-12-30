import { useState, useEffect, useMemo, useCallback } from 'react';
import { GAME_EVENTS, getNextSpawn } from '@/data/eventSchedule';
import type { GameEvent } from '@/data/eventSchedule';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { Copy, ChevronRight, ChevronDown, Check, Pin, CheckCircle } from 'lucide-react';
import { useWorldBossesCompleted } from '@/api/hooks/useGW2Api';
import { useApiKey } from '@/api/hooks/useApiKey';
import { GW2_ICONS } from '@/lib/gw2Icons';

// Reward icon and color mapping
const getRewardDisplay = (rewardText: string): { icon: string; color: string; label: string } => {
  const text = rewardText.toLowerCase().trim();

  // Gold rewards
  if (text.includes('g') && /\d+g/.test(text)) {
    return { icon: GW2_ICONS.goldCoin, color: '#FFD700', label: text };
  }
  // Exotic items (orange rarity)
  if (text.includes('exotic')) {
    return { icon: GW2_ICONS.chest, color: '#FFA500', label: 'Exotic' };
  }
  // Rare items (yellow rarity)
  if (text.includes('rare')) {
    return { icon: GW2_ICONS.chest, color: '#FFE135', label: 'Rare' };
  }
  // Karma
  if (text.includes('karma')) {
    return { icon: GW2_ICONS.karma, color: '#DA70D6', label: 'Karma' };
  }
  // Bags/loot
  if (text.includes('bag')) {
    return { icon: GW2_ICONS.chest, color: '#87CEEB', label: 'Bags' };
  }
  // Currency (generic) - no icon for currency rewards
  if (text.includes('currency') || text.includes('favor') || text.includes('jade') || text.includes('rift') || text.includes('contract')) {
    return { icon: '', color: '#9370DB', label: 'Currency' };
  }
  // Default: chest with gray
  return { icon: GW2_ICONS.chest, color: '#9CA3AF', label: text };
};

// Mapping from event schedule IDs to GW2 API boss IDs
const EVENT_TO_API_BOSS: Record<string, string> = {
  'tequatl': 'tequatl',
  'jungle_wurm': 'jungle_wurm',
  'megadestroyer': 'megadestroyer',
  'fire_elemental': 'fire_elemental',
  'shadow_behemoth': 'shadow_behemoth',
  'claw_jormag': 'claw_of_jormag',
  'shatterer': 'shatterer',
  'modniir': 'modniir_ulgoth',
  'golem_mark_ii': 'golem_mark_ii',
  'taidha': 'admiral_taidha_covington',
  'karka_queen': 'karka_queen',
};

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pinnedCollapsed, setPinnedCollapsed] = useState(false);
  const [sortColumn] = useState<'name' | 'map' | 'time' | null>(null);
  const [sortDirection] = useState<'asc' | 'desc'>('asc');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [activeSearch, setActiveSearch] = useState('');
  const [upcomingSearch, setUpcomingSearch] = useState('');

  // API-based world boss completion tracking
  const { hasApiKey } = useApiKey();
  const { data: worldBossesCompleted = [] } = useWorldBossesCompleted();

  // Helper to check if a boss event is completed via API
  const isBossCompleted = useCallback((eventId: string, eventType: string): boolean | null => {
    if (eventType !== 'boss') return null; // Don't track metas
    const apiBossId = EVENT_TO_API_BOSS[eventId];
    if (!apiBossId) return null; // Unknown boss
    if (!hasApiKey) return null; // Not authenticated
    return worldBossesCompleted.includes(apiBossId);
  }, [hasApiKey, worldBossesCompleted]);

  // Color definitions for filter options
  const typeColors: Record<string, string> = {
    boss: '#f97316', // orange
    meta: '#a855f7', // purple
    invasion: '#ef4444', // red
  };

  const categoryColors: Record<string, string> = {
    core: '#9ca3af', // gray
    hot: '#22c55e', // green
    pof: '#eab308', // yellow/gold
    lws2: '#f472b6', // pink for Season 2
    lws3: '#8b5cf6', // violet for Season 3
    lws4: '#06b6d4', // cyan for Season 4
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

  const sortEvents = (events: EventWithSpawn[]) => {
    if (!sortColumn) return events;

    return [...events].sort((a, b) => {
      let compareValue = 0;

      if (sortColumn === 'name') {
        compareValue = a.event.name.localeCompare(b.event.name);
      } else if (sortColumn === 'map') {
        compareValue = a.event.map.localeCompare(b.event.map);
      } else if (sortColumn === 'time') {
        compareValue = a.minutesUntil - b.minutesUntil;
      }

      return sortDirection === 'asc' ? compareValue : -compareValue;
    });
  };

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
      const { nextSpawn, minutesUntil } = getNextSpawn(event);
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

      // Hide completed filter (only applies to bosses with API data)
      if (hideCompleted && isBossCompleted(event.id, event.type) === true) {
        return false;
      }

      return true;
    });
  }, [eventsWithSpawns, typeFilters, categoryFilters, statusFilter, searchQuery, hideCompleted, isBossCompleted]);

  const formatCountdown = (minutesUntil: number, nextSpawn: Date, duration: number) => {
    if (minutesUntil <= 0 && minutesUntil > -duration) {
      const remainingMinutes = duration + minutesUntil;
      if (remainingMinutes > 0) {
        return (
          <div className="flex flex-col items-end">
            <span className="font-bold text-success text-base">NOW</span>
            <span className="text-xs text-muted-foreground">{remainingMinutes}m left</span>
          </div>
        );
      }
      return <span className="font-bold text-success text-base">NOW</span>;
    }

    const now = new Date();
    const diff = nextSpawn.getTime() - now.getTime();
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const timeClass = 'text-foreground';

    if (hours > 0) {
      return <span className={`font-mono tabular-nums ${timeClass}`}>{hours}h {minutes}m {seconds}s</span>;
    }
    return <span className={`font-mono tabular-nums ${timeClass}`}>{minutes}m {seconds}s</span>;
  };

  const getTypeBadge = (type: 'boss' | 'meta' | 'invasion') => {
    if (type === 'boss') {
      return <Badge className="bg-red-700/20 text-red-700 border-red-700/50 dark:bg-red-500/20 dark:text-red-500 dark:border-red-500/50 text-[10px] py-0 px-1"><span className="flex items-center gap-0.5"><img src={GW2_ICONS.boss} alt="" className="h-3 w-3" />Boss</span></Badge>;
    }
    if (type === 'invasion') {
      return <Badge className="bg-rose-700/20 text-rose-700 border-rose-700/50 dark:bg-rose-500/20 dark:text-rose-500 dark:border-rose-500/50 text-[10px] py-0 px-1"><span className="flex items-center gap-0.5"><img src={GW2_ICONS.invasion} alt="" className="h-3 w-3" />Invasion</span></Badge>;
    }
    return <Badge className="bg-blue-700/20 text-blue-700 border-blue-700/50 dark:bg-blue-500/20 dark:text-blue-500 dark:border-blue-500/50 text-[10px] py-0 px-1"><span className="flex items-center gap-0.5"><img src={GW2_ICONS.meta} alt="" className="h-3 w-3" />Meta</span></Badge>;
  };

  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      core: 'bg-gray-600/20 text-gray-600 border-gray-600/50 dark:bg-gray-500/20 dark:text-gray-400 dark:border-gray-500/50',
      hot: 'bg-teal-700/20 text-teal-700 border-teal-700/50 dark:bg-teal-500/20 dark:text-teal-400 dark:border-teal-500/50',
      pof: 'bg-orange-700/20 text-orange-700 border-orange-700/50 dark:bg-orange-500/20 dark:text-orange-400 dark:border-orange-500/50',
      lws2: 'bg-pink-700/20 text-pink-700 border-pink-700/50 dark:bg-pink-500/20 dark:text-pink-400 dark:border-pink-500/50',
      lws3: 'bg-violet-700/20 text-violet-700 border-violet-700/50 dark:bg-violet-500/20 dark:text-violet-400 dark:border-violet-500/50',
      lws4: 'bg-cyan-700/20 text-cyan-700 border-cyan-700/50 dark:bg-cyan-500/20 dark:text-cyan-400 dark:border-cyan-500/50',
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
      lws2: 'LWS2',
      lws3: 'LWS3',
      lws4: 'LWS4',
      ibs: 'IBS',
      eod: 'EoD',
      soto: 'SotO',
      jw: 'JW',
      voe: 'VoE',
    };

    return (
      <Badge className={`${categoryColors[category]} text-[10px] py-0 px-1`}>
        {categoryLabels[category]}
      </Badge>
    );
  };

  const getRowClass = (minutesUntil: number, duration: number, index: number) => {
    // Active events - success glow
    if (minutesUntil <= 0 && minutesUntil > -duration) {
      return 'bg-success/10 hover:bg-success/15 transition-colors duration-200';
    }
    // Alternating row colors for everything else
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
                <div
                  className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                  onClick={() => toggleTypeFilter('invasion')}
                >
                  <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                    {typeFilters.includes('invasion') && <Check className="h-4 w-4" />}
                  </span>
                  <span style={{ color: typeColors.invasion }}>Invasions</span>
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
                  { value: 'lws2', label: 'Living World S2' },
                  { value: 'lws3', label: 'Living World S3' },
                  { value: 'lws4', label: 'Living World S4' },
                  { value: 'ibs', label: 'Icebrood Saga' },
                  { value: 'eod', label: 'End of Dragons' },
                  { value: 'soto', label: 'Secrets of the Obscure' },
                  { value: 'jw', label: 'JW' },
                  { value: 'voe', label: 'VoE' },
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

      {/* Hide completed toggle */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setHideCompleted(!hideCompleted)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm transition-colors ${
            hideCompleted
              ? 'bg-green-500/10 border-green-500/50 text-green-500'
              : 'bg-background border-input text-muted-foreground hover:bg-muted/50'
          }`}
        >
          <CheckCircle className={`h-4 w-4 ${hideCompleted ? 'fill-green-500/20' : ''}`} />
          Hide completed
        </button>
        {hasApiKey && worldBossesCompleted.length > 0 && (
          <span className="text-xs text-muted-foreground">
            ({worldBossesCompleted.length} bosses completed today)
          </span>
        )}
        {!hasApiKey && (
          <span className="text-xs text-muted-foreground">
            (Login to track boss kills)
          </span>
        )}
      </div>

      {/* Pinned Events Section */}
      {(() => {
        const pinnedEvents = sortEvents(filteredEvents.filter(({ event }) => favorites.has(event.id)));
        if (pinnedEvents.length === 0) return null;
        return (
          <div className="border border-gw2-accent/30 rounded-lg overflow-hidden shadow-lg">
            <button
              className="w-full bg-gw2-accent/20 hover:bg-gw2-accent/30 transition-colors duration-200 py-2 px-3"
              onClick={() => setPinnedCollapsed(!pinnedCollapsed)}
            >
              <div className="flex items-center gap-1.5 font-semibold text-gw2-accent text-xs">
                <span className={`transition-transform duration-200 ${pinnedCollapsed ? '' : 'rotate-90'}`}>
                  <ChevronRight className="h-4 w-4" />
                </span>
                <Pin className="h-3.5 w-3.5" />
                Pinned ({pinnedEvents.length})
              </div>
            </button>
            {!pinnedCollapsed && (
              <table className="w-full text-sm table-fixed">
                <tbody>
                  {pinnedEvents.map(({ event, nextSpawn, minutesUntil }) => {
                    const isCompleted = isBossCompleted(event.id, event.type) === true;
                    return (
                      <>
                      <tr key={`pinned-${event.id}`} className={`border-b border-gw2-accent/10 last:border-b-0 ${getRowClass(minutesUntil, event.duration, 0)} ${isCompleted ? 'opacity-50' : ''}`}>
                        <td className="py-2 px-3" style={{ width: '55%' }}>
                          <div className="flex items-center gap-1.5">
                            {(event.type === 'boss' || event.type === 'meta' || event.type === 'invasion') ? (
                              <img src={event.type === 'boss' ? GW2_ICONS.boss : event.type === 'invasion' ? GW2_ICONS.invasion : GW2_ICONS.meta} alt="" className="h-5 w-5 shrink-0" />
                            ) : (
                              <span className="text-base shrink-0">{event.icon}</span>
                            )}
                            <div className="flex flex-col gap-0.5 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleFavorite(event.id); }}
                                  className="hover:scale-110 transition-transform shrink-0"
                                  title="Unpin event"
                                >
                                  <Pin className="h-3.5 w-3.5 text-gw2-accent fill-current" />
                                </button>
                                <span className={`font-semibold text-sm text-foreground truncate ${isCompleted ? 'line-through' : ''}`}>{event.name}</span>
                                {isCompleted && <CheckCircle className="h-3.5 w-3.5 text-green-500 fill-green-500/20 shrink-0" />}
                              </div>
                              <div className="flex gap-0.5">
                                {getTypeBadge(event.type)}
                                {getCategoryBadge(event.category)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-2 px-3 text-right" style={{ width: '80px' }}>
                          <div className="font-mono text-xs">
                            {formatCountdown(minutesUntil, nextSpawn, event.duration)}
                          </div>
                          {minutesUntil > 0 && (
                            <div className="text-[10px] text-muted-foreground">
                              {nextSpawn.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                            </div>
                          )}
                        </td>
                        <td className="py-2 px-3 text-muted-foreground" style={{ width: '120px' }}>
                          {event.locations && event.locations.length > 0 ? (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="flex items-center gap-1.5 hover:bg-muted/50 rounded px-1.5 -mx-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                  <img src={GW2_ICONS.waypoint} alt="" className="h-4 w-4 shrink-0" />
                                  <span className="text-sm truncate max-w-[80px]">{event.map}</span>
                                  <ChevronDown className="h-3 w-3 shrink-0" />
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-48 p-1">
                                <div className="space-y-0.5">
                                  {event.locations.map((loc, i) => (
                                    <button
                                      key={i}
                                      className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded hover:bg-muted/50 transition-colors"
                                      onClick={() => {
                                        navigator.clipboard.writeText(loc.waypoint);
                                        toast.success(loc.name + ' waypoint copied!');
                                      }}
                                    >
                                      <img src={GW2_ICONS.waypoint} alt="" className="h-3.5 w-3.5" />
                                      <span className="flex-1 text-left">{loc.name}</span>
                                      <Copy className="h-3 w-3 text-muted-foreground" />
                                    </button>
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          ) : (
                            <div
                              className="flex items-center gap-1.5 hover:bg-muted/50 rounded px-1.5 -mx-1.5 cursor-pointer hover:text-foreground transition-colors"
                              onClick={() => {
                                if (event.waypoint) {
                                  navigator.clipboard.writeText(event.waypoint);
                                  toast.success('Waypoint copied!');
                                }
                              }}
                              title={event.waypoint ? 'Click to copy waypoint' : undefined}
                            >
                              {event.waypoint && <img src={GW2_ICONS.waypoint} alt="" className="h-4 w-4 shrink-0" />}
                              <span className="text-sm truncate max-w-[100px]" title={event.map}>{event.map}</span>
                              {event.waypoint && <Copy className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                            </div>
                          )}
                        </td>
                      </tr>
                      {event.reward && (
                        <tr key={`${event.id}-reward`}>
                          <td colSpan={3} className="py-0.5 px-3 border-b border-border/10">
                            <div className="flex items-center gap-2 pl-5">
                              {event.reward.split(' + ').map((r, i) => {
                                const { icon, color, label } = getRewardDisplay(r);
                                return (
                                  <div key={i} className="flex items-center gap-1">
                                    {icon && <img src={icon} alt="" className="h-3.5 w-3.5" />}
                                    <span className="text-[11px]" style={{ color }}>{label}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      })()}

      {/* No events message */}
      {filteredEvents.length === 0 && (
        <div className="py-8 text-center text-muted-foreground text-xs border border-border rounded-lg">
          No events match your filters
        </div>
      )}

      {/* Two-column layout for Upcoming and Active Now */}
      {filteredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Upcoming Column (LEFT) */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-muted-foreground font-semibold text-sm">
              Upcoming
            </div>
            <div className="rounded-lg border border-border overflow-hidden max-h-[calc(100vh-120px)] overflow-y-auto">
              {(() => {
                const upcomingEvents = sortEvents(filteredEvents.filter(({ event, minutesUntil }) => !favorites.has(event.id) && minutesUntil > 0))
                  .filter(({ event }) => event.name.toLowerCase().includes(upcomingSearch.toLowerCase()) || event.map.toLowerCase().includes(upcomingSearch.toLowerCase()));
                return (
                  <>
                    <table className="w-full text-sm table-fixed">
                      <thead className="bg-muted/50 sticky top-0">
                        <tr className="border-b border-border">
                          <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground w-[55%]">
                            <input
                              type="text"
                              placeholder="Filter events..."
                              value={upcomingSearch}
                              onChange={(e) => setUpcomingSearch(e.target.value)}
                              className="w-full bg-transparent border-none outline-none text-xs placeholder:text-muted-foreground/60"
                            />
                          </th>
                          <th className="py-2 px-2 text-right text-xs font-medium text-muted-foreground whitespace-nowrap w-[80px]">Time</th>
                          <th className="py-2 px-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap w-[120px]">Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {upcomingEvents.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="py-6 text-center text-muted-foreground text-xs">
                              No upcoming events
                            </td>
                          </tr>
                        ) : (
                          upcomingEvents.map(({ event, nextSpawn, minutesUntil }) => {
                            const isCompleted = isBossCompleted(event.id, event.type) === true;
                            return (
                              <>
                              <tr key={event.id} className={`border-b border-border/50 last:border-b-0 ${getRowClass(minutesUntil, event.duration, 0)} ${isCompleted ? 'opacity-50' : ''}`}>
                                <td className="py-2 px-3">
                                  <div className="flex items-center gap-1.5">
                                    {(event.type === 'boss' || event.type === 'meta' || event.type === 'invasion') ? (
                                      <img src={event.type === 'boss' ? GW2_ICONS.boss : event.type === 'invasion' ? GW2_ICONS.invasion : GW2_ICONS.meta} alt="" className="h-4 w-4 shrink-0" />
                                    ) : (
                                      <span className="text-sm shrink-0">{event.icon}</span>
                                    )}
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={(e) => { e.stopPropagation(); toggleFavorite(event.id); }}
                                          className="hover:scale-110 transition-transform shrink-0"
                                          title={favorites.has(event.id) ? 'Unpin event' : 'Pin event'}
                                        >
                                          <Pin className={`h-3 w-3 ${favorites.has(event.id) ? 'text-gw2-accent fill-current' : 'text-muted-foreground'}`} />
                                        </button>
                                        <span className={`font-medium text-xs text-foreground truncate ${isCompleted ? 'line-through' : ''}`}>{event.name}</span>
                                        {isCompleted && <CheckCircle className="h-3 w-3 text-green-500 fill-green-500/20 shrink-0" />}
                                      </div>
                                      <div className="flex gap-0.5">
                                        {getTypeBadge(event.type)}
                                        {getCategoryBadge(event.category)}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2 px-2 text-right whitespace-nowrap">
                                  <div className="font-mono text-xs">
                                    {formatCountdown(minutesUntil, nextSpawn, event.duration)}
                                  </div>
                                  <div className="text-[10px] text-muted-foreground">
                                    {nextSpawn.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                  </div>
                                </td>
                                <td className="py-2 px-2 text-muted-foreground max-w-[120px]">
                                  {event.locations && event.locations.length > 0 ? (
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <button className="flex items-center gap-1.5 hover:bg-muted/50 rounded px-1.5 -mx-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                          <img src={GW2_ICONS.waypoint} alt="" className="h-4 w-4 shrink-0" />
                                          <span className="text-sm truncate max-w-[80px]">{event.map}</span>
                                          <ChevronDown className="h-3 w-3 shrink-0" />
                                        </button>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-48 p-1">
                                        <div className="space-y-0.5">
                                          {event.locations.map((loc, i) => (
                                            <button
                                              key={i}
                                              className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded hover:bg-muted/50 transition-colors"
                                              onClick={() => {
                                                navigator.clipboard.writeText(loc.waypoint);
                                                toast.success(loc.name + ' waypoint copied!');
                                              }}
                                            >
                                              <img src={GW2_ICONS.waypoint} alt="" className="h-3.5 w-3.5" />
                                              <span className="flex-1 text-left">{loc.name}</span>
                                              <Copy className="h-3 w-3 text-muted-foreground" />
                                            </button>
                                          ))}
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  ) : (
                                    <div
                                      className="flex items-center gap-1.5 hover:bg-muted/50 rounded px-1.5 -mx-1.5 cursor-pointer hover:text-foreground transition-colors"
                                      onClick={() => {
                                        if (event.waypoint) {
                                          navigator.clipboard.writeText(event.waypoint);
                                          toast.success('Waypoint copied!');
                                        }
                                      }}
                                      title={event.waypoint ? 'Click to copy waypoint' : undefined}
                                    >
                                      {event.waypoint && <img src={GW2_ICONS.waypoint} alt="" className="h-4 w-4 shrink-0" />}
                                      <span className="text-sm truncate max-w-[100px]" title={event.map}>{event.map}</span>
                                      {event.waypoint && <Copy className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                                    </div>
                                  )}
                                </td>
                              </tr>
                              {event.reward && (
                                <tr key={`${event.id}-reward`}>
                                  <td colSpan={3} className="py-0.5 px-3 border-b border-border/10">
                                    <div className="flex items-center gap-2 pl-5">
                                      {event.reward.split(' + ').map((r, i) => {
                                        const { icon, color, label } = getRewardDisplay(r);
                                        return (
                                          <div key={i} className="flex items-center gap-1">
                                            {icon && <img src={icon} alt="" className="h-3.5 w-3.5" />}
                                            <span className="text-[11px]" style={{ color }}>{label}</span>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </td>
                                </tr>
                              )}
                              </>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Active Now Column (RIGHT) */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-success font-semibold text-sm">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              Active Now
            </div>
            <div className="rounded-lg border border-success/30 overflow-hidden">
              {(() => {
                const activeEvents = sortEvents(filteredEvents.filter(
                  ({ event, minutesUntil }) => !favorites.has(event.id) && minutesUntil <= 0 && minutesUntil > -event.duration
                )).filter(({ event }) => event.name.toLowerCase().includes(activeSearch.toLowerCase()) || event.map.toLowerCase().includes(activeSearch.toLowerCase()));
                return (
                  <table className="w-full text-sm table-fixed">
                    <thead className="bg-success/10 sticky top-0">
                      <tr className="border-b border-success/20">
                        <th className="py-2 px-3 text-left text-xs font-medium text-muted-foreground w-[55%]">
                          <input
                            type="text"
                            placeholder="Filter events..."
                            value={activeSearch}
                            onChange={(e) => setActiveSearch(e.target.value)}
                            className="w-full bg-transparent border-none outline-none text-xs placeholder:text-muted-foreground/60"
                          />
                        </th>
                        <th className="py-2 px-2 text-right text-xs font-medium text-muted-foreground whitespace-nowrap w-[80px]">Time</th>
                        <th className="py-2 px-2 text-left text-xs font-medium text-muted-foreground whitespace-nowrap w-[120px]">Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeEvents.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-6 text-center text-muted-foreground text-xs bg-success/5">
                            No active events
                          </td>
                        </tr>
                      ) : (
                        activeEvents.map(({ event, nextSpawn, minutesUntil }) => {
                          const isCompleted = isBossCompleted(event.id, event.type) === true;
                          return (
                            <>
                            <tr key={event.id} className={`border-b border-success/10 last:border-b-0 bg-success/5 hover:bg-success/10 transition-colors ${isCompleted ? 'opacity-50' : ''}`}>
                              <td className="py-2 px-3">
                                <div className="flex items-center gap-1.5">
                                  {(event.type === 'boss' || event.type === 'meta' || event.type === 'invasion') ? (
                                    <img src={event.type === 'boss' ? GW2_ICONS.boss : event.type === 'invasion' ? GW2_ICONS.invasion : GW2_ICONS.meta} alt="" className="h-4 w-4 shrink-0" />
                                  ) : (
                                    <span className="text-sm shrink-0">{event.icon}</span>
                                  )}
                                  <div className="flex flex-col gap-0.5 min-w-0">
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={(e) => { e.stopPropagation(); toggleFavorite(event.id); }}
                                        className="hover:scale-110 transition-transform shrink-0"
                                        title={favorites.has(event.id) ? 'Unpin event' : 'Pin event'}
                                      >
                                        <Pin className={`h-3 w-3 ${favorites.has(event.id) ? 'text-gw2-accent fill-current' : 'text-muted-foreground'}`} />
                                      </button>
                                      <span className={`font-medium text-xs text-foreground truncate ${isCompleted ? 'line-through' : ''}`}>{event.name}</span>
                                      {isCompleted && <CheckCircle className="h-3 w-3 text-green-500 fill-green-500/20 shrink-0" />}
                                    </div>
                                    <div className="flex gap-0.5">
                                      {getTypeBadge(event.type)}
                                      {getCategoryBadge(event.category)}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2 px-2 text-right whitespace-nowrap">
                                <div className="font-mono text-xs">
                                  {formatCountdown(minutesUntil, nextSpawn, event.duration)}
                                </div>
                              </td>
                              <td className="py-2 px-2 text-muted-foreground max-w-[120px]">
                                {event.locations && event.locations.length > 0 ? (
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <button className="flex items-center gap-1.5 hover:bg-muted/50 rounded px-1.5 -mx-1.5 text-muted-foreground hover:text-foreground transition-colors">
                                        <img src={GW2_ICONS.waypoint} alt="" className="h-4 w-4 shrink-0" />
                                        <span className="text-sm truncate max-w-[80px]">{event.map}</span>
                                        <ChevronDown className="h-3 w-3 shrink-0" />
                                      </button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-48 p-1">
                                      <div className="space-y-0.5">
                                        {event.locations.map((loc, i) => (
                                          <button
                                            key={i}
                                            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded hover:bg-muted/50 transition-colors"
                                            onClick={() => {
                                              navigator.clipboard.writeText(loc.waypoint);
                                              toast.success(loc.name + ' waypoint copied!');
                                            }}
                                          >
                                            <img src={GW2_ICONS.waypoint} alt="" className="h-3.5 w-3.5" />
                                            <span className="flex-1 text-left">{loc.name}</span>
                                            <Copy className="h-3 w-3 text-muted-foreground" />
                                          </button>
                                        ))}
                                      </div>
                                    </PopoverContent>
                                  </Popover>
                                ) : (
                                  <div
                                    className="flex items-center gap-1.5 hover:bg-muted/50 rounded px-1.5 -mx-1.5 cursor-pointer hover:text-foreground transition-colors"
                                    onClick={() => {
                                      if (event.waypoint) {
                                        navigator.clipboard.writeText(event.waypoint);
                                        toast.success('Waypoint copied!');
                                      }
                                    }}
                                    title={event.waypoint ? 'Click to copy waypoint' : undefined}
                                  >
                                    {event.waypoint && <img src={GW2_ICONS.waypoint} alt="" className="h-4 w-4 shrink-0" />}
                                    <span className="text-sm truncate max-w-[100px]" title={event.map}>{event.map}</span>
                                    {event.waypoint && <Copy className="h-3.5 w-3.5 text-muted-foreground shrink-0" />}
                                  </div>
                                )}
                              </td>
                            </tr>
                            {event.reward && (
                              <tr key={`${event.id}-reward`}>
                                <td colSpan={3} className="py-0.5 px-3 border-b border-border/10">
                                  <div className="flex items-center gap-2 pl-5">
                                    {event.reward.split(' + ').map((r, i) => {
                                      const { icon, color, label } = getRewardDisplay(r);
                                      return (
                                        <div key={i} className="flex items-center gap-1">
                                          {icon && <img src={icon} alt="" className="h-3.5 w-3.5" />}
                                          <span className="text-[11px]" style={{ color }}>{label}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </td>
                              </tr>
                            )}
                            </>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="text-xs text-muted-foreground">
        Showing {filteredEvents.length} of {eventsWithSpawns.length} events
      </div>
    </div>
  );
}
