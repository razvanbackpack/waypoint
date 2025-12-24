// Endpoint URL builders for GW2 API v2

export const accountEndpoints = {
  account: () => '/account',
  bank: () => '/account/bank',
  materials: () => '/account/materials',
  wallet: () => '/account/wallet',
  achievements: () => '/account/achievements',
  characters: () => '/characters',
  character: (name: string) => `/characters/${encodeURIComponent(name)}`,
  characterInventory: (name: string) => `/characters/${encodeURIComponent(name)}/inventory`,
  equipment: (name: string) => `/characters/${encodeURIComponent(name)}/equipment`,
  skills: (name: string) => `/characters/${encodeURIComponent(name)}/skills`,
  specializations: (name: string) => `/characters/${encodeURIComponent(name)}/specializations`,
  buildtabs: (name: string) => `/characters/${encodeURIComponent(name)}/buildtabs`,
  equipmenttabs: (name: string) => `/characters/${encodeURIComponent(name)}/equipmenttabs`,
  dungeons: () => '/account/dungeons',
  dyes: () => '/account/dyes',
  finishers: () => '/account/finishers',
  gliders: () => '/account/gliders',
  home: () => '/account/home',
  cats: () => '/account/home/cats',
  nodes: () => '/account/home/nodes',
  inventory: () => '/account/inventory',
  luck: () => '/account/luck',
  mailcarriers: () => '/account/mailcarriers',
  mapchests: () => '/account/mapchests',
  masteries: () => '/account/masteries',
  mastery: {
    points: () => '/account/mastery/points',
  },
  minis: () => '/account/minis',
  mounts: {
    skins: () => '/account/mounts/skins',
    types: () => '/account/mounts/types',
  },
  novelties: () => '/account/novelties',
  outfits: () => '/account/outfits',
  pvp: {
    heroes: () => '/account/pvp/heroes',
  },
  raids: () => '/account/raids',
  recipes: () => '/account/recipes',
  skins: () => '/account/skins',
  titles: () => '/account/titles',
  worldbosses: () => '/account/worldbosses',
  wizardsvault: {
    daily: () => '/account/wizardsvault/daily',
    weekly: () => '/account/wizardsvault/weekly',
    special: () => '/account/wizardsvault/special',
    listings: () => '/account/wizardsvault/listings',
  },
} as const;

export const commerceEndpoints = {
  delivery: () => '/commerce/delivery',
  exchange: {
    coins: (quantity: number) => `/commerce/exchange/coins?quantity=${quantity}`,
    gems: (quantity: number) => `/commerce/exchange/gems?quantity=${quantity}`,
  },
  listings: () => '/commerce/listings',
  prices: () => '/commerce/prices',
  transactions: {
    current: {
      buys: () => '/commerce/transactions/current/buys',
      sells: () => '/commerce/transactions/current/sells',
    },
    history: {
      buys: () => '/commerce/transactions/history/buys',
      sells: () => '/commerce/transactions/history/sells',
    },
  },
} as const;

export const itemsEndpoints = {
  items: () => '/items',
  itemstats: () => '/itemstats',
  materials: () => '/materials',
  recipes: () => '/recipes',
  recipeSearch: {
    byInput: (itemId: number) => `/recipes/search?input=${itemId}`,
    byOutput: (itemId: number) => `/recipes/search?output=${itemId}`,
  },
  skins: () => '/skins',
} as const;

export const achievementsEndpoints = {
  achievements: () => '/achievements',
  achievementsDaily: () => '/achievements/daily',
  achievementsDailyTomorrow: () => '/achievements/daily/tomorrow',
  achievementsCategories: () => '/achievements/categories',
  achievementsGroups: () => '/achievements/groups',
} as const;

export const gameEndpoints = {
  build: () => '/build',
  colors: () => '/colors',
  currencies: () => '/currencies',
  dungeons: () => '/dungeons',
  files: () => '/files',
  maps: () => '/maps',
  minis: () => '/minis',
  worlds: () => '/worlds',
  quaggans: () => '/quaggans',
} as const;

export const guildEndpoints = {
  guild: (id: string) => `/guild/${id}`,
  log: (id: string) => `/guild/${id}/log`,
  members: (id: string) => `/guild/${id}/members`,
  ranks: (id: string) => `/guild/${id}/ranks`,
  stash: (id: string) => `/guild/${id}/stash`,
  teams: (id: string) => `/guild/${id}/teams`,
  treasury: (id: string) => `/guild/${id}/treasury`,
  upgrades: (id: string) => `/guild/${id}/upgrades`,
  permissions: () => '/guild/permissions',
  search: (name: string) => `/guild/search?name=${encodeURIComponent(name)}`,
  upgradesAll: () => '/guild/upgrades',
} as const;

export const pvpEndpoints = {
  amulets: () => '/pvp/amulets',
  games: () => '/pvp/games',
  heroes: () => '/pvp/heroes',
  ranks: () => '/pvp/ranks',
  seasons: () => '/pvp/seasons',
  leaderboard: (id: string, board: string, region: string) =>
    `/pvp/seasons/${id}/leaderboards/${board}/${region}`,
  standings: () => '/pvp/standings',
  stats: () => '/pvp/stats',
} as const;

export const wvwEndpoints = {
  abilities: () => '/wvw/abilities',
  matches: () => '/wvw/matches',
  matchOverview: (id: string) => `/wvw/matches/overview?world=${id}`,
  matchScores: (id: string) => `/wvw/matches/scores?world=${id}`,
  matchStats: (id: string) => `/wvw/matches/stats?world=${id}`,
  objectives: () => '/wvw/objectives',
  ranks: () => '/wvw/ranks',
  upgrades: () => '/wvw/upgrades',
} as const;

export const miscEndpoints = {
  continents: () => '/continents',
  backstory: {
    answers: () => '/backstory/answers',
    questions: () => '/backstory/questions',
  },
  createsubtoken: () => '/createsubtoken',
  dailycrafting: () => '/dailycrafting',
  emblem: {
    backgrounds: () => '/emblem/backgrounds',
    foregrounds: () => '/emblem/foregrounds',
  },
  emotes: () => '/emotes',
  legends: () => '/legends',
  mapchests: () => '/mapchests',
  masteries: () => '/masteries',
  mounts: {
    skins: () => '/mounts/skins',
    types: () => '/mounts/types',
  },
  novelties: () => '/novelties',
  outfits: () => '/outfits',
  pets: () => '/pets',
  professions: () => '/professions',
  races: () => '/races',
  skills: () => '/skills',
  specializations: () => '/specializations',
  stories: () => '/stories',
  storiesSeasons: () => '/stories/seasons',
  titles: () => '/titles',
  tokeninfo: () => '/tokeninfo',
  traits: () => '/traits',
  worldbosses: () => '/worldbosses',
} as const;

// Helper type to get all endpoint functions
export type EndpointFunction = (...args: unknown[]) => string;

export const endpoints = {
  account: accountEndpoints,
  commerce: commerceEndpoints,
  items: itemsEndpoints,
  achievements: achievementsEndpoints,
  game: gameEndpoints,
  guild: guildEndpoints,
  pvp: pvpEndpoints,
  wvw: wvwEndpoints,
  misc: miscEndpoints,
} as const;
