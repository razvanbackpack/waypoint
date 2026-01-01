export interface GameEvent {
  id: string;
  name: string;
  map: string;
  category: 'core' | 'hot' | 'pof' | 'lws2' | 'lws3' | 'lws4' | 'ibs' | 'eod' | 'soto' | 'jw' | 'voe';
  type: 'boss' | 'meta' | 'invasion';
  schedule:
    | { type: 'cycle'; cycleMinutes: number; offsetMinutes: number }
    | { type: 'fixed'; timesUTC: string[] };
  icon: string;
  waypoint?: string;
  locations?: Array<{ name: string; waypoint: string }>;
  difficulty: 'open' | 'group' | 'squad';
  duration: number;
  reward?: string; // e.g., "2g + rare", "exotic chance", "guaranteed exotic"
}

export interface NextSpawn {
  nextSpawn: Date;
  minutesUntil: number;
  isActive?: boolean;
}

export const GAME_EVENTS: GameEvent[] = [
  // Core Tyria World Bosses - 6-hour (360-min) rotating schedule based on wiki pattern:
  // r1:15 -> r2:15 -> r3:15 -> r4:15 -> r5:15 -> r6:15 -> r7:15 -> r8:15 -> r10:15 -> r2:15 -> r9:15 -> r4:15 ->
  // r1:15 -> r6:15 -> r3:15 -> r8:15 -> r5:15 -> r2:15 -> r7:15 -> r4:15 -> r10:15 -> r6:15 -> r9:15 -> r8:15
  // 1=Taidha, 2=Svanir, 3=Mega, 4=Fire, 5=Shatterer, 6=Wurm, 7=Modniir, 8=Behemoth, 9=Jormag, 10=Golem
  {
    id: 'taidha',
    name: 'Admiral Taidha Covington',
    map: 'Bloodtide Coast',
    category: 'core',
    type: 'boss',
    schedule: { type: 'fixed', timesUTC: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'] },
    icon: '',
    waypoint: '[&BKgBAAA=]',
    difficulty: 'open',
    duration: 15,
    reward: '2g + rare'
  },
  {
    id: 'svanir',
    name: 'Svanir Shaman Chief',
    map: 'Wayfarer Foothills',
    category: 'core',
    type: 'boss',
    schedule: { type: 'fixed', timesUTC: ['00:15', '02:15', '04:15', '06:15', '08:15', '10:15', '12:15', '14:15', '16:15', '18:15', '20:15', '22:15'] },
    icon: '',
    waypoint: '[&BMIDAAA=]',
    difficulty: 'open',
    duration: 15,
    reward: '2g + rare'
  },
  {
    id: 'megadestroyer',
    name: 'Megadestroyer',
    map: 'Mount Maelstrom',
    category: 'core',
    type: 'boss',
    schedule: { type: 'fixed', timesUTC: ['00:30', '03:30', '06:30', '09:30', '12:30', '15:30', '18:30', '21:30'] },
    icon: '',
    waypoint: '[&BM0CAAA=]',
    difficulty: 'group',
    duration: 15,
    reward: '2g + rare'
  },
  {
    id: 'fire_elemental',
    name: 'Fire Elemental',
    map: 'Metrica Province',
    category: 'core',
    type: 'boss',
    schedule: { type: 'fixed', timesUTC: ['00:45', '02:45', '04:45', '06:45', '08:45', '10:45', '12:45', '14:45', '16:45', '18:45', '20:45', '22:45'] },
    icon: '',
    waypoint: '[&BEcAAAA=]',
    difficulty: 'open',
    duration: 15,
    reward: '2g + rare'
  },
  {
    id: 'shatterer',
    name: 'The Shatterer',
    map: 'Blazeridge Steppes',
    category: 'core',
    type: 'boss',
    schedule: { type: 'fixed', timesUTC: ['01:00', '04:00', '07:00', '10:00', '13:00', '16:00', '19:00', '22:00'] },
    icon: '',
    waypoint: '[&BE4DAAA=]',
    difficulty: 'group',
    duration: 15,
    reward: '2g + rare'
  },
  {
    id: 'jungle_wurm',
    name: 'Great Jungle Wurm',
    map: 'Caledon Forest',
    category: 'core',
    type: 'boss',
    schedule: { type: 'fixed', timesUTC: ['01:15', '03:15', '05:15', '07:15', '09:15', '11:15', '13:15', '15:15', '17:15', '19:15', '21:15', '23:15'] },
    icon: '',
    waypoint: '[&BEEFAAA=]',
    difficulty: 'open',
    duration: 15,
    reward: '2g + rare'
  },
  {
    id: 'modniir',
    name: 'Modniir Ulgoth',
    map: 'Harathi Hinterlands',
    category: 'core',
    type: 'boss',
    schedule: { type: 'fixed', timesUTC: ['01:30', '04:30', '07:30', '10:30', '13:30', '16:30', '19:30', '22:30'] },
    icon: '',
    waypoint: '[&BLAAAAA=]',
    difficulty: 'open',
    duration: 15,
    reward: '2g + rare'
  },
  {
    id: 'shadow_behemoth',
    name: 'Shadow Behemoth',
    map: 'Queensdale',
    category: 'core',
    type: 'boss',
    schedule: { type: 'fixed', timesUTC: ['01:45', '03:45', '05:45', '07:45', '09:45', '11:45', '13:45', '15:45', '17:45', '19:45', '21:45', '23:45'] },
    icon: '',
    waypoint: '[&BPcAAAA=]',
    difficulty: 'open',
    duration: 15,
    reward: '2g + rare'
  },
  {
    id: 'golem_mark_ii',
    name: 'Golem Mark II',
    map: 'Mount Maelstrom',
    category: 'core',
    type: 'boss',
    schedule: { type: 'fixed', timesUTC: ['02:00', '05:00', '08:00', '11:00', '14:00', '17:00', '20:00', '23:00'] },
    icon: '',
    waypoint: '[&BNQCAAA=]',
    difficulty: 'open',
    duration: 15,
    reward: '2g + rare'
  },
  {
    id: 'claw_jormag',
    name: 'Claw of Jormag',
    map: 'Frostgorge Sound',
    category: 'core',
    type: 'boss',
    schedule: { type: 'fixed', timesUTC: ['02:30', '05:30', '08:30', '11:30', '14:30', '17:30', '20:30', '23:30'] },
    icon: '',
    waypoint: '[&BHoCAAA=]',
    difficulty: 'group',
    duration: 15,
    reward: '2g + rare'
  },

  // Irregular hardcore bosses
  {
    id: 'tequatl',
    name: 'Tequatl the Sunless',
    map: 'Sparkfly Fen',
    category: 'core',
    type: 'boss',
    schedule: { type: 'fixed', timesUTC: ['00:00', '03:00', '07:00', '11:30', '16:00', '19:00'] },
    icon: '',
    waypoint: '[&BNABAAA=]',
    difficulty: 'squad',
    duration: 15,
    reward: '2g + rare'
  },
  {
    id: 'triple_trouble',
    name: 'Triple Trouble',
    map: 'Bloodtide Coast',
    category: 'core',
    type: 'boss',
    schedule: { type: 'fixed', timesUTC: ['01:00', '04:00', '08:00', '12:30', '17:00', '20:00'] },
    icon: '',
    waypoint: '[&BKoBAAA=]',
    difficulty: 'squad',
    duration: 15,
    reward: '2g + rare'
  },
  {
    id: 'karka_queen',
    name: 'Karka Queen',
    map: 'Southsun Cove',
    category: 'core',
    type: 'boss',
    schedule: { type: 'fixed', timesUTC: ['02:00', '06:00', '10:30', '15:00', '18:00', '23:00'] },
    icon: '',
    waypoint: '[&BNUGAAA=]',
    difficulty: 'group',
    duration: 15,
    reward: '2g + rare'
  },

  // Ley-Line Anomaly (6-hour cycle: @100 Timberline, @220 Iron Marches, @340 Gendarran)
  {
    id: 'ley_line_anomaly',
    name: 'Ley-Line Anomaly',
    map: 'Timberline Falls / Iron Marches / Gendarran Fields',
    category: 'core',
    type: 'boss',
    schedule: { type: 'cycle', cycleMinutes: 360, offsetMinutes: 100 },
    icon: '',
    waypoint: '[&BEwCAAA=]',
    difficulty: 'group',
    duration: 20,
    reward: '2g + rare'
  },

  // Invasions (120-min cycle from wiki)
  // Awakened Invasion: @0 and @60 (15m duration)
  // Scarlet's Minions: @30 (15m duration)
  {
    id: 'awakened_invasion_1',
    name: 'Awakened Invasion',
    map: 'Various Core Maps',
    category: 'core',
    type: 'invasion',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    locations: [
      { name: 'Queensdale', waypoint: '[&BPoAAAA=]' },
      { name: 'Kessex Hills', waypoint: '[&BBABAAA=]' },
      { name: 'Gendarran Fields', waypoint: '[&BOQAAAA=]' },
      { name: 'Harathi Hinterlands', waypoint: '[&BLAAAAA=]' },
      { name: 'Blazeridge Steppes', waypoint: '[&BFMBAAA=]' },
      { name: 'Iron Marches', waypoint: '[&BOcBAAA=]' },
    ],
    difficulty: 'group',
    duration: 15,
    reward: 'bags + karma'
  },
  {
    id: 'awakened_invasion_2',
    name: 'Awakened Invasion',
    map: 'Various Core Maps',
    category: 'core',
    type: 'invasion',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 60 },
    icon: '',
    locations: [
      { name: 'Queensdale', waypoint: '[&BPoAAAA=]' },
      { name: 'Kessex Hills', waypoint: '[&BBABAAA=]' },
      { name: 'Gendarran Fields', waypoint: '[&BOQAAAA=]' },
      { name: 'Harathi Hinterlands', waypoint: '[&BLAAAAA=]' },
      { name: 'Blazeridge Steppes', waypoint: '[&BFMBAAA=]' },
      { name: 'Iron Marches', waypoint: '[&BOcBAAA=]' },
    ],
    difficulty: 'group',
    duration: 15,
    reward: 'bags + karma'
  },
  {
    id: 'scarlets_minions',
    name: "Scarlet's Minions",
    map: 'Various Core Maps',
    category: 'core',
    type: 'invasion',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 30 },
    icon: '',
    locations: [
      { name: 'Queensdale', waypoint: '[&BPoAAAA=]' },
      { name: 'Kessex Hills', waypoint: '[&BBABAAA=]' },
      { name: 'Gendarran Fields', waypoint: '[&BOQAAAA=]' },
      { name: 'Harathi Hinterlands', waypoint: '[&BLAAAAA=]' },
      { name: 'Blazeridge Steppes', waypoint: '[&BFMBAAA=]' },
      { name: 'Iron Marches', waypoint: '[&BOcBAAA=]' },
    ],
    difficulty: 'group',
    duration: 15,
    reward: 'bags + karma'
  },

  // Fractal Incursions (240-min cycle from wiki)
  // Kessex Hills @0, Diessa Plateau @60, Brisban Wildlands @120, Snowden Drifts @180
  {
    id: 'fractal_kessex',
    name: 'Fractal Incursion',
    map: 'Kessex Hills',
    category: 'core',
    type: 'invasion',
    schedule: { type: 'cycle', cycleMinutes: 240, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BLoAAAA=]',
    difficulty: 'group',
    duration: 15,
    reward: 'bags + karma'
  },
  {
    id: 'fractal_diessa',
    name: 'Fractal Incursion',
    map: 'Diessa Plateau',
    category: 'core',
    type: 'invasion',
    schedule: { type: 'cycle', cycleMinutes: 240, offsetMinutes: 60 },
    icon: '',
    waypoint: '[&BPoBAAA=]',
    difficulty: 'group',
    duration: 15,
    reward: 'bags + karma'
  },
  {
    id: 'fractal_brisban',
    name: 'Fractal Incursion',
    map: 'Brisban Wildlands',
    category: 'core',
    type: 'invasion',
    schedule: { type: 'cycle', cycleMinutes: 240, offsetMinutes: 120 },
    icon: '',
    waypoint: '[&BGMAAAA=]',
    difficulty: 'group',
    duration: 15,
    reward: 'bags + karma'
  },
  {
    id: 'fractal_snowden',
    name: 'Fractal Incursion',
    map: 'Snowden Drifts',
    category: 'core',
    type: 'invasion',
    schedule: { type: 'cycle', cycleMinutes: 240, offsetMinutes: 180 },
    icon: '',
    waypoint: '[&BLcAAAA=]',
    difficulty: 'group',
    duration: 15,
    reward: 'bags + karma'
  },

  // Heart of Thorns Metas (2-hour cycles based on wiki)
  // VB: Day 75m -> Night 25m -> Night Bosses 20m (Night Bosses start at minute 100)
  // AB: Pylons 75m -> Challenges 15m -> Octovine 20m -> Reset 10m (Octovine at 90)
  // TD: Outposts 95m -> Prep 5m -> Gerent 20m (Gerent at 100)
  // DS: Starts at minute 0, runs 120m continuous
  {
    id: 'verdant_brink_night',
    name: 'Verdant Brink (Night Bosses)',
    map: 'Verdant Brink',
    category: 'hot',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 100 },
    icon: '',
    waypoint: '[&BAgIAAA=]',
    difficulty: 'group',
    duration: 20,
    reward: 'exotic chance + map currency'
  },
  {
    id: 'auric_basin_challenges',
    name: 'Auric Basin Challenges',
    map: 'Auric Basin',
    category: 'hot',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 75 },
    icon: '',
    waypoint: '[&BGwIAAA=]',
    difficulty: 'group',
    duration: 15,
    reward: 'exotic chance + map currency'
  },
  {
    id: 'auric_basin',
    name: 'Octovine',
    map: 'Auric Basin',
    category: 'hot',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 90 },
    icon: '',
    waypoint: '[&BAIIAAA=]',
    difficulty: 'group',
    duration: 20,
    reward: 'exotic chance + map currency'
  },
  {
    id: 'tangled_depths',
    name: 'Chak Gerent',
    map: 'Tangled Depths',
    category: 'hot',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 100 },
    icon: '',
    waypoint: '[&BPUHAAA=]',
    difficulty: 'squad',
    duration: 20,
    reward: 'exotic chance + map currency'
  },
  {
    id: 'dragons_stand',
    name: "Dragon's Stand",
    map: "Dragon's Stand",
    category: 'hot',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BBAIAAA=]',
    difficulty: 'squad',
    duration: 120,
    reward: 'exotic chance + map currency'
  },

  // Living World Season 2 Metas
  {
    id: 'dry_top_sandstorm',
    name: 'Sandstorm',
    map: 'Dry Top',
    category: 'lws2',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 60, offsetMinutes: 40 },
    icon: '',
    waypoint: '[&BIAHAAA=]',
    difficulty: 'open',
    duration: 20,
    reward: 'exotic chance + currency'
  },

  // Living World Season 3 Metas
  // Lake Doric (120-min cycle with 3 rotating locations)
  {
    id: 'lake_doric_norans',
    name: "Noran's Homestead",
    map: 'Lake Doric',
    category: 'lws3',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BK8JAAA=]',
    difficulty: 'group',
    duration: 30,
    reward: 'exotic chance + currency'
  },
  {
    id: 'lake_doric_saidras',
    name: "Saidra's Haven",
    map: 'Lake Doric',
    category: 'lws3',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 30 },
    icon: '',
    waypoint: '[&BK0JAAA=]',
    difficulty: 'group',
    duration: 45,
    reward: 'exotic chance + currency'
  },
  {
    id: 'lake_doric_loamhurst',
    name: 'New Loamhurst',
    map: 'Lake Doric',
    category: 'lws3',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 75 },
    icon: '',
    waypoint: '[&BLQJAAA=]',
    difficulty: 'group',
    duration: 45,
    reward: 'exotic chance + currency'
  },

  // Living World Season 4 Metas
  {
    id: 'palawadan',
    name: 'Palawadan',
    map: 'Domain of Istan',
    category: 'lws4',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 90 },
    icon: '',
    waypoint: '[&BAkLAAA=]',
    difficulty: 'group',
    duration: 30,
    reward: 'exotic chance + currency'
  },
  {
    id: 'jahai_escorts',
    name: 'Jahai Bluffs Escorts',
    map: 'Jahai Bluffs',
    category: 'lws4',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 90 },
    icon: '',
    waypoint: '[&BIMLAAA=]',
    difficulty: 'group',
    duration: 15,
    reward: 'exotic chance + currency'
  },
  {
    id: 'death_branded_shatterer',
    name: 'Death-Branded Shatterer',
    map: 'Jahai Bluffs',
    category: 'lws4',
    type: 'boss',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 105 },
    icon: '',
    waypoint: '[&BJMLAAA=]',
    difficulty: 'group',
    duration: 15,
    reward: 'exotic chance + currency'
  },
  {
    id: 'thunderhead_keep',
    name: 'Thunderhead Keep',
    map: 'Thunderhead Peaks',
    category: 'lws4',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 45 },
    icon: '',
    waypoint: '[&BLsLAAA=]',
    difficulty: 'group',
    duration: 20,
    reward: 'exotic chance + currency'
  },
  {
    id: 'oil_floes',
    name: 'The Oil Floes',
    map: 'Thunderhead Peaks',
    category: 'lws4',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 105 },
    icon: '',
    waypoint: '[&BKYLAAA=]',
    difficulty: 'group',
    duration: 15,
    reward: 'exotic chance + currency'
  },
  // Path of Fire Metas (120-min cycles based on wiki)
  {
    id: 'casino_blitz',
    name: 'Casino Blitz',
    map: 'Crystal Oasis',
    category: 'pof',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 95 },
    icon: '',
    waypoint: '[&BLsKAAA=]',
    difficulty: 'open',
    duration: 16,
    reward: 'exotic chance + trade contracts'
  },
  {
    id: 'pinata',
    name: 'Pinata',
    map: 'Crystal Oasis',
    category: 'pof',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 111 },
    icon: '',
    waypoint: '[&BLsKAAA=]',
    difficulty: 'open',
    duration: 9,
    reward: 'exotic chance + trade contracts'
  },
  {
    id: 'buried_treasure',
    name: 'Buried Treasure',
    map: 'Desert Highlands',
    category: 'pof',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 100 },
    icon: '',
    waypoint: '[&BGsKAAA=]',
    difficulty: 'open',
    duration: 20,
    reward: 'exotic chance + trade contracts'
  },
  {
    id: 'path_ascension',
    name: 'Path to Ascension',
    map: 'Elon Riverlands',
    category: 'pof',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 75 },
    icon: '',
    waypoint: '[&BFMKAAA=]',
    difficulty: 'open',
    duration: 25,
    reward: 'exotic chance + trade contracts'
  },
  {
    id: 'doppelganger',
    name: 'Doppelganger',
    map: 'Elon Riverlands',
    category: 'pof',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 100 },
    icon: '',
    waypoint: '[&BFMKAAA=]',
    difficulty: 'open',
    duration: 20,
    reward: 'exotic chance + trade contracts'
  },
  {
    id: 'maws_of_torment',
    name: 'Maws of Torment',
    map: 'The Desolation',
    category: 'pof',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BKMKAAA=]',
    difficulty: 'open',
    duration: 20,
    reward: 'exotic chance + trade contracts'
  },
  {
    id: 'junundu_1',
    name: 'Junundu Rising',
    map: 'The Desolation',
    category: 'pof',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 30 },
    icon: '',
    waypoint: '[&BMEKAAA=]',
    difficulty: 'open',
    duration: 20,
    reward: 'exotic chance + trade contracts'
  },
  {
    id: 'junundu_2',
    name: 'Junundu Rising',
    map: 'The Desolation',
    category: 'pof',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 90 },
    icon: '',
    waypoint: '[&BMEKAAA=]',
    difficulty: 'open',
    duration: 20,
    reward: 'exotic chance + trade contracts'
  },
  {
    id: 'serpents_ire',
    name: "Serpents' Ire",
    map: 'Domain of Vabbi',
    category: 'pof',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BHQKAAA=]',
    difficulty: 'group',
    duration: 30,
    reward: 'exotic chance + trade contracts'
  },
  {
    id: 'forged_fire_1',
    name: 'Forged with Fire',
    map: 'Domain of Vabbi',
    category: 'pof',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 30 },
    icon: '',
    waypoint: '[&BO0KAAA=]',
    difficulty: 'group',
    duration: 30,
    reward: 'exotic chance + trade contracts'
  },
  {
    id: 'forged_fire_2',
    name: 'Forged with Fire',
    map: 'Domain of Vabbi',
    category: 'pof',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 90 },
    icon: '',
    waypoint: '[&BO0KAAA=]',
    difficulty: 'group',
    duration: 30,
    reward: 'exotic chance + trade contracts'
  },

  // Icebrood Saga Metas (Grothmar Valley - 120-min cycle based on wiki)
  // Effigy 0-15, Doomlore 28-50, Ooze Pits 55-75, Metal Concert 90-105
  {
    id: 'grothmar_effigy',
    name: 'Effigy',
    map: 'Grothmar Valley',
    category: 'ibs',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BA4MAAA=]',
    difficulty: 'open',
    duration: 15,
    reward: 'exotic chance + currency'
  },
  {
    id: 'grothmar_doomlore',
    name: 'Doomlore Shrine',
    map: 'Grothmar Valley',
    category: 'ibs',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 28 },
    icon: '',
    waypoint: '[&BA4MAAA=]',
    difficulty: 'open',
    duration: 22,
    reward: 'exotic chance + currency'
  },
  {
    id: 'grothmar_ooze',
    name: 'Ooze Pits',
    map: 'Grothmar Valley',
    category: 'ibs',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 55 },
    icon: '',
    waypoint: '[&BPgLAAA=]',
    difficulty: 'open',
    duration: 20,
    reward: 'exotic chance + currency'
  },
  {
    id: 'grothmar_concert',
    name: 'Metal Concert',
    map: 'Grothmar Valley',
    category: 'ibs',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 90 },
    icon: '',
    waypoint: '[&BPgLAAA=]',
    difficulty: 'open',
    duration: 15,
    reward: 'exotic chance + currency'
  },
  // Bjora Marches events based on wiki
  // Drakkar 45-80, Defend Jora's Keep 85-100, Shards/Construct 100-105, Icebrood Champions 105-120
  {
    id: 'bjora_drakkar',
    name: 'Drakkar',
    map: 'Bjora Marches',
    category: 'ibs',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 45 },
    icon: '',
    waypoint: '[&BDkMAAA=]',
    difficulty: 'squad',
    duration: 35,
    reward: 'exotic chance + currency'
  },
  {
    id: 'bjora_joras_keep',
    name: "Defend Jora's Keep",
    map: 'Bjora Marches',
    category: 'ibs',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 85 },
    icon: '',
    waypoint: '[&BCcMAAA=]',
    difficulty: 'group',
    duration: 15,
    reward: 'exotic chance + currency'
  },
  {
    id: 'bjora_shards',
    name: 'Shards and Construct',
    map: 'Bjora Marches',
    category: 'ibs',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 100 },
    icon: '',
    waypoint: '[&BCcMAAA=]',
    difficulty: 'group',
    duration: 5,
    reward: 'exotic chance + currency'
  },
  {
    id: 'bjora_champions',
    name: 'Icebrood Champions',
    map: 'Bjora Marches',
    category: 'ibs',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 105 },
    icon: '',
    waypoint: '[&BCcMAAA=]',
    difficulty: 'group',
    duration: 15,
    reward: 'exotic chance + currency'
  },
  {
    id: 'drizzlewood',
    name: 'Drizzlewood Coast',
    map: 'Drizzlewood Coast',
    category: 'ibs',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BGQMAAA=]',
    difficulty: 'group',
    duration: 60,
    reward: 'exotic chance + currency'
  },
  // Eye of the North (public-eotn) - 120-min cycle based on wiki
  // Twisted Marionette 0-20, Battle for Lion's Arch 30-45, Dragonstorm 60-80, Tower of Nightmares 90-105
  {
    id: 'twisted_marionette',
    name: 'Twisted Marionette',
    map: 'Eye of the North',
    category: 'ibs',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BAkMAAA=]',
    difficulty: 'squad',
    duration: 20,
    reward: 'exotic chance + currency'
  },
  {
    id: 'battle_lions_arch',
    name: "Battle for Lion's Arch",
    map: 'Eye of the North',
    category: 'ibs',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 30 },
    icon: '',
    waypoint: '[&BAkMAAA=]',
    difficulty: 'squad',
    duration: 15,
    reward: 'exotic chance + currency'
  },
  {
    id: 'dragonstorm',
    name: 'Dragonstorm',
    map: 'Eye of the North',
    category: 'ibs',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 60 },
    icon: '',
    waypoint: '[&BAkMAAA=]',
    difficulty: 'squad',
    duration: 20,
    reward: 'exotic chance + currency'
  },
  {
    id: 'tower_nightmares',
    name: 'Tower of Nightmares',
    map: 'Eye of the North',
    category: 'ibs',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 90 },
    icon: '',
    waypoint: '[&BAkMAAA=]',
    difficulty: 'squad',
    duration: 15,
    reward: 'exotic chance + currency'
  },

  // End of Dragons Metas (120-min cycles based on wiki)
  // Seitung: offset 0, 30 min
  // Kaineng: offset 0, 40 min
  // Echovald Gang War: offset 30, 35 min; Aspenwood: offset 100, 20 min
  // Dragon's End: Prep at 0, Battle at 60 for 60 min
  {
    id: 'seitung',
    name: 'Aetherblade Assault',
    map: 'Seitung Province',
    category: 'eod',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BGUNAAA=]',
    difficulty: 'group',
    duration: 30,
    reward: 'imperial favor + jade'
  },
  {
    id: 'kaineng',
    name: 'Kaineng Blackout',
    map: 'New Kaineng City',
    category: 'eod',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BBkNAAA=]',
    difficulty: 'group',
    duration: 40,
    reward: 'imperial favor + jade'
  },
  {
    id: 'echovald_gang',
    name: 'Gang War',
    map: 'The Echovald Wilds',
    category: 'eod',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 30 },
    icon: '',
    waypoint: '[&BMwMAAA=]',
    difficulty: 'group',
    duration: 35,
    reward: 'imperial favor + jade'
  },
  {
    id: 'echovald_aspenwood',
    name: 'Aspenwood',
    map: 'The Echovald Wilds',
    category: 'eod',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 100 },
    icon: '',
    waypoint: '[&BPkMAAA=]',
    difficulty: 'group',
    duration: 20,
    reward: 'imperial favor + jade'
  },
  {
    id: 'dragons_end_meta',
    name: "Dragon's End",
    map: "Dragon's End",
    category: 'eod',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BKIMAAA=]',
    difficulty: 'squad',
    duration: 120,
    reward: 'imperial favor + jade'
  },

  // Secrets of the Obscure Metas (120-min cycles based on wiki)
  // Skywatch: offset 0, 25 min; Amnytas: offset 0, 25 min
  // Wizard's Tower: Target Practice 0-40, Combined 40-55, Fly by Night 55-80
  // Convergence (180-min cycle): Mount Balrior 0, Outer Nayos 90
  {
    id: 'skywatch',
    name: 'Unlocking the Wizard Tower',
    map: 'Skywatch Archipelago',
    category: 'soto',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BL4NAAA=]',
    difficulty: 'open',
    duration: 25,
    reward: 'rift currency + exotic chance'
  },
  {
    id: 'amnytas',
    name: 'Defense of Amnytas',
    map: 'Amnytas',
    category: 'soto',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BDQOAAA=]',
    difficulty: 'group',
    duration: 25,
    reward: 'rift currency + exotic chance'
  },
  {
    id: 'target_practice',
    name: 'Target Practice',
    map: "Wizard's Tower",
    category: 'soto',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BB4OAAA=]',
    difficulty: 'open',
    duration: 40,
    reward: 'rift currency + exotic chance'
  },
  {
    id: 'wizard_combined',
    name: 'Combined Training',
    map: "Wizard's Tower",
    category: 'soto',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 40 },
    icon: '',
    waypoint: '[&BB4OAAA=]',
    difficulty: 'open',
    duration: 15,
    reward: 'rift currency + exotic chance'
  },
  {
    id: 'fly_by_night',
    name: 'Fly by Night',
    map: "Wizard's Tower",
    category: 'soto',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 55 },
    icon: '',
    waypoint: '[&BB4OAAA=]',
    difficulty: 'open',
    duration: 25,
    reward: 'rift currency + exotic chance'
  },
  {
    id: 'convergence_balrior',
    name: 'Convergences: Mount Balrior',
    map: 'Convergences',
    category: 'soto',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 180, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BK4OAAA=]',
    difficulty: 'squad',
    duration: 10,
    reward: 'rift currency + exotic chance'
  },
  {
    id: 'convergence_nayos',
    name: 'Convergences: Outer Nayos',
    map: 'Convergences',
    category: 'soto',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 180, offsetMinutes: 90 },
    icon: '',
    waypoint: '[&BB4OAAA=]',
    difficulty: 'squad',
    duration: 10,
    reward: 'rift currency + exotic chance'
  },
  // Janthir Wilds Metas
  {
    id: 'mists_monsters',
    name: 'Of Mists and Monsters',
    map: 'Janthir Syntri',
    category: 'jw',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BCoPAAA=]',
    difficulty: 'squad',
    duration: 25,
    reward: 'rift currency + exotic chance'
  },
  {
    id: 'titanic_voyage',
    name: 'A Titanic Voyage',
    map: 'Bava Nisos',
    category: 'jw',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BGEPAAA=]',
    difficulty: 'group',
    duration: 25,
    reward: 'rift currency + exotic chance'
  },

  // Visions of Eternity Metas
  {
    id: 'hammerhart_rumble',
    name: 'Hammerhart Rumble!',
    map: 'Shipwreck Strand',
    category: 'voe',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BJEPAAA=]',
    difficulty: 'group',
    duration: 20,
    reward: 'rift currency + exotic chance'
  },
  {
    id: 'secrets_weald',
    name: 'Secrets of the Weald',
    map: 'Starlit Weald',
    category: 'voe',
    type: 'meta',
    schedule: { type: 'cycle', cycleMinutes: 120, offsetMinutes: 0 },
    icon: '',
    waypoint: '[&BJ4PAAA=]',
    difficulty: 'squad',
    duration: 35,
    reward: 'rift currency + exotic chance'
  },
];

/**
 * Calculate the next spawn time for an event based on its schedule configuration
 * @param event The game event with its schedule configuration
 * @returns Object containing the next spawn Date, minutes until spawn, and active status
 */
export function getNextSpawn(event: GameEvent): NextSpawn {
  const now = new Date();

  if (event.schedule.type === 'cycle') {
    // Handle repeating cycle (e.g., every 2 hours at offset 45)
    const { cycleMinutes, offsetMinutes } = event.schedule;
    const totalMinutesToday = now.getUTCHours() * 60 + now.getUTCMinutes();
    const cyclePosition = totalMinutesToday % cycleMinutes;

    // Check if currently active
    if (cyclePosition >= offsetMinutes && cyclePosition < offsetMinutes + event.duration) {
      const minutesSinceSpawn = cyclePosition - offsetMinutes;
      return { nextSpawn: new Date(now.getTime() - minutesSinceSpawn * 60000), minutesUntil: -minutesSinceSpawn, isActive: true };
    }

    // Find next spawn
    let minutesUntil: number;
    if (cyclePosition < offsetMinutes) {
      minutesUntil = offsetMinutes - cyclePosition;
    } else {
      minutesUntil = cycleMinutes - cyclePosition + offsetMinutes;
    }

    const nextSpawn = new Date(now.getTime() + minutesUntil * 60000);
    nextSpawn.setUTCSeconds(0, 0);
    return { nextSpawn, minutesUntil };

  } else {
    // Handle fixed times (e.g., ["00:00", "03:00", "07:00"])
    const { timesUTC } = event.schedule;
    const currentTime = now.getUTCHours() * 60 + now.getUTCMinutes();

    // Parse all times to minutes
    const spawnTimes = timesUTC.map(t => {
      const [h, m] = t.split(':').map(Number);
      return h * 60 + m;
    }).sort((a, b) => a - b);

    // Check if currently active
    for (const spawnTime of spawnTimes) {
      if (currentTime >= spawnTime && currentTime < spawnTime + event.duration) {
        const minutesSinceSpawn = currentTime - spawnTime;
        return { nextSpawn: new Date(now.getTime() - minutesSinceSpawn * 60000), minutesUntil: -minutesSinceSpawn, isActive: true };
      }
    }

    // Find next spawn today
    for (const spawnTime of spawnTimes) {
      if (spawnTime > currentTime) {
        const minutesUntil = spawnTime - currentTime;
        const nextSpawn = new Date(now);
        nextSpawn.setUTCHours(Math.floor(spawnTime / 60), spawnTime % 60, 0, 0);
        return { nextSpawn, minutesUntil };
      }
    }

    // Next spawn is tomorrow (first time)
    const firstSpawn = spawnTimes[0];
    const minutesUntil = (24 * 60 - currentTime) + firstSpawn;
    const nextSpawn = new Date(now);
    nextSpawn.setUTCDate(nextSpawn.getUTCDate() + 1);
    nextSpawn.setUTCHours(Math.floor(firstSpawn / 60), firstSpawn % 60, 0, 0);
    return { nextSpawn, minutesUntil };
  }
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
