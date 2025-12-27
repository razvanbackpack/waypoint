import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  useWizardsVaultDaily,
  useWizardsVaultWeekly,
  useWizardsVaultSpecial,
} from '@/api/hooks/useGW2Api';
import { getApiClient } from '@/api/client';
import { Sparkles, Sun, Calendar, Star, Check, CheckCircle2, Circle, Gift, CalendarCheck } from 'lucide-react';
import type { WizardsVaultObjective } from '@/api/types';

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
    <div className={`p-3 rounded-lg border transition-all duration-300 ${
      isComplete
        ? 'bg-success/5 border-success/30 shadow-lg shadow-success/10'
        : 'bg-card hover:border-gw2-gold/30 hover:shadow-md'
    }`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-medium">{title}</span>
        <span className="ml-auto text-sm">
          {completed}/{total}
          {isComplete && reward && <span className="text-gw2-gold ml-1">+{reward}</span>}
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
  const progress = (objective.progress_current / objective.progress_complete) * 100;

  return (
    <div
      className={`p-3 rounded-lg border transition-all duration-300 hover:scale-[1.02] ${
        isComplete
          ? 'bg-success/10 border-success/50 shadow-success/20 shadow-md animate-fade-in'
          : 'bg-card hover:border-gw2-gold/50 hover:shadow-lg hover:shadow-gw2-gold/5'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox/Trophy icon */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isComplete ? 'bg-success text-success-foreground' : 'bg-muted'
          }`}
        >
          {isComplete ? <Check className="h-5 w-5" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{objective.title}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <Badge className={getTrackColor(objective.track)} variant="outline">
              {objective.track}
            </Badge>
          </div>

          {/* Progress bar */}
          {!isComplete && (
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>
                  {objective.progress_current}/{objective.progress_complete}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gw2-gold to-yellow-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Acclaim reward */}
        <div className="text-right shrink-0">
          <div className="text-sm font-bold text-gw2-gold">+{objective.acclaim}</div>
          <div className="text-xs text-muted-foreground">Acclaim</div>
        </div>
      </div>
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
    <div className={`p-4 rounded-lg border-2 mb-4 transition-all duration-300 ${
      claimed
        ? 'bg-success/10 border-success/50 shadow-lg shadow-success/20'
        : isComplete
          ? 'bg-gw2-gold/10 border-gw2-gold/50 shadow-lg shadow-gw2-gold/20 animate-pulse-glow'
          : 'bg-card border-border'
    }`}>
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-lg ${
          claimed
            ? 'bg-success/20 border border-success/30'
            : isComplete
              ? 'bg-gw2-gold/20 border border-gw2-gold/30'
              : 'bg-muted/50 border border-border'
        }`}>
          <Gift className={`h-6 w-6 ${claimed ? 'text-success' : isComplete ? 'text-gw2-gold' : 'text-muted-foreground'}`} />
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
              <Badge className="bg-gw2-gold/20 text-gw2-gold border-gw2-gold/50 text-xs py-0 animate-pulse">
                Ready to claim!
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden max-w-48">
              <div
                className={`h-full transition-all duration-500 ${claimed ? 'bg-success' : 'bg-gradient-to-r from-gw2-gold to-yellow-500'}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">{progressCurrent}/{progressComplete}</span>
          </div>
        </div>

        {isComplete && rewardAstral && (
          <div className="text-right">
            <div className={`text-lg font-bold ${claimed ? 'text-success' : 'text-gw2-gold'}`}>+{rewardAstral}</div>
            <div className="text-xs text-muted-foreground">Acclaim</div>
          </div>
        )}
      </div>
    </div>
  );
}

export function Dailies() {
  const [mainTab, setMainTab] = useState('daily');
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
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-6 w-6 text-gw2-gold" />
          <div>
            <h1 className="text-2xl font-bold">Wizard's Vault</h1>
            <p className="text-xs text-muted-foreground">
              Daily, weekly, and special objectives • Next reset: <span className="text-gw2-gold font-mono">{formatReset(dailyReset)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Featured Reset Timer Card */}
      <div className="p-3 rounded-lg border border-gw2-gold/30 bg-gradient-to-br from-gw2-gold/5 via-transparent to-gw2-gold/5">
        <div className="flex items-center justify-between">
          {/* Astral Acclaim */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gw2-gold/10 border border-gw2-gold/20">
              <Sparkles className="h-4 w-4 text-gw2-gold" />
            </div>
            <div>
              <div className="text-lg font-bold text-gw2-gold">{acclaim}</div>
              <div className="text-[10px] text-muted-foreground">Astral Acclaim</div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-border" />

          {/* Daily Reset */}
          <div className="text-center">
            <div className="text-lg font-mono font-bold text-gw2-gold">{formatReset(dailyReset)}</div>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
            className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md border border-transparent hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-gw2-gold data-[state=active]:border-border transition-colors"
          >
            <Sun className="h-4 w-4" />
            <span>Daily</span>
          </TabsTrigger>
          <TabsTrigger
            value="weekly"
            className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md border border-transparent hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-gw2-gold data-[state=active]:border-border transition-colors"
          >
            <Calendar className="h-4 w-4" />
            <span>Weekly</span>
          </TabsTrigger>
          <TabsTrigger
            value="special"
            className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-muted-foreground rounded-md border border-transparent hover:text-foreground data-[state=active]:bg-muted data-[state=active]:text-gw2-gold data-[state=active]:border-border transition-colors"
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Completed ({complete.length})</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 opacity-70">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Completed ({complete.length})</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 opacity-70">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-6">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span>Completed ({complete.length})</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 opacity-70">
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
  );
}
