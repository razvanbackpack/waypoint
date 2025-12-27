export interface GameEvent {
  id: string;
  name: string;
  map: string;
  category: 'core' | 'hot' | 'pof' | 'ibs' | 'eod' | 'soto' | 'jw' | 'voe';
  type: 'boss' | 'meta';
  spawnMinutes: number[];
  cycleMinutes?: number; // Cycle length in minutes (default 120)
  icon: string;
  waypoint?: string;
  difficulty: 'open' | 'group' | 'squad';
  duration: number;
}

export interface NextSpawn {
  nextSpawn: Date;
  minutesUntil: number;
  isActive?: boolean;
}

export const GAME_EVENTS: GameEvent[] = [
  // Core Tyria World Bosses (15 min duration each, on a rotating schedule)
  // These spawn at specific times within a 2-hour window
  {
    id: 'taidha',
    name: 'Admiral Taidha Covington',
    map: 'Bloodtide Coast',
    category: 'core',
    type: 'boss',
    spawnMinutes: [0],
    icon: '🏴‍☠️',
    waypoint: '[&BKoBAAA=]',
    difficulty: 'open',
    duration: 15
  },
  {
    id: 'svanir',
    name: 'Svanir Shaman Chief',
    map: 'Wayfarer Foothills',
    category: 'core',
    type: 'boss',
    spawnMinutes: [15],
    icon: '❄️',
    waypoint: '[&BMMAAAA=]',
    difficulty: 'open',
    duration: 15
  },
  {
    id: 'megadestroyer',
    name: 'Megadestroyer',
    map: 'Mount Maelstrom',
    category: 'core',
    type: 'boss',
    spawnMinutes: [30],
    icon: '🌋',
    waypoint: '[&BNABAAA=]',
    difficulty: 'group',
    duration: 15
  },
  {
    id: 'fire_elemental',
    name: 'Fire Elemental',
    map: 'Metrica Province',
    category: 'core',
    type: 'boss',
    spawnMinutes: [45],
    icon: '🔥',
    waypoint: '[&BE4AAAA=]',
    difficulty: 'open',
    duration: 15
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
    id: 'jungle_wurm',
    name: 'Great Jungle Wurm',
    map: 'Caledon Forest',
    category: 'core',
    type: 'boss',
    spawnMinutes: [75],
    icon: '🐍',
    waypoint: '[&BEYAAAA=]',
    difficulty: 'open',
    duration: 15
  },
  {
    id: 'modniir',
    name: 'Modniir Ulgoth',
    map: 'Harathi Hinterlands',
    category: 'core',
    type: 'boss',
    spawnMinutes: [90],
    icon: '⚔️',
    waypoint: '[&BPcBAAA=]',
    difficulty: 'open',
    duration: 15
  },
  {
    id: 'shadow_behemoth',
    name: 'Shadow Behemoth',
    map: 'Queensdale',
    category: 'core',
    type: 'boss',
    spawnMinutes: [105],
    icon: '👹',
    waypoint: '[&BKgBAAA=]',
    difficulty: 'open',
    duration: 15
  },
  // Hard Core Bosses (less frequent)
  {
    id: 'tequatl',
    name: 'Tequatl the Sunless',
    map: 'Sparkfly Fen',
    category: 'core',
    type: 'boss',
    spawnMinutes: [0],
    cycleMinutes: 1440, // Once per day at reset
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
    spawnMinutes: [120],
    cycleMinutes: 1440,
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
    spawnMinutes: [120],
    icon: '🦀',
    waypoint: '[&BN4CAAA=]',
    difficulty: 'group',
    duration: 15
  },
  {
    id: 'claw_jormag',
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
    id: 'golem_mark_ii',
    name: 'Golem Mark II',
    map: 'Mount Maelstrom',
    category: 'core',
    type: 'boss',
    spawnMinutes: [0],
    icon: '🤖',
    waypoint: '[&BM0BAAA=]',
    difficulty: 'open',
    duration: 15
  },

  // Heart of Thorns Metas
  {
    id: 'verdant_brink_night',
    name: 'Verdant Brink (Night Bosses)',
    map: 'Verdant Brink',
    category: 'hot',
    type: 'meta',
    spawnMinutes: [105],
    icon: '🌙',
    waypoint: '[&BOAHAAA=]',
    difficulty: 'group',
    duration: 20
  },
  {
    id: 'auric_basin',
    name: 'Octovine',
    map: 'Auric Basin',
    category: 'hot',
    type: 'meta',
    spawnMinutes: [90],
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
    spawnMinutes: [100],
    icon: '🐛',
    waypoint: '[&BPQHAAA=]',
    difficulty: 'squad',
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
    duration: 120
  },

  // Path of Fire Metas
  {
    id: 'casino_blitz',
    name: 'Casino Blitz',
    map: 'Crystal Oasis',
    category: 'pof',
    type: 'meta',
    spawnMinutes: [95],
    icon: '🎰',
    waypoint: '[&BLsKAAA=]',
    difficulty: 'open',
    duration: 16
  },
  {
    id: 'pinata',
    name: 'Pinata / Buried Treasure',
    map: 'Crystal Oasis',
    category: 'pof',
    type: 'meta',
    spawnMinutes: [111],
    icon: '🎁',
    waypoint: '[&BKkKAAA=]',
    difficulty: 'open',
    duration: 9
  },
  {
    id: 'doppelganger',
    name: 'Doppelganger',
    map: 'Elon Riverlands',
    category: 'pof',
    type: 'meta',
    spawnMinutes: [85],
    icon: '👥',
    waypoint: '[&BAkLAAA=]',
    difficulty: 'open',
    duration: 20
  },
  {
    id: 'junundu',
    name: 'Junundu Rising',
    map: 'The Desolation',
    category: 'pof',
    type: 'meta',
    spawnMinutes: [30],
    icon: '🪱',
    waypoint: '[&BKMLAAA=]',
    difficulty: 'open',
    duration: 20
  },
  {
    id: 'maws_of_torment',
    name: 'Maws of Torment',
    map: 'The Desolation',
    category: 'pof',
    type: 'meta',
    spawnMinutes: [0],
    icon: '😈',
    waypoint: '[&BMEKAAA=]',
    difficulty: 'open',
    duration: 20
  },
  {
    id: 'serpents_ire',
    name: "Serpents' Ire",
    map: 'Domain of Vabbi',
    category: 'pof',
    type: 'meta',
    spawnMinutes: [30],
    icon: '🐍',
    waypoint: '[&BHQKAAA=]',
    difficulty: 'group',
    duration: 30
  },

  // Icebrood Saga Metas
  {
    id: 'grothmar_effigy',
    name: 'Effigy',
    map: 'Grothmar Valley',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [10],
    icon: '🔥',
    waypoint: '[&BA4MAAA=]',
    difficulty: 'open',
    duration: 15
  },
  {
    id: 'grothmar_doomlore',
    name: 'Doomlore Shrine',
    map: 'Grothmar Valley',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [38],
    icon: '⚔️',
    waypoint: '[&BA4MAAA=]',
    difficulty: 'open',
    duration: 22
  },
  {
    id: 'grothmar_ooze',
    name: 'Ooze Pit',
    map: 'Grothmar Valley',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [60],
    icon: '🟢',
    waypoint: '[&BA4MAAA=]',
    difficulty: 'open',
    duration: 20
  },
  {
    id: 'grothmar_concert',
    name: 'Metal Concert',
    map: 'Grothmar Valley',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [95],
    icon: '🎸',
    waypoint: '[&BA4MAAA=]',
    difficulty: 'open',
    duration: 15
  },
  {
    id: 'bjora_drakkar',
    name: 'Drakkar',
    map: 'Bjora Marches',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [55],
    icon: '🐉',
    waypoint: '[&BDkMAAA=]',
    difficulty: 'squad',
    duration: 35
  },
  {
    id: 'bjora_storms',
    name: 'Storms of Winter',
    map: 'Bjora Marches',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [100],
    icon: '❄️',
    waypoint: '[&BCcMAAA=]',
    difficulty: 'group',
    duration: 15
  },
  {
    id: 'drizzlewood',
    name: 'Drizzlewood Coast',
    map: 'Drizzlewood Coast',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [0, 60],
    icon: '⚔️',
    waypoint: '[&BKIMAAA=]',
    difficulty: 'group',
    duration: 60
  },
  {
    id: 'dragonstorm',
    name: 'Dragonstorm',
    map: 'Eye of the North',
    category: 'ibs',
    type: 'meta',
    spawnMinutes: [60],
    icon: '🌪️',
    waypoint: '[&BAkMAAA=]',
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
    spawnMinutes: [0],
    icon: '⚔️',
    waypoint: '[&BGANAAA=]',
    difficulty: 'group',
    duration: 30
  },
  {
    id: 'kaineng',
    name: 'Kaineng Blackout',
    map: 'New Kaineng City',
    category: 'eod',
    type: 'meta',
    spawnMinutes: [0],
    icon: '🌃',
    waypoint: '[&BFQNAAA=]',
    difficulty: 'group',
    duration: 40
  },
  {
    id: 'echovald_gang',
    name: 'Gang War',
    map: 'The Echovald Wilds',
    category: 'eod',
    type: 'meta',
    spawnMinutes: [30],
    icon: '🌲',
    waypoint: '[&BPwNAAA=]',
    difficulty: 'group',
    duration: 35
  },
  {
    id: 'echovald_aspenwood',
    name: 'Aspenwood',
    map: 'The Echovald Wilds',
    category: 'eod',
    type: 'meta',
    spawnMinutes: [105],
    icon: '🏰',
    waypoint: '[&BPwNAAA=]',
    difficulty: 'group',
    duration: 15
  },
  {
    id: 'dragons_end_meta',
    name: "Dragon's End",
    map: "Dragon's End",
    category: 'eod',
    type: 'meta',
    spawnMinutes: [113],
    icon: '🐲',
    waypoint: '[&BGINAAA=]',
    difficulty: 'squad',
    duration: 60
  },

  // Secrets of the Obscure Metas
  {
    id: 'skywatch',
    name: 'Unlocking the Wizard Tower',
    map: 'Skywatch Archipelago',
    category: 'soto',
    type: 'meta',
    spawnMinutes: [60],
    icon: '🏝️',
    waypoint: '[&BKQOAAA=]',
    difficulty: 'open',
    duration: 25
  },
  {
    id: 'amnytas',
    name: 'Defense of Amnytas',
    map: 'Amnytas',
    category: 'soto',
    type: 'meta',
    spawnMinutes: [0],
    icon: '🛡️',
    waypoint: '[&BLcOAAA=]',
    difficulty: 'group',
    duration: 25
  },
  {
    id: 'convergence',
    name: 'Convergences',
    map: "Wizard's Tower",
    category: 'soto',
    type: 'meta',
    spawnMinutes: [30],
    icon: '🌀',
    waypoint: '[&BB4OAAA=]',
    difficulty: 'squad',
    duration: 15
  },

  // Janthir Wilds Metas
  {
    id: 'mists_monsters',
    name: 'Of Mists and Monsters',
    map: 'Janthir Syntri',
    category: 'jw',
    type: 'meta',
    spawnMinutes: [0],
    icon: '🌀',
    waypoint: '[&BDcPAAA=]',
    difficulty: 'squad',
    duration: 25
  },
  {
    id: 'titanic_voyage',
    name: 'A Titanic Voyage',
    map: 'Bava Nisos',
    category: 'jw',
    type: 'meta',
    spawnMinutes: [0],
    icon: '🚢',
    waypoint: '[&BEAPAAA=]',
    difficulty: 'group',
    duration: 25
  },

  // Visions of Eternity Metas
  {
    id: 'hammerhart_rumble',
    name: 'Hammerhart Rumble!',
    map: 'Shipwreck Strand',
    category: 'voe',
    type: 'meta',
    spawnMinutes: [0],
    icon: '⚓',
    waypoint: '[&BFYPAAA=]',
    difficulty: 'group',
    duration: 20
  },
  {
    id: 'secrets_weald',
    name: 'Secrets of the Weald',
    map: 'Starlit Weald',
    category: 'voe',
    type: 'meta',
    spawnMinutes: [0],
    icon: '🌲',
    waypoint: '[&BGAPAAA=]',
    difficulty: 'squad',
    duration: 35
  },
];

/**
 * Calculate the next spawn time for an event based on its spawn minutes in a cycle
 * @param spawnMinutes Array of minutes within a cycle when the event spawns
 * @param duration Duration of the event in minutes (default: 15)
 * @param cycleLength Length of the cycle in minutes (default: 120)
 * @returns Object containing the next spawn Date, minutes until spawn, and active status
 */
export function getNextSpawn(spawnMinutes: number[], duration: number = 15, cycleLength: number = 120): NextSpawn {
  const now = new Date();
  const currentHours = now.getUTCHours();
  const currentMinutes = now.getUTCMinutes();
  const currentSeconds = now.getUTCSeconds();

  // Total minutes since midnight UTC
  const totalCurrentMinutes = currentHours * 60 + currentMinutes + currentSeconds / 60;

  // Position within current cycle
  const cycleMinutes = totalCurrentMinutes % cycleLength;

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
  const minutesSinceLastCycleSpawn = cycleMinutes + (cycleLength - lastSpawn);
  if (minutesSinceLastCycleSpawn < duration) {
    const spawnTime = new Date(now);
    spawnTime.setUTCMinutes(currentMinutes - Math.floor(minutesSinceLastCycleSpawn));
    spawnTime.setUTCSeconds(0);
    spawnTime.setUTCMilliseconds(0);
    return { nextSpawn: spawnTime, minutesUntil: -minutesSinceLastCycleSpawn, isActive: true };
  }

  // Find the next spawn in current cycle
  for (const spawnMin of sortedSpawns) {
    if (spawnMin >= cycleMinutes) {
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
  const minutesUntil = (cycleLength - cycleMinutes) + firstSpawn;
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
