import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DailyAchievements } from '@/components/achievements/DailyAchievements';
import { AchievementCard } from '@/components/achievements/AchievementCard';
import { CategoryBrowser } from '@/components/achievements/CategoryBrowser';
import { useAccount, useAccountAchievements, useAchievements } from '@/api/hooks/useGW2Api';
import { getApiClient } from '@/api/client';
import { Search, Trophy, TrendingUp } from 'lucide-react';

type FilterType = 'all' | 'in_progress' | 'completed' | 'locked';

export function Achievements() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedAchievementIds, setSelectedAchievementIds] = useState<number[]>([]);

  const isAuthenticated = getApiClient().isAuthenticated();

  const { data: account } = useAccount({
    enabled: isAuthenticated,
  });

  const { data: accountAchievements } = useAccountAchievements({
    enabled: isAuthenticated,
  });

  const { data: selectedAchievements, isLoading: achievementsLoading } = useAchievements(
    selectedAchievementIds,
    {
      enabled: selectedAchievementIds.length > 0,
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would search through all achievements
    // For now, this is a placeholder
    console.log('Searching for:', searchQuery);
  };

  const filterAchievements = () => {
    if (!selectedAchievements) return [];

    return selectedAchievements.filter(achievement => {
      const accountProgress = accountAchievements?.find(a => a.id === achievement.id);

      switch (activeFilter) {
        case 'completed':
          return accountProgress?.done === true;
        case 'in_progress':
          return accountProgress && !accountProgress.done;
        case 'locked':
          return !accountProgress || achievement.flags.includes('Locked');
        case 'all':
        default:
          return true;
      }
    });
  };

  const totalAP = account
    ? account.daily_ap + account.monthly_ap
    : accountAchievements
    ? accountAchievements.reduce((sum, achievement) => {
        // Simple estimation based on completion
        return sum + (achievement.done ? 10 : 0);
      }, 0)
    : 0;

  const completedCount = accountAchievements?.filter(a => a.done).length || 0;
  const totalCount = accountAchievements?.length || 0;

  return (
    <div className="space-y-6">
      <header className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gw2-accent">
          Achievements
        </h1>
        <p className="text-muted-foreground mt-1">
          Track your achievement progress and earn rewards
        </p>
      </header>

      {isAuthenticated && account && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Achievement Points</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gw2-accent">
                {totalAP.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Daily: {account.daily_ap.toLocaleString()} | Monthly: {account.monthly_ap.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Achievements Completed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {completedCount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {totalCount > 0 ? `${((completedCount / totalCount) * 100).toFixed(1)}% complete` : 'Loading...'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Age</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.floor(account.age / (60 * 60 * 24))} days
              </div>
              <p className="text-xs text-muted-foreground">
                Created {new Date(account.created).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <DailyAchievements />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <CategoryBrowser onSelectAchievements={setSelectedAchievementIds} />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Achievements</CardTitle>
              <CardDescription>
                Find achievements by name or description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search achievements..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button type="submit">Search</Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={activeFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('all')}
                  >
                    All
                  </Button>
                  <Button
                    type="button"
                    variant={activeFilter === 'in_progress' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('in_progress')}
                  >
                    In Progress
                  </Button>
                  <Button
                    type="button"
                    variant={activeFilter === 'completed' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('completed')}
                  >
                    Completed
                  </Button>
                  <Button
                    type="button"
                    variant={activeFilter === 'locked' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter('locked')}
                  >
                    Locked
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {selectedAchievementIds.length > 0 && (
            <div className="space-y-4">
              {achievementsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                </div>
              ) : (
                <>
                  {filterAchievements().length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12 text-muted-foreground">
                        No achievements found matching your filters.
                      </CardContent>
                    </Card>
                  ) : (
                    filterAchievements().map(achievement => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                        accountProgress={accountAchievements?.find(a => a.id === achievement.id)}
                      />
                    ))
                  )}
                </>
              )}
            </div>
          )}

          {selectedAchievementIds.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Select a category from the browser on the left to view achievements
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
