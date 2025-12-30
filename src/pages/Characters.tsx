import { useState, useEffect, useMemo } from 'react';
import { useApiKey } from '@/api/hooks/useApiKey';
import { useCharacter, useWallet, useMasteryPoints, useAccount, useCharacterSpecializations } from '@/api/hooks/useGW2Api';
import { PROFESSION_ICONS, DISCIPLINE_ICONS, ELITE_SPEC_ICONS, ELITE_SPEC_IDS } from '@/lib/gw2Icons';
import { useViewMode } from '@/hooks/useViewMode';
import { ApiKeySetup } from '@/components/inventory/ApiKeySetup';
import { CharacterInventory } from '@/components/characters/CharacterInventory';
import { CharacterEquipment } from '@/components/characters/CharacterEquipment';
import { CharacterBank } from '@/components/characters/CharacterBank';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Search, Star, Swords, Hammer, TrendingUp, User, Package, Vault } from 'lucide-react';
import { getProfessionColor } from '@/lib/professionColors';
import { getApiClient } from '@/api/client';
import { guildEndpoints } from '@/api/endpoints';
import { CoinDisplay } from '@/components/trading-post/PriceDisplay';

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
  const { data: characterSpecs } = useCharacterSpecializations(selectedCharacter || '', {
    enabled: hasApiKey && !!selectedCharacter,
  });

  // Get active elite spec from PvE specializations
  const activeEliteSpec = useMemo(() => {
    if (!characterSpecs?.specializations?.pve) return null;

    // Find the elite spec (check all 3 spec slots for an elite spec ID)
    for (const spec of characterSpecs.specializations.pve) {
      if (spec?.id && ELITE_SPEC_IDS[spec.id]) {
        return ELITE_SPEC_IDS[spec.id];
      }
    }
    return null;
  }, [characterSpecs]);

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
          <h1 className="text-4xl font-bold text-gw2-accent">
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
      {/* Page Header - Compact hero section */}
      <div
        className="relative rounded-xl p-3 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${professionColor}12 0%, transparent 60%)`,
          borderLeft: `3px solid ${professionColor}`,
        }}
      >
        <div className="flex items-center gap-4">
          {/* Large spec icon */}
          <div className="shrink-0">
            {activeEliteSpec && ELITE_SPEC_ICONS[activeEliteSpec] ? (
              <img
                src={ELITE_SPEC_ICONS[activeEliteSpec]}
                alt={activeEliteSpec}
                className="h-20 w-20"
                style={{ filter: `drop-shadow(0 0 12px ${professionColor}50)` }}
              />
            ) : character?.profession && PROFESSION_ICONS[character.profession] ? (
              <img
                src={PROFESSION_ICONS[character.profession]}
                alt={character.profession}
                className="h-20 w-20"
                style={{ filter: `drop-shadow(0 0 12px ${professionColor}50)` }}
              />
            ) : (
              <User className="h-20 w-20" style={{ color: professionColor }} />
            )}
          </div>

          {/* Character info */}
          <div className="flex-1 min-w-0">
            {/* Name row */}
            <div className="flex items-center gap-3 flex-wrap">
              <h1
                className="text-2xl font-bold tracking-tight truncate"
                style={{ color: professionColor }}
              >
                {character?.name || 'Character Viewer'}
              </h1>
              {guildName && (
                <span className="text-sm text-gw2-accent font-medium">
                  &lt;{guildName}&gt;
                </span>
              )}
            </div>

            {/* Info row */}
            {character && (
              <div className="flex items-center gap-x-3 gap-y-1 flex-wrap mt-1 text-sm">
                <span className="text-muted-foreground">
                  Level <span className="font-semibold text-foreground">{character.level}</span>
                </span>
                <span className="text-muted-foreground">{character.race}</span>
                <span style={{ color: professionColor }} className="font-medium">
                  {character.profession}{activeEliteSpec ? ` / ${activeEliteSpec}` : ''}
                </span>
              </div>
            )}
          </div>

          {/* Age info - far right */}
          {(character?.created || account?.created) && (
            <div className="hidden sm:flex flex-col gap-0.5 text-right shrink-0 pl-4 border-l border-border/50">
              {character?.created && (
                <div className="flex items-center justify-end gap-1.5 text-xs">
                  <span className="text-muted-foreground">Character</span>
                  <span className="font-semibold text-foreground">{formatCharacterAge(character.created)}</span>
                </div>
              )}
              {account?.created && (
                <div className="flex items-center justify-end gap-1.5 text-xs">
                  <span className="text-muted-foreground">Account</span>
                  <span className="font-semibold text-foreground">{formatCharacterAge(account.created)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      {character && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
          {/* Gold */}
          {goldCurrency && (
            <div className="flex items-center gap-1.5">
              <CoinDisplay copper={goldCurrency.value} />
            </div>
          )}
          {/* Separator */}
          {goldCurrency && (account?.wvw_rank || account?.fractal_level || totalMastery > 0) && (
            <span className="text-border">•</span>
          )}
          {/* WvW Rank */}
          {account?.wvw_rank && (
            <div className="flex items-center gap-1.5">
              <Swords className="h-4 w-4 text-red-400" />
              <span>WvW <span className="text-foreground font-medium">{account.wvw_rank}</span></span>
            </div>
          )}
          {/* Fractal Level */}
          {account?.fractal_level && (
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-purple-400" />
              <span>Fractal <span className="text-foreground font-medium">{account.fractal_level}</span></span>
            </div>
          )}
          {/* Mastery */}
          {totalMastery > 0 && (
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-yellow-400" />
              <span>Mastery <span className="text-foreground font-medium">{totalMastery}</span></span>
            </div>
          )}
          {/* Crafting - show on separate line if many */}
          {character?.crafting && character.crafting.length > 0 && (
            <>
              <span className="text-border">•</span>
              <div className="flex items-center gap-2">
                {character.crafting.filter(c => c.active).map((craft) => (
                  <div key={craft.discipline} className="flex items-center gap-1" title={`${craft.discipline} ${craft.rating}`}>
                    {DISCIPLINE_ICONS[craft.discipline] ? (
                      <img src={DISCIPLINE_ICONS[craft.discipline]} alt={craft.discipline} className="h-5 w-5" />
                    ) : (
                      <Hammer className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-foreground font-medium">{craft.rating}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {!selectedCharacter ? (
        <Card variant="interactive" className="hover:border-gw2-accent/50 transition-all duration-300">
          <CardContent className="py-10">
            <div className="text-center space-y-3">
              <User className="h-12 w-12 mx-auto text-gw2-accent/50" />
              <div>
                <h3 className="text-xl font-bold mb-2 text-gw2-accent">Select a Character</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Choose a character from the dropdown in the navigation bar to view their details, equipment, inventory, and achievements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : characterLoading ? (
        <div className="flex flex-col items-center justify-center py-10 space-y-3">
          <div className="animate-spin h-10 w-10 border-4 border-gw2-accent border-t-transparent rounded-full" />
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
                className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md border border-transparent hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-gw2-accent data-[state=active]:border-border transition-colors"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Equipment</span>
                <span className="sm:hidden">Gear</span>
              </TabsTrigger>
              <TabsTrigger
                value="inventory"
                className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md border border-transparent hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-gw2-accent data-[state=active]:border-border transition-colors"
              >
                <Package className="h-4 w-4" />
                <span>Inventory</span>
              </TabsTrigger>
              <TabsTrigger
                value="bank"
                className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md border border-transparent hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-gw2-accent data-[state=active]:border-border transition-colors"
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
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gw2-accent" />
                  <Input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 border-gw2-accent/20 focus:border-gw2-accent focus:ring-gw2-gold/20"
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
