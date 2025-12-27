import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useDailyAchievements, useAchievements, useAccountAchievements } from '@/api/hooks/useGW2Api';
import { getApiClient } from '@/api/client';
import { DailyResetTimer } from './DailyResetTimer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, Circle } from 'lucide-react';

export function DailyAchievements() {
  const { data: dailies, isLoading: dailiesLoading } = useDailyAchievements();
  const { data: accountAchievements } = useAccountAchievements({
    enabled: getApiClient().isAuthenticated(),
  });

  const [completedDailies, setCompletedDailies] = useState<Set<number>>(new Set());

  const allDailyIds = [
    ...(dailies?.pve.map(d => d.id) || []),
    ...(dailies?.pvp.map(d => d.id) || []),
    ...(dailies?.wvw.map(d => d.id) || []),
    ...(dailies?.fractals.map(d => d.id) || []),
    ...(dailies?.special.map(d => d.id) || []),
  ];

  const { data: achievementDetails } = useAchievements(allDailyIds, {
    enabled: allDailyIds.length > 0,
  });

  useEffect(() => {
    if (accountAchievements) {
      const completed = new Set(
        accountAchievements
          .filter(a => a.done && allDailyIds.includes(a.id))
          .map(a => a.id)
      );
      setCompletedDailies(completed);
    }
  }, [accountAchievements, allDailyIds]);

  const toggleDaily = (id: number) => {
    const newCompleted = new Set(completedDailies);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedDailies(newCompleted);
    if (typeof window !== 'undefined') {
      localStorage.setItem('gw2-daily-completed', JSON.stringify([...newCompleted]));
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gw2-daily-completed');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setCompletedDailies(new Set(parsed));
        } catch (e) {
          console.error('Failed to parse stored dailies', e);
        }
      }
    }
  }, []);

  const renderDailyList = (dailyIds: number[], category: string) => {
    if (!achievementDetails || dailyIds.length === 0) {
      return (
        <div className="text-center py-4 text-muted-foreground">
          No {category} dailies available
        </div>
      );
    }

    const categoryAchievements = achievementDetails.filter(a => dailyIds.includes(a.id));

    return (
      <div className="space-y-2">
        {categoryAchievements.map(achievement => {
          const isCompleted = completedDailies.has(achievement.id);
          const points = achievement.tiers[0]?.points || 0;

          return (
            <label
              key={achievement.id}
              className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                isCompleted ? 'bg-success/10 border-success/30' : 'bg-card'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleDaily(achievement.id)}
                className="mt-1 flex-shrink-0"
              >
                {isCompleted ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </button>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between gap-2">
                  <span className={`font-medium ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {achievement.name}
                  </span>
                  <span className="text-sm font-bold flex-shrink-0 text-gw2-gold">
                    {points} AP
                  </span>
                </div>
                {achievement.requirement && (
                  <p className="text-sm text-muted-foreground">
                    {achievement.requirement}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>
    );
  };

  if (dailiesLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </CardContent>
      </Card>
    );
  }

  if (!dailies) {
    return (
      <Card>
        <CardContent className="text-center py-8 text-muted-foreground">
          Failed to load daily achievements
        </CardContent>
      </Card>
    );
  }

  const totalCompleted = completedDailies.size;
  const totalDailies = allDailyIds.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Today's Daily Achievements
              <span className="text-sm font-normal text-muted-foreground">
                ({totalCompleted} / {totalDailies})
              </span>
            </CardTitle>
            <CardDescription>
              Complete daily achievements for bonus rewards and achievement points
            </CardDescription>
          </div>
          <DailyResetTimer />
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pve">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pve">
              PvE {dailies.pve.length > 0 && `(${dailies.pve.length})`}
            </TabsTrigger>
            <TabsTrigger value="pvp">
              PvP {dailies.pvp.length > 0 && `(${dailies.pvp.length})`}
            </TabsTrigger>
            <TabsTrigger value="wvw">
              WvW {dailies.wvw.length > 0 && `(${dailies.wvw.length})`}
            </TabsTrigger>
            <TabsTrigger value="fractals">
              Fractals {dailies.fractals.length > 0 && `(${dailies.fractals.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pve" className="space-y-4">
            {renderDailyList(dailies.pve.map(d => d.id), 'PvE')}
          </TabsContent>

          <TabsContent value="pvp" className="space-y-4">
            {renderDailyList(dailies.pvp.map(d => d.id), 'PvP')}
          </TabsContent>

          <TabsContent value="wvw" className="space-y-4">
            {renderDailyList(dailies.wvw.map(d => d.id), 'WvW')}
          </TabsContent>

          <TabsContent value="fractals" className="space-y-4">
            {renderDailyList(dailies.fractals.map(d => d.id), 'Fractals')}
          </TabsContent>
        </Tabs>

        {dailies.special.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="font-semibold heading-accent">Special Events</h4>
            {renderDailyList(dailies.special.map(d => d.id), 'Special')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
