import { useState, useEffect } from 'react';
import { useApiKey } from '@/api/hooks/useApiKey';
import { useCharacter, useWallet, useMasteryPoints, useAccount } from '@/api/hooks/useGW2Api';
import { useViewMode } from '@/hooks/useViewMode';
import { ApiKeySetup } from '@/components/inventory/ApiKeySetup';
import { CharacterInventory } from '@/components/characters/CharacterInventory';
import { CharacterEquipment } from '@/components/characters/CharacterEquipment';
import { CharacterAchievements } from '@/components/characters/CharacterAchievements';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Coins, Star, Swords, Hammer, TrendingUp, User, Package, Trophy } from 'lucide-react';
import { getProfessionColor } from '@/lib/professionColors';
import { getApiClient } from '@/api/client';
import { guildEndpoints } from '@/api/endpoints';

const formatGold = (copper: number) => {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const copperRem = copper % 100;
  return `${gold.toLocaleString()}g ${silver}s ${copperRem}c`;
};

const formatAge = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 365) {
    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? 's' : ''}`;
  }
  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
};

const formatCharacterAge = (createdDate: string): string => {
  const created = new Date(createdDate);
  const now = new Date();
  const days = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
  if (days > 365) {
    const years = Math.floor(days / 365);
    return `${years}y ago`;
  }
  return `${days}d ago`;
};

export function Characters() {
  const { hasApiKey } = useApiKey();
  const { selectedCharacter } = useViewMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [guildName, setGuildName] = useState<string | null>(null);

  const { data: character, isLoading: characterLoading } = useCharacter(
    selectedCharacter || '',
    {
      enabled: hasApiKey && !!selectedCharacter,
    }
  );
  const { data: wallet } = useWallet();
  const { data: account } = useAccount();
  const { data: masteryPoints } = useMasteryPoints();

  const goldCurrency = wallet?.find(c => c.id === 1);
  const totalMastery = masteryPoints?.totals?.reduce((sum, t) => sum + t.spent, 0) || 0;

  // Fetch guild name when character has a guild
  useEffect(() => {
    if (character?.guild) {
      const client = getApiClient();
      client
        .get<{ name: string }>(guildEndpoints.guild(character.guild))
        .then((guild) => setGuildName(guild.name))
        .catch(() => setGuildName(null));
    } else {
      setGuildName(null);
    }
  }, [character?.guild]);

  if (!hasApiKey) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="text-center space-y-3 py-8">
          <h1 className="text-4xl font-bold text-gw2-gold">
            Welcome to GW2 Companion
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            View detailed information about your Guild Wars 2 characters, inventory, equipment, and achievements
          </p>
        </div>
        <ApiKeySetup />
      </div>
    );
  }

  const professionColor = character ? getProfessionColor(character.profession) : '#C9A227';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Enhanced Page Header */}
      <Card variant="featured" className="border-l-4" style={{ borderLeftColor: professionColor }}>
        <CardContent className="py-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-2xl font-bold" style={{ color: professionColor }}>
                  {character?.name || 'Character Viewer'}
                </h1>
                {character && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-background border border-border text-xs font-semibold">
                      Level {character.level}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-background border border-border text-xs font-semibold">
                      {character.race}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded-full border text-xs font-semibold"
                      style={{
                        borderColor: professionColor,
                        color: professionColor,
                        backgroundColor: `${professionColor}10`
                      }}
                    >
                      {character.profession}
                    </span>
                    {guildName && (
                      <span className="px-2 py-0.5 rounded-full bg-gw2-gold/10 border border-gw2-gold/20 text-xs font-semibold text-gw2-gold">
                        {guildName}
                      </span>
                    )}
                    {character.age && (
                      <span className="text-xs text-muted-foreground font-medium">
                        Played {formatAge(character.age)}
                      </span>
                    )}
                    {character.created && (
                      <span className="text-xs text-muted-foreground font-medium">
                        Created {formatCharacterAge(character.created)}
                      </span>
                    )}
                    {account?.age && (
                      <span className="text-xs text-muted-foreground font-medium">
                        Account {formatAge(account.age)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {character && (
              <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/40">
              {/* Gold */}
              {goldCurrency && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-[#C59C61]/10 border border-[#C59C61]/20">
                  <Coins className="h-3 w-3 text-[#C59C61]" />
                  <span className="text-[11px] font-semibold">{formatGold(goldCurrency.value)}</span>
                </div>
              )}
              {/* WvW Rank */}
              {account?.wvw_rank && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-[#C59C61]/10 border border-[#C59C61]/20">
                  <Swords className="h-3 w-3 text-[#C59C61]" />
                  <span className="text-[11px] font-semibold">WvW {account.wvw_rank}</span>
                </div>
              )}
              {/* Fractal Level */}
              {account?.fractal_level && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-[#C59C61]/10 border border-[#C59C61]/20">
                  <Star className="h-3 w-3 text-[#C59C61]" />
                  <span className="text-[11px] font-semibold">Fractal {account.fractal_level}</span>
                </div>
              )}
              {/* Mastery */}
              {totalMastery > 0 && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-[#C59C61]/10 border border-[#C59C61]/20">
                  <TrendingUp className="h-3 w-3 text-[#C59C61]" />
                  <span className="text-[11px] font-semibold">Mastery {totalMastery}</span>
                </div>
              )}
              {/* Crafting Disciplines */}
              {character?.crafting?.map((craft) => (
                <div
                  key={craft.discipline}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg border ${
                    craft.active
                      ? 'bg-[#C59C61]/10 border-[#C59C61]/20'
                      : 'bg-muted/30 border-border/40 opacity-60'
                  }`}
                >
                  <Hammer className={`h-3 w-3 ${craft.active ? 'text-[#C59C61]' : 'text-muted-foreground'}`} />
                  <span className="text-[11px] font-semibold">{craft.discipline} {craft.rating}</span>
                </div>
              ))}
            </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!selectedCharacter ? (
        <Card variant="interactive" className="hover:border-gw2-gold/50 transition-all duration-300">
          <CardContent className="py-16">
            <div className="text-center space-y-4">
              <User className="h-16 w-16 mx-auto text-gw2-gold/50" />
              <div>
                <h3 className="text-2xl font-bold mb-2 text-gw2-gold">Select a Character</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Choose a character from the dropdown in the navigation bar to view their details, equipment, inventory, and achievements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : characterLoading ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="animate-spin h-12 w-12 border-4 border-gw2-gold border-t-transparent rounded-full" />
          <p className="text-sm text-muted-foreground">Loading character data...</p>
        </div>
      ) : !character ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">Character not found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="sticky top-0 z-10 grid w-full grid-cols-3 lg:w-auto bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b-2 border-border/40 shadow-sm">
              <TabsTrigger
                value="overview"
                className="flex items-center gap-2 px-6 py-3 font-semibold data-[state=active]:text-gw2-gold data-[state=active]:border-b-2 data-[state=active]:border-gw2-gold data-[state=active]:shadow-[0_2px_0_0_rgba(201,162,39,0.3)] rounded-b-none transition-all duration-200 hover:text-gw2-gold/70"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Equipment</span>
                <span className="sm:hidden">Gear</span>
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="flex items-center gap-2 px-6 py-3 font-semibold data-[state=active]:text-gw2-gold data-[state=active]:border-b-2 data-[state=active]:border-gw2-gold data-[state=active]:shadow-[0_2px_0_0_rgba(201,162,39,0.3)] rounded-b-none transition-all duration-200 hover:text-gw2-gold/70"
              >
                <Package className="h-4 w-4" />
                <span>Inventory</span>
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="flex items-center gap-2 px-6 py-3 font-semibold data-[state=active]:text-gw2-gold data-[state=active]:border-b-2 data-[state=active]:border-gw2-gold data-[state=active]:shadow-[0_2px_0_0_rgba(201,162,39,0.3)] rounded-b-none transition-all duration-200 hover:text-gw2-gold/70"
              >
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Achievements</span>
                <span className="sm:hidden">Achieve</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 animate-fade-in">
              <CharacterEquipment character={character} />
            </TabsContent>

            <TabsContent value="inventory" className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gw2-gold" />
                  <Input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 border-gw2-gold/20 focus:border-gw2-gold focus:ring-gw2-gold/20"
                  />
                </div>
              </div>
              <CharacterInventory character={character} searchTerm={searchTerm} />
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6 animate-fade-in">
              <CharacterAchievements character={character} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
