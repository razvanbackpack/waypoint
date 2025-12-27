import { useState, useEffect } from 'react';
import { useApiKey } from '@/api/hooks/useApiKey';
import { useCharacter, useWallet, useMasteryPoints, useAccount } from '@/api/hooks/useGW2Api';
import { useViewMode } from '@/hooks/useViewMode';
import { ApiKeySetup } from '@/components/inventory/ApiKeySetup';
import { CharacterInventory } from '@/components/characters/CharacterInventory';
import { CharacterEquipment } from '@/components/characters/CharacterEquipment';
import { CharacterBank } from '@/components/characters/CharacterBank';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Coins, Star, Swords, Hammer, TrendingUp, User, Package, Vault } from 'lucide-react';
import { getProfessionColor } from '@/lib/professionColors';
import { getApiClient } from '@/api/client';
import { guildEndpoints } from '@/api/endpoints';

const formatGold = (copper: number) => {
  const gold = Math.floor(copper / 10000);
  const silver = Math.floor((copper % 10000) / 100);
  const copperRem = copper % 100;
  return `${gold.toLocaleString()}g ${silver}s ${copperRem}c`;
};

const formatCharacterAge = (createdDate: string): string => {
  const created = new Date(createdDate);
  const now = new Date();
  const totalDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));

  if (totalDays >= 365) {
    const years = Math.floor(totalDays / 365);
    const remainingDays = totalDays % 365;
    const months = Math.floor(remainingDays / 30);
    if (months > 0) {
      return `${years}y ${months}mo`;
    }
    return `${years}y`;
  }
  return `${totalDays} days`;
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

  const professionColor = character ? getProfessionColor(character.profession) : 'var(--gw2-gold)';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header - Enhanced with profession-colored accents */}
      <div
        className="relative rounded-xl p-4 overflow-hidden backdrop-blur-sm"
        style={{
          background: `linear-gradient(135deg, ${professionColor}15 0%, ${professionColor}08 50%, transparent 100%)`,
          borderLeft: `4px solid ${professionColor}`,
          boxShadow: `0 4px 20px ${professionColor}15, inset 0 1px 0 rgba(255,255,255,0.1)`,
        }}
      >
        {/* Subtle radial accent in corner */}
        <div
          className="absolute top-0 right-0 w-32 h-32 opacity-30 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 100% 0%, ${professionColor}40 0%, transparent 70%)`,
          }}
        />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            {/* Icon with glow container */}
            <div
              className="p-2 rounded-lg"
              style={{
                backgroundColor: `${professionColor}20`,
                boxShadow: `0 0 12px ${professionColor}40`,
              }}
            >
              <User className="h-6 w-6" style={{ color: professionColor }} />
            </div>
            {/* Character name - larger with text shadow glow */}
            <h1
              className="text-3xl font-bold tracking-tight"
              style={{
                color: professionColor,
                textShadow: `0 0 20px ${professionColor}50, 0 0 40px ${professionColor}30`,
              }}
            >
              {character?.name || 'Character Viewer'}
            </h1>
          </div>

          {character && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Level badge with profession accent */}
              <span
                className="px-2.5 py-1 rounded-full text-xs font-bold"
                style={{
                  backgroundColor: `${professionColor}20`,
                  color: professionColor,
                  border: `1px solid ${professionColor}40`,
                  boxShadow: `0 0 8px ${professionColor}20`,
                }}
              >
                Level {character.level}
              </span>
              {/* Race badge */}
              <span className="px-2.5 py-1 rounded-full bg-background/80 border border-border text-xs font-semibold">
                {character.race}
              </span>
              {/* Profession badge with enhanced glow */}
              <span
                className="px-2.5 py-1 rounded-full text-xs font-bold"
                style={{
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: professionColor,
                  color: professionColor,
                  backgroundColor: `${professionColor}25`,
                  boxShadow: `0 0 12px ${professionColor}40, inset 0 0 8px ${professionColor}20`,
                }}
              >
                {character.profession}
              </span>
              {/* Guild name with gold glow */}
              {guildName && (
                <span className="px-2.5 py-1 rounded-full bg-gw2-gold/15 border border-gw2-gold/40 text-xs font-semibold text-gw2-gold glow-gold-sm">
                  {guildName}
                </span>
              )}
              {/* Age info pushed to right */}
              {(character.created || account?.created) && (
                <div className="flex flex-col gap-0.5 ml-auto text-right">
                  {character.created && (
                    <span className="text-xs text-muted-foreground font-medium">
                      {formatCharacterAge(character.created)} old ({new Date(character.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
                    </span>
                  )}
                  {account?.created && (
                    <span className="text-xs text-muted-foreground font-medium">
                      Account: {formatCharacterAge(account.created)} ({new Date(account.created).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      {character && (
        <div className="flex flex-wrap gap-1.5">
          {/* Gold */}
          {goldCurrency && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-gw2-gold/10 border border-gw2-gold/20">
              <Coins className="h-3 w-3 text-gw2-gold" />
              <span className="text-[11px] font-semibold">{formatGold(goldCurrency.value)}</span>
            </div>
          )}
          {/* WvW Rank */}
          {account?.wvw_rank && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-gw2-gold/10 border border-gw2-gold/20">
              <Swords className="h-3 w-3 text-gw2-gold" />
              <span className="text-[11px] font-semibold">WvW {account.wvw_rank}</span>
            </div>
          )}
          {/* Fractal Level */}
          {account?.fractal_level && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-gw2-gold/10 border border-gw2-gold/20">
              <Star className="h-3 w-3 text-gw2-gold" />
              <span className="text-[11px] font-semibold">Fractal {account.fractal_level}</span>
            </div>
          )}
          {/* Mastery */}
          {totalMastery > 0 && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-lg bg-gw2-gold/10 border border-gw2-gold/20">
              <TrendingUp className="h-3 w-3 text-gw2-gold" />
              <span className="text-[11px] font-semibold">Mastery {totalMastery}</span>
            </div>
          )}
          {/* Crafting Disciplines */}
          {character?.crafting?.map((craft) => (
            <div
              key={craft.discipline}
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg border ${
                craft.active
                  ? 'bg-gw2-gold/10 border-gw2-gold/20'
                  : 'bg-muted/30 border-border/40 opacity-60'
              }`}
            >
              <Hammer className={`h-3 w-3 ${craft.active ? 'text-gw2-gold' : 'text-muted-foreground'}`} />
              <span className="text-[11px] font-semibold">{craft.discipline} {craft.rating}</span>
            </div>
          ))}
        </div>
      )}

      {!selectedCharacter ? (
        <Card variant="interactive" className="hover:border-gw2-gold/50 transition-all duration-300">
          <CardContent className="py-10">
            <div className="text-center space-y-3">
              <User className="h-12 w-12 mx-auto text-gw2-gold/50" />
              <div>
                <h3 className="text-xl font-bold mb-2 text-gw2-gold">Select a Character</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Choose a character from the dropdown in the navigation bar to view their details, equipment, inventory, and achievements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : characterLoading ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-3">
          <div className="animate-spin h-10 w-10 border-4 border-gw2-gold border-t-transparent rounded-full" />
          <p className="text-sm text-muted-foreground">Loading character data...</p>
        </div>
      ) : !character ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-base text-muted-foreground">Character not found</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-2">
            <TabsList className="w-full grid grid-cols-3 h-auto bg-transparent gap-1 p-0">
              <TabsTrigger
                value="overview"
                className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md border border-transparent hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-gw2-gold data-[state=active]:border-border transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Equipment</span>
                <span className="sm:hidden">Gear</span>
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md border border-transparent hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-gw2-gold data-[state=active]:border-border transition-colors"
              >
                <Package className="h-4 w-4" />
                <span>Inventory</span>
              </TabsTrigger>
              <TabsTrigger
                value="bank"
                className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md border border-transparent hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-gw2-gold data-[state=active]:border-border transition-colors"
              >
                <Vault className="h-4 w-4" />
                <span>Bank</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-3 animate-fade-in">
              <CharacterEquipment character={character} />
            </TabsContent>

            <TabsContent value="inventory" className="space-y-2 animate-fade-in">
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

            <TabsContent value="bank" className="space-y-3 animate-fade-in">
              <CharacterBank character={character} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
