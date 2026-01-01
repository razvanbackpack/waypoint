import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  useWizardsVaultDaily,
  useWizardsVaultWeekly,
  useWizardsVaultSpecial,
  useWorldBossesCompleted,
  useDungeons,
  useDungeonsCompleted,
  useMapChests,
  useMapChestsCompleted,
  useDailyCrafting,
  useDailyCraftingCompleted,
  useRaids,
  useRaidsCompleted,
} from '@/api/hooks/useGW2Api';
import { getApiClient } from '@/api/client';
import { Sparkles, Sun, Calendar, Star, Check, CheckCircle2, Circle, Gift, CalendarCheck, ChevronDown, Skull, Castle, Gem, Map, Swords } from 'lucide-react';
import { toast } from 'sonner';
import type { WizardsVaultObjective } from '@/api/types';
import { GAME_EVENTS, getNextSpawn } from '@/data/eventSchedule';
import { GW2_ICONS, DUNGEON_ICONS } from '@/lib/gw2Icons';

const BOSS_EVENT_MAP: Record<string, string> = {
  'tequatl': 'tequatl',
  'jungle_wurm': 'jungle_wurm',
  'megadestroyer': 'megadestroyer',
  'fire_elemental': 'fire_elemental',
  'shadow_behemoth': 'shadow_behemoth',
  'claw_of_jormag': 'claw_jormag',
  'shatterer': 'shatterer',
  'modniir_ulgoth': 'modniir',
  'golem_mark_ii': 'golem_mark_ii',
  'admiral_taidha_covington': 'taidha',
  'karka_queen': 'karka_queen',
};

const DUNGEON_INFO: Record<string, { name: string; reward: string }> = {
  // Ascalonian Catacombs
  'ac_story': { name: 'Story', reward: '1g' },
  'hodgins': { name: 'Path 1 (Hodgins)', reward: '1g + 100 tokens' },
  'detha': { name: 'Path 2 (Detha)', reward: '1g + 100 tokens' },
  'tzark': { name: 'Path 3 (Tzark)', reward: '1g + 100 tokens' },
  // Caudecus's Manor
  'cm_story': { name: 'Story', reward: '1g' },
  'asura': { name: 'Path 1 (Asura)', reward: '1g + 100 tokens' },
  'seraph': { name: 'Path 2 (Seraph)', reward: '1g + 100 tokens' },
  'butler': { name: 'Path 3 (Butler)', reward: '1g + 100 tokens' },
  // Twilight Arbor
  'ta_story': { name: 'Story', reward: '1g' },
  'leurent': { name: 'Up (Leurent)', reward: '1g + 100 tokens' },
  'vevina': { name: 'Forward (Vevina)', reward: '1g + 100 tokens' },
  'aetherpath': { name: 'Aetherpath', reward: '3g + 100 tokens' },
  // Sorrow's Embrace
  'se_story': { name: 'Story', reward: '1g' },
  'fergg': { name: 'Path 1 (Fergg)', reward: '1g + 100 tokens' },
  'rasalov': { name: 'Path 2 (Rasalov)', reward: '1g + 100 tokens' },
  'koptev': { name: 'Path 3 (Koptev)', reward: '1g + 100 tokens' },
  // Citadel of Flame
  'cof_story': { name: 'Story', reward: '1g' },
  'ferrah': { name: 'Path 1 (Ferrah)', reward: '1g + 100 tokens' },
  'magg': { name: 'Path 2 (Magg)', reward: '1g + 100 tokens' },
  'rhiannon': { name: 'Path 3 (Rhiannon)', reward: '1g + 100 tokens' },
  // Honor of the Waves
  'hotw_story': { name: 'Story', reward: '1g' },
  'butcher': { name: 'Path 1 (Butcher)', reward: '1g + 100 tokens' },
  'plunderer': { name: 'Path 2 (Plunderer)', reward: '1g + 100 tokens' },
  'zealot': { name: 'Path 3 (Zealot)', reward: '1g + 100 tokens' },
  // Crucible of Eternity
  'coe_story': { name: 'Story', reward: '1g' },
  'submarine': { name: 'Path 1 (Submarine)', reward: '1g + 100 tokens' },
  'teleporter': { name: 'Path 2 (Teleporter)', reward: '1g + 100 tokens' },
  'front_door': { name: 'Path 3 (Front Door)', reward: '1g + 100 tokens' },
  // Ruined City of Arah
  'arah_story': { name: 'Story', reward: '1g' },
  'jotun': { name: 'Path 1 (Jotun)', reward: '3g + 150 tokens' },
  'mursaat': { name: 'Path 2 (Mursaat)', reward: '3g + 150 tokens' },
  'forgotten': { name: 'Path 3 (Forgotten)', reward: '3g + 150 tokens' },
  'seer': { name: 'Path 4 (Seer)', reward: '3g + 150 tokens' },
};

const DAILY_CRAFTING_ITEMS: Record<string, { name: string; itemId: number; icon: string }> = {
  'charged_quartz_crystal': {
    name: 'Charged Quartz Crystal',
    itemId: 43772,
    icon: 'https://render.guildwars2.com/file/3D08FC066DADF6EFFBD01E8A6E7D3A43F7F42C4C/220438.png'
  },
  'glob_of_elder_spirit_residue': {
    name: 'Glob of Elder Spirit Residue',
    itemId: 46744,
    icon: 'https://render.guildwars2.com/file/32C4A0D2A94F80136C13DA6EB6C63E3D8F31EC3E/631494.png'
  },
  'lump_of_mithrilium': {
    name: 'Lump of Mithrilium',
    itemId: 46742,
    icon: 'https://render.guildwars2.com/file/76E9BB29A2F1CA81EFA1AE4CA1AA6AC8851AE296/631486.png'
  },
  'spool_of_silk_weaving_thread': {
    name: 'Spool of Silk Weaving Thread',
    itemId: 46740,
    icon: 'https://render.guildwars2.com/file/12D9D64E1C7D9D28D4D3B88C68EDB38EB2ECC98E/631482.png'
  },
  'spool_of_thick_elonian_cord': {
    name: 'Spool of Thick Elonian Cord',
    itemId: 46745,
    icon: 'https://render.guildwars2.com/file/D1B3F7EA25E3A3FBA95DE3BFAE1EABA9C87EE7E9/631496.png'
  },
  'grow_lamp': {
    name: 'Grow Lamp',
    itemId: 66913,
    icon: 'https://render.guildwars2.com/file/6EBDF2B2B9783B6F84CDBAF2C2E7C0A74FC5F77A/1302212.png'
  },
  'heat_stone': {
    name: 'Heat Stone',
    itemId: 66917,
    icon: 'https://render.guildwars2.com/file/59F8E83CA3633C67BC6D6C9A8A3E3F37D7ABCDEA/1302216.png'
  },
};

const MAP_CHEST_INFO: Record<string, { name: string; reward: string; icon: string }> = {
  'auric_basin_heros_choice_chest': { name: 'Auric Basin', reward: 'Exotic + Aurillium', icon: GW2_ICONS.aurillium },
  'verdant_brink_heros_choice_chest': { name: 'Verdant Brink', reward: 'Exotic + Airship Parts', icon: GW2_ICONS.airshipPart },
  'tangled_depths_heros_choice_chest': { name: 'Tangled Depths', reward: 'Exotic + Ley Crystals', icon: GW2_ICONS.leyLineCrystal },
  'dragons_stand_heros_choice_chest': { name: "Dragon's Stand", reward: 'Exotic + Crystalline Ore', icon: GW2_ICONS.crystallineOre },
};

const RAID_ENCOUNTER_REWARDS: Record<string, string> = {
  // Spirit Vale
  'vale_guardian': '2 LI',
  'spirit_woods': '1 LI',
  'gorseval': '2 LI',
  'sabetha': '2 LI',
  // Salvation Pass
  'slothasor': '2 LI',
  'bandit_trio': '1 LI',
  'matthias': '2 LI',
  // Stronghold of the Faithful
  'escort': '1 LI',
  'keep_construct': '2 LI',
  'twisted_castle': '1 LI',
  'xera': '2 LI',
  // Bastion of the Penitent
  'cairn': '2 LI',
  'mursaat_overseer': '2 LI',
  'samarog': '2 LI',
  'deimos': '2 LI',
  // Hall of Chains
  'soulless_horror': '2 LI',
  'river_of_souls': '1 LI',
  'statues_of_grenth': '2 LI',
  'voice_in_the_void': '2 LI',
  // Mythwright Gambit
  'conjured_amalgamate': '2 LI',
  'twin_largos': '2 LI',
  'qadim': '2 LI',
  // The Key of Ahdashim
  'gate': '1 LI',
  'adina': '2 LI',
  'sabir': '2 LI',
  'qadim_the_peerless': '2 LI',
};

function getTimeUntilDailyReset() {
  const now = new Date();
  const reset = new Date(now);
  reset.setUTCHours(24, 0, 0, 0);
  return reset.getTime() - now.getTime();
}

function getTimeUntilWeeklyReset() {
  const now = new Date();
  const reset = new Date(now);
  const daysUntilMonday = (8 - now.getUTCDay()) % 7 || 7;
  reset.setUTCDate(reset.getUTCDate() + daysUntilMonday);
  reset.setUTCHours(7, 30, 0, 0);
  return reset.getTime() - now.getTime();
}

function formatReset(ms: number) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  }
  return `${hours}h ${minutes}m`;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
    </div>
  );
}

interface ProgressCardProps {
  title: string;
  icon: React.ReactNode;
  completed: number;
  total: number;
  color: 'yellow' | 'blue' | 'purple';
  reward?: number;
}

function ProgressCard({ title, icon, completed, total, color, reward }: ProgressCardProps) {
  const percent = total > 0 ? (completed / total) * 100 : 0;
  const colors = {
    yellow: 'from-yellow-500 to-amber-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
  };
  const isComplete = completed === total;

  return (
    <div className={`p-2 rounded-lg border transition-all duration-300 ${
      isComplete
        ? 'bg-success/5 border-success/30 shadow-lg shadow-success/10'
        : 'bg-card hover:border-gw2-accent/30 hover:shadow-md'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-medium">{title}</span>
        <span className="ml-auto text-sm">
          {completed}/{total}
          {isComplete && reward && <span className="text-gw2-accent ml-1">+{reward}</span>}
        </span>
        {isComplete && <CheckCircle2 className="h-4 w-4 text-success" />}
      </div>
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colors[color]} transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

function getTrackColor(track: string) {
  const colors: Record<string, string> = {
    'PvE': 'border-green-500/50 text-green-500',
    'PvP': 'border-red-500/50 text-red-500',
    'WvW': 'border-orange-500/50 text-orange-500',
    'Fractals': 'border-purple-500/50 text-purple-500',
  };
  return colors[track] || 'border-muted-foreground text-muted-foreground';
}

interface ObjectiveCardProps {
  objective: WizardsVaultObjective;
}

function ObjectiveCard({ objective }: ObjectiveCardProps) {
  const isComplete = objective.progress_current >= objective.progress_complete;

  return (
    <div className={`flex items-center gap-2 py-1.5 px-2 rounded border-l-2 ${
      isComplete
        ? 'border-l-success bg-success/5 opacity-60'
        : 'border-l-gw2-accent bg-card hover:bg-muted/50'
    }`}>
      {isComplete ? (
        <Check className="h-3.5 w-3.5 text-success shrink-0" />
      ) : (
        <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      )}
      <span className={`flex-1 text-sm truncate ${isComplete ? 'line-through' : ''}`}>
        {objective.title}
      </span>
      <Badge className={`${getTrackColor(objective.track)} text-[10px] px-1.5 py-0`} variant="outline">
        {objective.track}
      </Badge>
      {!isComplete && (
        <span className="text-xs text-muted-foreground w-12 text-right">
          {objective.progress_current}/{objective.progress_complete}
        </span>
      )}
      <span className="text-xs font-semibold text-gw2-accent w-8 text-right">+{objective.acclaim}</span>
    </div>
  );
}

interface MetaRewardCardProps {
  title: string;
  progressCurrent: number;
  progressComplete: number;
  rewardAstral?: number;
  claimed?: boolean;
}

function MetaRewardCard({ title, progressCurrent, progressComplete, rewardAstral, claimed }: MetaRewardCardProps) {
  const isComplete = progressCurrent >= progressComplete;
  const progress = progressComplete > 0 ? (progressCurrent / progressComplete) * 100 : 0;

  return (
    <div className={`p-2 rounded-lg border-2 mb-2 transition-all duration-300 ${
      claimed
        ? 'bg-success/10 border-success/50 shadow-lg shadow-success/20'
        : isComplete
          ? 'bg-gw2-accent/10 border-gw2-accent/50 shadow-lg shadow-gw2-gold/20 animate-pulse-glow'
          : 'bg-card border-border'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${
          claimed
            ? 'bg-success/20 border border-success/30'
            : isComplete
              ? 'bg-gw2-accent/20 border border-gw2-accent/30'
              : 'bg-muted/50 border border-border'
        }`}>
          <Gift className={`h-5 w-5 ${claimed ? 'text-success' : isComplete ? 'text-gw2-accent' : 'text-muted-foreground'}`} />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{title}</span>
            {claimed && (
              <Badge className="bg-success/20 text-success border-success/50 text-xs py-0">
                <Check className="h-3 w-3 mr-1" /> Claimed
              </Badge>
            )}
            {!claimed && isComplete && (
              <Badge className="bg-gw2-accent/20 text-gw2-accent border-gw2-accent/50 text-xs py-0 animate-pulse">
                Ready to claim!
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-48">
              <div
                className={`h-full transition-all duration-500 ${claimed ? 'bg-success' : 'bg-gradient-to-r from-gw2-accent to-blue-400'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{progressCurrent}/{progressComplete}</span>
          </div>
        </div>

        {isComplete && rewardAstral && (
          <div className="text-right">
            <div className={`text-lg font-bold ${claimed ? 'text-success' : 'text-gw2-accent'}`}>+{rewardAstral}</div>
            <div className="text-xs text-muted-foreground">Acclaim</div>
          </div>
        )}
      </div>
    </div>
  );
}

function formatName(id: string): string {
  return id
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function WorldBossItem({ bossId, completed }: { bossId: string; completed: boolean }) {
  const eventId = BOSS_EVENT_MAP[bossId];
  const event = GAME_EVENTS.find(e => e.id === eventId);
  const spawn = event ? getNextSpawn(event) : null;
  const reward = event?.reward;
  const waypoint = event?.waypoint;
  const mapName = event?.map;

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const copyWaypoint = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (waypoint) {
      navigator.clipboard.writeText(waypoint);
      toast.success('Waypoint copied!', { duration: 2000 });
    }
  };

  return (
    <div className={`flex items-center gap-2 py-1.5 px-2 rounded ${
      completed ? 'opacity-60' : 'hover:bg-muted/50'
    }`}>
      {completed ? (
        <Check className="h-3.5 w-3.5 text-success shrink-0" />
      ) : (
        <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <span className={`text-sm block truncate ${completed ? 'line-through text-muted-foreground' : ''}`}>
          {formatName(bossId)}
        </span>
        {mapName && (
          <span className="text-[10px] text-muted-foreground truncate block">{mapName}</span>
        )}
      </div>
      {spawn && !completed && (
        <span className={`text-xs shrink-0 ${spawn.isActive ? 'text-success font-medium' : 'text-muted-foreground'}`}>
          {spawn.isActive ? 'Active!' : formatTime(spawn.minutesUntil)}
        </span>
      )}
      {reward && (
        <span className="text-[10px] text-gw2-accent shrink-0">{reward}</span>
      )}
      {waypoint && (
        <button
          onClick={copyWaypoint}
          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-gw2-accent/10 hover:bg-gw2-accent/20 border border-gw2-accent/30 transition-colors shrink-0 group"
          title={`Copy waypoint: ${waypoint}`}
        >
          <img src={GW2_ICONS.waypoint} alt="" className="h-3 w-3" />
          <span className="text-[10px] font-medium text-gw2-accent group-hover:text-gw2-accent-light">WP</span>
        </button>
      )}
    </div>
  );
}

function DungeonPathItem({ pathId, completed }: { pathId: string; completed: boolean }) {
  const info = DUNGEON_INFO[pathId];
  return (
    <div className={`flex items-center gap-2 py-1 px-2 rounded ${
      completed ? 'opacity-60' : 'hover:bg-muted/50'
    }`}>
      {completed ? (
        <Check className="h-3.5 w-3.5 text-success shrink-0" />
      ) : (
        <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      )}
      <span className={`flex-1 text-sm ${completed ? 'line-through text-muted-foreground' : ''}`}>
        {info?.name || formatName(pathId)}
      </span>
      {info?.reward && (
        <span className="text-[10px] text-gw2-accent">{info.reward}</span>
      )}
    </div>
  );
}

function DailyCraftingItem({ itemId, completed }: { itemId: string; completed: boolean }) {
  const info = DAILY_CRAFTING_ITEMS[itemId];
  const name = info?.name || formatName(itemId);

  return (
    <div className={`flex items-center gap-2 py-1 px-2 rounded ${
      completed ? 'opacity-60' : 'hover:bg-muted/50'
    }`}>
      {info?.icon ? (
        <img src={info.icon} alt={name} className="h-5 w-5 rounded" />
      ) : completed ? (
        <Check className="h-3.5 w-3.5 text-success shrink-0" />
      ) : (
        <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      )}
      <span className={`flex-1 text-sm ${completed ? 'line-through text-muted-foreground' : ''}`}>
        {name}
      </span>
      {completed && <Check className="h-3.5 w-3.5 text-success shrink-0" />}
    </div>
  );
}

function MapChestItem({ chestId, completed }: { chestId: string; completed: boolean }) {
  const info = MAP_CHEST_INFO[chestId];
  const name = info?.name || formatName(chestId.replace('_heros_choice_chest', ''));

  return (
    <div className={`flex items-center gap-2 py-1 px-2 rounded ${
      completed ? 'opacity-60' : 'hover:bg-muted/50'
    }`}>
      {info?.icon && (
        <img src={info.icon} alt="" className="h-5 w-5" />
      )}
      {completed ? (
        <Check className="h-3.5 w-3.5 text-success shrink-0" />
      ) : (
        <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      )}
      <span className={`flex-1 text-sm ${completed ? 'line-through text-muted-foreground' : ''}`}>
        {name}
      </span>
      {info?.reward && (
        <span className="text-[10px] text-gw2-accent">{info.reward}</span>
      )}
    </div>
  );
}

function RaidEncounterItem({ eventId, completed }: { eventId: string; completed: boolean }) {
  const reward = RAID_ENCOUNTER_REWARDS[eventId];

  return (
    <div className={`flex items-center gap-2 py-1 px-2 rounded ${
      completed ? 'opacity-60' : 'hover:bg-muted/50'
    }`}>
      {completed ? (
        <Check className="h-3.5 w-3.5 text-success shrink-0" />
      ) : (
        <Circle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
      )}
      <span className={`flex-1 text-sm ${completed ? 'line-through text-muted-foreground' : ''}`}>
        {formatName(eventId)}
      </span>
      {reward && (
        <div className="flex items-center gap-1">
          <img src={GW2_ICONS.legendaryInsight} alt="LI" className="h-4 w-4" />
          <span className="text-[10px] text-gw2-accent">{reward}</span>
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  title,
  icon,
  completed,
  total,
  defaultOpen = false,
  children
}: {
  title: string;
  icon: React.ReactNode;
  completed: number;
  total: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const isComplete = completed === total && total > 0;

  return (
    <div className="border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2 p-2 text-left hover:bg-muted/50 transition-colors ${
          isComplete ? 'bg-success/5' : ''
        }`}
      >
        {icon}
        <span className="font-medium flex-1">{title}</span>
        <span className={`text-sm ${isComplete ? 'text-success' : 'text-muted-foreground'}`}>
          {completed}/{total}
        </span>
        {isComplete && <CheckCircle2 className="h-4 w-4 text-success" />}
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-2 pt-0 border-t">
          {children}
        </div>
      )}
    </div>
  );
}

export function Dailies() {
  const [mainTab, setMainTab] = useState('daily');
  const [isVaultOpen, setIsVaultOpen] = useState(true);
  const isAuthenticated = getApiClient().isAuthenticated();

  const { data: vaultDaily, isLoading: loadingDaily } = useWizardsVaultDaily({
    enabled: isAuthenticated,
  });
  const { data: vaultWeekly, isLoading: loadingWeekly } = useWizardsVaultWeekly({
    enabled: isAuthenticated,
  });
  const { data: vaultSpecial, isLoading: loadingSpecial } = useWizardsVaultSpecial({
    enabled: isAuthenticated,
  });

  const { data: worldBossesCompleted = [] } = useWorldBossesCompleted({
    enabled: isAuthenticated,
  });
  const { data: dungeons = [] } = useDungeons();
  const { data: dungeonsCompleted = [] } = useDungeonsCompleted({
    enabled: isAuthenticated,
  });
  const { data: mapChests = [] } = useMapChests();
  const { data: mapChestsCompleted = [] } = useMapChestsCompleted({
    enabled: isAuthenticated,
  });
  const { data: dailyCrafting = [] } = useDailyCrafting();
  const { data: dailyCraftingCompleted = [] } = useDailyCraftingCompleted({
    enabled: isAuthenticated,
  });
  const { data: raids = [] } = useRaids();
  const { data: raidsCompleted = [] } = useRaidsCompleted({
    enabled: isAuthenticated,
  });

  const WORLD_BOSSES = [
    'tequatl', 'jungle_wurm', 'megadestroyer', 'fire_elemental',
    'shadow_behemoth', 'claw_of_jormag', 'shatterer', 'modniir_ulgoth',
    'golem_mark_ii', 'admiral_taidha_covington', 'karka_queen'
  ];
  const worldBossesCompletedCount = WORLD_BOSSES.filter(b => worldBossesCompleted.includes(b)).length;

  const [dailyReset, setDailyReset] = useState(getTimeUntilDailyReset());
  const [weeklyReset, setWeeklyReset] = useState(getTimeUntilWeeklyReset());

  useEffect(() => {
    const interval = setInterval(() => {
      setDailyReset(getTimeUntilDailyReset());
      setWeeklyReset(getTimeUntilWeeklyReset());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const dailyCompleted =
    vaultDaily?.objectives.filter((o) => o.progress_current >= o.progress_complete).length || 0;
  const dailyTotal = vaultDaily?.objectives.length || 0;
  const weeklyCompleted =
    vaultWeekly?.objectives.filter((o) => o.progress_current >= o.progress_complete).length || 0;
  const weeklyTotal = vaultWeekly?.objectives.length || 0;
  const specialCompleted =
    vaultSpecial?.objectives.filter((o) => o.progress_current >= o.progress_complete).length || 0;
  const specialTotal = vaultSpecial?.objectives.length || 0;

  const acclaim = vaultDaily?.meta_progress_current || 0;

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold mb-2">Wizard's Vault</h2>
        <p className="text-muted-foreground mb-4">
          Add your API key to track daily, weekly, and special objectives
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Wizard's Vault Container */}
      <div className={`border border-gw2-accent/30 rounded-lg overflow-hidden ${isVaultOpen ? '' : ''}`}>
        {/* Container Header - Collapsible */}
        <button
          onClick={() => setIsVaultOpen(!isVaultOpen)}
          className={`w-full flex items-center gap-3 text-left p-3 bg-gradient-to-r from-gw2-accent/15 via-gw2-accent/10 to-gw2-accent/5 hover:from-gw2-accent/25 hover:to-gw2-accent/15 transition-all group ${isVaultOpen ? 'border-b border-gw2-accent/20' : ''}`}
        >
          <div className="p-2 rounded-lg bg-gw2-accent/20 border border-gw2-accent/30">
            <CalendarCheck className="h-5 w-5 text-gw2-accent" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gw2-accent">Wizard's Vault</h1>
            <p className="text-xs text-muted-foreground">
              Daily, weekly, and special objectives • Reset: <span className="text-gw2-accent font-mono">{formatReset(dailyReset)}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors hidden sm:inline">
              {isVaultOpen ? 'Collapse' : 'Expand'}
            </span>
            <div className="p-1.5 rounded-md bg-gw2-accent/10 group-hover:bg-gw2-accent/20 transition-colors">
              <ChevronDown className={`h-4 w-4 text-gw2-accent transition-transform duration-200 ${isVaultOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </button>

        {isVaultOpen && (
        <div className="p-3 space-y-4">
      {/* Featured Reset Timer Card */}
      <div className="p-3 rounded-lg border border-gw2-accent/30 bg-gradient-to-br from-gw2-accent/5 via-transparent to-gw2-gold/5">
        <div className="flex items-center justify-between">
          {/* Astral Acclaim */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gw2-accent/10 border border-gw2-accent/20">
              <Sparkles className="h-4 w-4 text-gw2-accent" />
            </div>
            <div>
              <div className="text-lg font-bold text-gw2-accent">{acclaim}</div>
              <div className="text-[10px] text-muted-foreground">Astral Acclaim</div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-border" />

          {/* Daily Reset */}
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-gw2-accent">{formatReset(dailyReset)}</div>
            <div className="text-[10px] text-muted-foreground">Daily Reset</div>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-border" />

          {/* Weekly Reset */}
          <div className="text-center">
            <div className="text-base font-mono font-bold">{formatReset(weeklyReset)}</div>
            <div className="text-[10px] text-muted-foreground">Weekly Reset</div>
          </div>
        </div>
      </div>

      {/* Progress Bars Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <ProgressCard
          title="Daily"
          icon={<Sun className="h-5 w-5 text-yellow-500" />}
          completed={dailyCompleted}
          total={dailyTotal}
          color="yellow"
          reward={vaultDaily?.meta_reward_astral}
        />
        <ProgressCard
          title="Weekly"
          icon={<Calendar className="h-5 w-5 text-blue-500" />}
          completed={weeklyCompleted}
          total={weeklyTotal}
          color="blue"
          reward={vaultWeekly?.meta_reward_astral}
        />
        <ProgressCard
          title="Special"
          icon={<Star className="h-5 w-5 text-purple-500" />}
          completed={specialCompleted}
          total={specialTotal}
          color="purple"
        />
      </div>

      {/* Tabs for objectives */}
      <Tabs value={mainTab} onValueChange={setMainTab}>
        <TabsList className="w-full grid grid-cols-3 h-auto bg-transparent gap-1 p-0">
          <TabsTrigger
            value="daily"
            className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md border border-transparent hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-gw2-accent data-[state=active]:border-border transition-colors"
          >
            <Sun className="h-4 w-4" />
            <span>Daily</span>
          </TabsTrigger>
          <TabsTrigger
            value="weekly"
            className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md border border-transparent hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-gw2-accent data-[state=active]:border-border transition-colors"
          >
            <Calendar className="h-4 w-4" />
            <span>Weekly</span>
          </TabsTrigger>
          <TabsTrigger
            value="special"
            className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md border border-transparent hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-gw2-accent data-[state=active]:border-border transition-colors"
          >
            <Star className="h-4 w-4" />
            <span>Special</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="mt-4">
          {loadingDaily ? (
            <LoadingSpinner />
          ) : !vaultDaily ? (
            <div className="text-center py-12 text-muted-foreground">
              Failed to load daily objectives
            </div>
          ) : (() => {
              const incomplete = vaultDaily.objectives.filter(o => o.progress_current < o.progress_complete);
              const complete = vaultDaily.objectives.filter(o => o.progress_current >= o.progress_complete);

              return (
                <div className="space-y-4">
                  <MetaRewardCard
                    title="Daily Meta Reward"
                    progressCurrent={vaultDaily.meta_progress_current}
                    progressComplete={vaultDaily.meta_progress_complete}
                    rewardAstral={vaultDaily.meta_reward_astral}
                    claimed={vaultDaily.meta_reward_claimed}
                  />
                  {/* Incomplete first */}
                  {incomplete.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {incomplete.map(obj => <ObjectiveCard key={obj.id} objective={obj} />)}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-success" />
                      <p className="font-medium">All daily objectives completed!</p>
                    </div>
                  )}

                  {/* Completed section */}
                  {complete.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Completed ({complete.length})</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                      <div className="flex flex-col gap-1">
                        {complete.map(obj => <ObjectiveCard key={obj.id} objective={obj} />)}
                      </div>
                    </>
                  )}
                </div>
              );
            })()
          }
        </TabsContent>

        <TabsContent value="weekly" className="mt-4">
          {loadingWeekly ? (
            <LoadingSpinner />
          ) : !vaultWeekly ? (
            <div className="text-center py-12 text-muted-foreground">
              Failed to load weekly objectives
            </div>
          ) : (() => {
              const incomplete = vaultWeekly.objectives.filter(o => o.progress_current < o.progress_complete);
              const complete = vaultWeekly.objectives.filter(o => o.progress_current >= o.progress_complete);

              return (
                <div className="space-y-4">
                  <MetaRewardCard
                    title="Weekly Meta Reward"
                    progressCurrent={vaultWeekly.meta_progress_current}
                    progressComplete={vaultWeekly.meta_progress_complete}
                    rewardAstral={vaultWeekly.meta_reward_astral}
                    claimed={vaultWeekly.meta_reward_claimed}
                  />
                  {/* Incomplete first */}
                  {incomplete.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {incomplete.map(obj => <ObjectiveCard key={obj.id} objective={obj} />)}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-success" />
                      <p className="font-medium">All weekly objectives completed!</p>
                    </div>
                  )}

                  {/* Completed section */}
                  {complete.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Completed ({complete.length})</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                      <div className="flex flex-col gap-1">
                        {complete.map(obj => <ObjectiveCard key={obj.id} objective={obj} />)}
                      </div>
                    </>
                  )}
                </div>
              );
            })()
          }
        </TabsContent>

        <TabsContent value="special" className="mt-4">
          {loadingSpecial ? (
            <LoadingSpinner />
          ) : !vaultSpecial ? (
            <div className="text-center py-12 text-muted-foreground">
              Failed to load special objectives
            </div>
          ) : vaultSpecial.objectives.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No special objectives available
            </div>
          ) : (() => {
              const incomplete = vaultSpecial.objectives.filter(o => o.progress_current < o.progress_complete);
              const complete = vaultSpecial.objectives.filter(o => o.progress_current >= o.progress_complete);

              return (
                <div className="space-y-4">
                  {/* Incomplete first */}
                  {incomplete.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {incomplete.map(obj => <ObjectiveCard key={obj.id} objective={obj} />)}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <CheckCircle2 className="h-12 w-12 mx-auto mb-2 text-success" />
                      <p className="font-medium">All special objectives completed!</p>
                    </div>
                  )}

                  {/* Completed section */}
                  {complete.length > 0 && (
                    <>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Completed ({complete.length})</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                      <div className="flex flex-col gap-1">
                        {complete.map(obj => <ObjectiveCard key={obj.id} objective={obj} />)}
                      </div>
                    </>
                  )}
                </div>
              );
            })()
          }
        </TabsContent>
      </Tabs>
        </div>
        )}
      </div>

      {/* Daily Checklist Separator */}
      <div className="flex items-center gap-2 mt-6 mb-4">
        <CalendarCheck className="h-5 w-5 text-gw2-accent" />
        <h2 className="text-lg font-bold text-gw2-accent">Daily Checklist</h2>
        <div className="flex-1 h-px bg-gw2-accent/30" />
      </div>

      {/* Daily Tracking Sections */}
      <div className="space-y-2">
        {/* World Bosses */}
        <SectionHeader
          title="World Bosses"
          icon={<Skull className="h-4 w-4 text-red-500" />}
          completed={worldBossesCompletedCount}
          total={WORLD_BOSSES.length}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 pt-2">
            {WORLD_BOSSES.map(boss => (
              <WorldBossItem
                key={boss}
                bossId={boss}
                completed={worldBossesCompleted.includes(boss)}
              />
            ))}
          </div>
        </SectionHeader>

        {/* Dungeons */}
        <SectionHeader
          title="Dungeons"
          icon={<Castle className="h-4 w-4 text-amber-500" />}
          completed={dungeonsCompleted.length}
          total={dungeons.reduce((acc, d) => acc + d.paths.length, 0)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {dungeons.map(dungeon => {
              const dungeonPathsCompleted = dungeon.paths.filter(p =>
                dungeonsCompleted.includes(p.id)
              ).length;
              return (
                <div key={dungeon.id} className="border rounded-lg p-2 bg-muted/20">
                  <div className="flex items-center gap-2 text-sm font-medium mb-1">
                    {DUNGEON_ICONS[dungeon.id] && (
                      <img src={DUNGEON_ICONS[dungeon.id]} alt="" className="h-5 w-5" />
                    )}
                    <span>{formatName(dungeon.id)}</span>
                    <span className={`text-xs ${dungeonPathsCompleted === dungeon.paths.length ? 'text-success' : 'text-muted-foreground'}`}>
                      ({dungeonPathsCompleted}/{dungeon.paths.length})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {dungeon.paths.map(path => (
                      <DungeonPathItem
                        key={path.id}
                        pathId={path.id}
                        completed={dungeonsCompleted.includes(path.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionHeader>

        {/* Daily Crafting */}
        <SectionHeader
          title="Daily Crafting"
          icon={<Gem className="h-4 w-4 text-purple-500" />}
          completed={dailyCraftingCompleted.length}
          total={dailyCrafting.length}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 gap-1 pt-2">
            {dailyCrafting.map(item => (
              <DailyCraftingItem
                key={item.id}
                itemId={item.id}
                completed={dailyCraftingCompleted.includes(item.id)}
              />
            ))}
          </div>
        </SectionHeader>

        {/* Map Reward Chests */}
        <SectionHeader
          title="Map Reward Chests"
          icon={<Map className="h-4 w-4 text-green-500" />}
          completed={mapChestsCompleted.length}
          total={mapChests.length}
        >
          <div className="grid grid-cols-2 gap-1 pt-2">
            {mapChests.map(chest => (
              <MapChestItem
                key={chest.id}
                chestId={chest.id}
                completed={mapChestsCompleted.includes(chest.id)}
              />
            ))}
          </div>
        </SectionHeader>

        {/* Raids (Weekly) */}
        <SectionHeader
          title="Raids (Weekly)"
          icon={<Swords className="h-4 w-4 text-orange-500" />}
          completed={raidsCompleted.length}
          total={raids.reduce((acc, r) => acc + r.wings.reduce((wa, w) => wa + w.events.length, 0), 0)}
        >
          <div className="space-y-2 pt-2">
            {raids.map(raid => (
              <div key={raid.id} className="border-l-2 border-orange-500/30 pl-2">
                <div className="font-medium text-sm mb-1">{formatName(raid.id)}</div>
                {raid.wings.map(wing => {
                  const wingCompleted = wing.events.filter(e =>
                    raidsCompleted.includes(e.id)
                  ).length;
                  return (
                    <div key={wing.id} className="ml-2 mb-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <span>{formatName(wing.id)}</span>
                        <span>({wingCompleted}/{wing.events.length})</span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                        {wing.events.map(event => (
                          <RaidEncounterItem
                            key={event.id}
                            eventId={event.id}
                            completed={raidsCompleted.includes(event.id)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </SectionHeader>
      </div>
    </div>
  );
}
