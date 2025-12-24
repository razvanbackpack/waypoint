export interface GameEvent {
  id: string;
  name: string;
  map: string;
  category: 'core' | 'hot' | 'pof' | 'ibs' | 'eod' | 'soto';
  type: 'boss' | 'meta';
  spawnMinutes: number[];
  icon: string;
  waypoint?: string;
  difficulty: 'open' | 'group' | 'squad';
  duration: number; // Duration in minutes
}

export interface NextSpawn {
  nextSpawn: Date;
  minutesUntil: number;
  isActive?: boolean;
}

export const GAME_EVENTS: GameEvent[] = [
  // Core Tyria World Bosses
  {
    id: 'tequatl',
    name: 'Tequatl the Sunless',
    map: 'Sparkfly Fen',
    category: 'core',
    type: 'boss',
    spawnMinutes: [0],
    icon: '🐉',
    waypoint: '[&BNYAAAA=]',
    difficulty: 'squad',
    duration: 15
  },
  {
    id: 'triple_trouble',
    name: 'Triple Trouble',
    map: 'Bloodtide Coast',
    category: 'core',
    type: 'boss',
    spawnMinutes: [30],
    icon: '🐛',
    waypoint: '[&BKoBAAA=]',
    difficulty: 'squad',
    duration: 15
  },
  {
    id: 'karka_queen',
    name: 'Karka Queen',
    map: 'Southsun Cove',
    category: 'core',
    type: 'boss',
    spawnMinutes: [60],
    icon: '🦀',
    waypoint: '[&BN4CAAA=]',
    difficulty: 'group',
    duration: 10
  },
  {
    id: 'modniir',
    name: 'Modniir Ulgoth',
    map: 'Harathi Hinterlands',
    category: 'core',
    type: 'boss',
    spawnMinutes: [15],
    icon: '⚔️',
    waypoint: '[&BPcBAAA=]',
    difficulty: 'open',
    duration: 10
  },
  {
    id: 'shadow_behemoth',
    name: 'Shadow Behemoth',
    map: 'Queensdale',
    category: 'core',
    type: 'boss',
    spawnMinutes: [15, 105],
    icon: '👹',
    waypoint: '[&BKgBAAA=]',
    difficulty: 'open',
    duration: 15
  },
  {
    id: 'svanir',
    name: 'Svanir Shaman',
    map: 'Wayfarer Foothills',
    category: 'core',
    type: 'boss',
    spawnMinutes: [15, 105],
    icon: '❄️',
    waypoint: '[&BNQAAAA=]',
    difficulty: 'open',
    duration: 10
  },
  {
    id: 'fire_elemental',
    name: 'Fire Elemental',
    map: 'Metrica Province',
    category: 'core',
    type: 'boss',
    spawnMinutes: [45, 105],
    icon: '🔥',
    waypoint: '[&BE4AAAA=]',
    difficulty: 'open',
    duration: 10
  },
  {
    id: 'jungle_wurm',
    name: 'Great Jungle Wurm',
    map: 'Caledon Forest',
    category: 'core',
    type: 'boss',
    spawnMinutes: [15, 75],
    icon: '🐍',
    waypoint: '[&BEYAAAA=]',
    difficulty: 'open',
    duration: 10
  },
  {
    id: 'shatterer',
    name: 'The Shatterer',
    map: 'Blazeridge Steppes',
    category: 'core',
    type: 'boss',
    spawnMinutes: [60],
    icon: '💎',
    waypoint: '[&BO0AAAA=]',
    difficulty: 'group',
    duration: 15
  },
  {
    id: 'megadestroyer',
    name: 'Megadestroyer',
    map: 'Mount Maelstrom',
    category: 'core',
    type: 'boss',
    spawnMinutes: [30, 90],
    icon: '🌋',
    waypoint: '[&BNABAAA=]',
    difficulty: 'group',
    duration: 15
  },
  {
    id: 'claw',
    name: 'Claw of Jormag',
    map: 'Frostgorge Sound',
    category: 'core',
    type: 'boss',
    spawnMinutes: [90],
    icon: '🐲',
    waypoint: '[&BPQCAAA=]',
    difficulty: 'group',
    duration: 15
  },
  {
    id: 'frozen_maw',
    name: 'Frozen Maw',
    map: 'Wayfarer Foothills',
    category: 'core',
    type: 'boss',
    spawnMinutes: [15, 75],
    icon: '❄️',
    waypoint: '[&BMMAAAA=]',
    difficulty: 'open',
    duration: 10
  },
  {
    id: 'fire_shaman',
    name: 'Fire Shaman',
    map: 'Diessa Plateau',
    category: 'core',
    type: 'boss',
    spawnMinutes: [15, 75],
    icon: '🔥',
    waypoint: '[&BMwDAAA=]',
    difficulty: 'open',
    duration: 10
  },
  {
    id: 'golem_mark_ii',
    name: 'Golem Mark II',
    map: 'Mount Maelstrom',
    category: 'core',
    type: 'boss',
    spawnMinutes: [0, 60],
    icon: '🤖',
    waypoint: '[&BM0BAAA=]',
    difficulty: 'open',
    duration: 10
  },
  {
    id: 'ulgoth',
    name: 'Ulgoth',
    map: 'Harathi Hinterlands',
    category: 'core',
    type: 'boss',
    spawnMinutes: [30, 90],
    icon: '⚔️',
    waypoint: '[&BPcBAAA=]',
    difficulty: 'open',
    duration: 10
  },

  // Core Tyria Metas
  {
    id: 'dry_top',
    name: 'Dry Top (Sandstorm)',
    map: 'Dry Top',
    category: 'core',
    type: 'meta',
    spawnMinutes: [40, 100],
    icon: '🏜️',
    waypoint: '[&BIAHAAA=]',
    difficulty: 'open',
    duration: 15
  },
  {
    id: 'silver_wastes',
    name: 'RIBA / Vinewrath',
    map: 'Silverwastes',
    category: 'core',
    type: 'meta',
    spawnMinutes: [0, 60],
    icon: '🪱',
    waypoint: '[&BPUHAAA=]',
    difficulty: 'group',
    duration: 20
  },

  // Heart of Thorns Metas
  {
    id: 'verdant_brink_day',
    name: 'Verdant Brink (Day)',
    map: 'Verdant Brink',
    category: 'hot',
    type: 'meta',
    spawnMinutes: [10],
    icon: '☀️',
    waypoint: '[&BOAHAAA=]',
    difficulty: 'open',
    duration: 25
  },
  {
    id: 'verdant_brink_night',
    name: 'Verdant Brink (Night)',
    map: 'Verdant Brink',
    category: 'hot',
    type: 'meta',
    spawnMinutes: [55],
    icon: '🌙',
    waypoint: '[&BOAHAAA=]',
    difficulty: 'group',
    duration: 25
  },
  {
    id: 'auric_basin',
    name: 'Octovine',
    map: 'Auric Basin',
    category: 'hot',
    type: 'meta',
    spawnMinutes: [45],
    icon: '🌿',
    waypoint: '[&BOMEAAA=]',
    difficulty: 'group',
    duration: 20
  },
  {
    id: 'tangled_depths',
    name: 'Chak Gerent',
    map: 'Tangled Depths',
    category: 'hot',
    type: 'meta',
    spawnMinutes: [30],
    icon: '🐛',
    waypoint: '[&BPQHAAA=]',
    difficulty: 'group',
    duration: 20
  },
  {
    id: 'dragons_stand',
    name: "Dragon's Stand",
    map: "Dragon's Stand",
    category: 'hot',
    type: 'meta',
    spawnMinutes: [90],
    icon: '🐉',
    waypoint: '[&BBAIAAA=]',
    difficulty: 'squad',
    duration: 30
  },

  // Path of Fire Metas
  {
    id: 'casino_blitz',
    name: 'Casino Blitz',
    map: 'Amnoon',
    category: 'pof',
    type: 'meta',
    spawnMinutes: [20, 80],
    icon: '🎰',
    waypoint: '[&BLsKAAA=]',
    difficulty: 'open',
    duration: 15
  },
  {
    id: 'pinata',
    name: 'Buried Treasure',
    map: 'Crystal Oasis',
    category: 'pof',
    type: 'meta',
    spawnMinutes: [5, 65],
    icon: '🎁',
    waypoint: '[&BKkKAAA=]',
    difficulty: 'open',
    duration: 15
  },
  {
    id: 'doppelganger',
    name: 'Doppelganger',
    map: 'Domain of Istan',
    category: 'pof',
    type: 'meta',
    spawnMinutes: [15, 75],
    icon: '👥',
    waypoint: '[&BAkLAAA=]',
    difficulty: 'open',
    duration: 10
  },
  {
    id: 'palawadan',
    name: 'Palawadan',
    map: 'Domain of Istan',
    category: 'pof',
    type: 'meta',
    spawnMinutes: [45, 105],
    icon: '🏰',
    waypoint: '[&BAkLAAA=]',
    difficulty: 'group',
    duration: 20
  },
  {
    id: 'junundu',
    name: 'Junundu Rising',
    map: 'Domain of Vabbi',
    category: 'pof',
    type: 'meta',
    spawnMinutes: [30, 90],
    icon: '🪱',
    waypoint: '[&BKMLAAA=]',
    difficulty: 'open',
    duration: 15
  },
  {
    id: 'serpents_ire',
    name: "Serpent's Ire",
    map: 'Domain of Vabbi',
    category: 'pof',
    type: 'meta',
    spawnMinutes: [30, 90],
    icon: '🐍',
    waypoint: '[&BKMLAAA=]',
    difficulty: 'group',
    duration: 20
  },
  {
    id: 'maws_of_torment',
    name: 'Maws of Torment',
    map: 'Desolation',
    category: 'pof',
    type: 'meta',
    spawnMinutes: [0, 60],
    icon: '😈',
    waypoint: '[&BKMLAAA=]',
    difficulty: 'open',
    duration: 15
  },
  {
    id: 'forged_steel',
    name: 'Forged with Fire',
    map: 'Thunderhead Peaks',
    category: 'pof',
    type: 'meta',
    spawnMinutes: [0, 60],
    icon: '🔥',
    waypoint: '[&BIQLAAA=]',
    difficulty: 'group',
    duration: 15
  },
  {
    id: 'thunderhead_keep',
    name: 'Thunderhead Keep',
    map: 'Thunderhead Peaks',
    category: 'pof',
    type: 'meta',
    spawnMinutes: [45, 105],
    icon: '⚡',
    waypoint: '[&BIQLAAA=]',
    difficulty: 'group',
    duration: 20
  },

  // Icebrood Saga Metas
  {
    id: 'grothmar_concert',
    name: 'Metal Concert',
    map: 'Grothmar Valley',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [0, 60],
    icon: '🎸',
    waypoint: '[&BDcMAAA=]',
    difficulty: 'open',
    duration: 15
  },
  {
    id: 'grothmar_ceremony',
    name: 'Ceremony of the Sacred Flame',
    map: 'Grothmar Valley',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [20, 80],
    icon: '🔥',
    waypoint: '[&BDcMAAA=]',
    difficulty: 'open',
    duration: 15
  },
  {
    id: 'grothmar_legion',
    name: 'Ooze Pit / Devourer Race',
    map: 'Grothmar Valley',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [45, 105],
    icon: '🏁',
    waypoint: '[&BDcMAAA=]',
    difficulty: 'open',
    duration: 10
  },
  {
    id: 'bjora_drakkar',
    name: 'Drakkar',
    map: 'Bjora Marches',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [5, 65],
    icon: '🐉',
    waypoint: '[&BHkMAAA=]',
    difficulty: 'group',
    duration: 20
  },
  {
    id: 'bjora_storms',
    name: 'Storms of Winter',
    map: 'Bjora Marches',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [45, 105],
    icon: '❄️',
    waypoint: '[&BHkMAAA=]',
    difficulty: 'group',
    duration: 20
  },
  {
    id: 'drizzlewood_north',
    name: 'Drizzlewood Coast (North)',
    map: 'Drizzlewood Coast',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [0, 60],
    icon: '⚔️',
    waypoint: '[&BKIMAAA=]',
    difficulty: 'group',
    duration: 20
  },
  {
    id: 'drizzlewood_south',
    name: 'Drizzlewood Coast (South)',
    map: 'Drizzlewood Coast',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [30, 90],
    icon: '⚔️',
    waypoint: '[&BKIMAAA=]',
    difficulty: 'group',
    duration: 20
  },
  {
    id: 'dragonstorm',
    name: 'Dragonstorm',
    map: 'Eye of the Storm',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [0, 60],
    icon: '🌪️',
    waypoint: '[&BPQMAAA=]',
    difficulty: 'squad',
    duration: 20
  },

  // End of Dragons Metas
  {
    id: 'seitung',
    name: 'Aetherblade Assault',
    map: 'Seitung Province',
    category: 'eod',
    type: 'meta',
    spawnMinutes: [90],
    icon: '⚔️',
    waypoint: '[&BGANAAA=]',
    difficulty: 'group',
    duration: 20
  },
  {
    id: 'kaineng',
    name: 'Kaineng Blackout',
    map: 'New Kaineng City',
    category: 'eod',
    type: 'meta',
    spawnMinutes: [0, 60],
    icon: '🌃',
    waypoint: '[&BFQNAAA=]',
    difficulty: 'group',
    duration: 20
  },
  {
    id: 'echovald',
    name: 'Gang War / Aspenwood',
    map: 'The Echovald Wilds',
    category: 'eod',
    type: 'meta',
    spawnMinutes: [30, 90],
    icon: '🌲',
    waypoint: '[&BPwNAAA=]',
    difficulty: 'group',
    duration: 25
  },
  {
    id: 'dragons_end_meta',
    name: "Dragon's End",
    map: "Dragon's End",
    category: 'eod',
    type: 'meta',
    spawnMinutes: [0],
    icon: '🐲',
    waypoint: '[&BGINAAA=]',
    difficulty: 'squad',
    duration: 30
  },

  // Secrets of the Obscure Metas
  {
    id: 'skywatch',
    name: 'Target Practice / Fly by Night',
    map: 'Skywatch Archipelago',
    category: 'soto',
    type: 'meta',
    spawnMinutes: [0, 30, 60, 90],
    icon: '🏝️',
    waypoint: '[&BKQOAAA=]',
    difficulty: 'open',
    duration: 15
  },
  {
    id: 'amnytas',
    name: 'Defense of Amnytas',
    map: 'Amnytas',
    category: 'soto',
    type: 'meta',
    spawnMinutes: [0, 60],
    icon: '🛡️',
    waypoint: '[&BLcOAAA=]',
    difficulty: 'group',
    duration: 20
  },
  {
    id: 'convergence',
    name: 'Convergences',
    map: 'Various',
    category: 'soto',
    type: 'meta',
    spawnMinutes: [30],
    icon: '🌀',
    waypoint: '[&BLcOAAA=]',
    difficulty: 'group',
    duration: 20
  },
  {
    id: 'nayos',
    name: 'Temple of Febe',
    map: 'Nayos',
    category: 'soto',
    type: 'meta',
    spawnMinutes: [0, 60],
    icon: '⭐',
    waypoint: '[&BKEOAAA=]',
    difficulty: 'group',
    duration: 20
  },
];

/**
 * Calculate the next spawn time for an event based on its spawn minutes in a 2-hour cycle
 * @param spawnMinutes Array of minutes within a 2-hour (120 minute) cycle when the event spawns
 * @param duration Duration of the event in minutes (default: 15)
 * @returns Object containing the next spawn Date, minutes until spawn, and active status
 */
export function getNextSpawn(spawnMinutes: number[], duration: number = 15): NextSpawn {
  const now = new Date();
  const currentHours = now.getUTCHours();
  const currentMinutes = now.getUTCMinutes();
  const currentSeconds = now.getUTCSeconds();

  // Total minutes since midnight UTC
  const totalCurrentMinutes = currentHours * 60 + currentMinutes + currentSeconds / 60;

  // Position within current 2-hour cycle (0-119)
  const cycleMinutes = totalCurrentMinutes % 120;

  // Sort spawn times
  const sortedSpawns = [...spawnMinutes].sort((a, b) => a - b);

  // First, check if any spawn in the current cycle is currently active
  for (const spawnMin of sortedSpawns) {
    if (spawnMin <= cycleMinutes) {
      const minutesSinceSpawn = cycleMinutes - spawnMin;
      if (minutesSinceSpawn < duration) {
        // This event is currently active
        const spawnTime = new Date(now);
        spawnTime.setUTCMinutes(currentMinutes - Math.floor(minutesSinceSpawn));
        spawnTime.setUTCSeconds(0);
        spawnTime.setUTCMilliseconds(0);
        return { nextSpawn: spawnTime, minutesUntil: -minutesSinceSpawn, isActive: true };
      }
    }
  }

  // Check if the last spawn from the previous cycle is still active
  const lastSpawn = sortedSpawns[sortedSpawns.length - 1];
  const minutesSinceLastCycleSpawn = cycleMinutes + (120 - lastSpawn);
  if (minutesSinceLastCycleSpawn < duration) {
    const spawnTime = new Date(now);
    spawnTime.setUTCMinutes(currentMinutes - Math.floor(minutesSinceLastCycleSpawn));
    spawnTime.setUTCSeconds(0);
    spawnTime.setUTCMilliseconds(0);
    return { nextSpawn: spawnTime, minutesUntil: -minutesSinceLastCycleSpawn, isActive: true };
  }

  // Find the next spawn in current cycle
  for (const spawnMin of sortedSpawns) {
    if (spawnMin > cycleMinutes) {
      const minutesUntil = spawnMin - cycleMinutes;
      const nextSpawn = new Date(now);
      nextSpawn.setUTCMinutes(currentMinutes + Math.floor(minutesUntil));
      nextSpawn.setUTCSeconds(0);
      nextSpawn.setUTCMilliseconds(0);
      return { nextSpawn, minutesUntil };
    }
  }

  // All spawns in current cycle have passed, get first spawn of next cycle
  const firstSpawn = sortedSpawns[0];
  const minutesUntil = (120 - cycleMinutes) + firstSpawn;
  const nextSpawn = new Date(now);
  nextSpawn.setUTCMinutes(currentMinutes + Math.floor(minutesUntil));
  nextSpawn.setUTCSeconds(0);
  nextSpawn.setUTCMilliseconds(0);

  return { nextSpawn, minutesUntil };
}

/**
 * Get time until daily reset (UTC midnight)
 */
export function getTimeUntilDailyReset(): { hours: number; minutes: number; seconds: number } {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCHours(24, 0, 0, 0);

  const diff = tomorrow.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { hours, minutes, seconds };
}
