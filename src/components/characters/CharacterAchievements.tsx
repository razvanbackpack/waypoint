import { Card, CardContent } from '@/components/ui/card';
import type { Character } from '@/api/types';

interface CharacterAchievementsProps {
  character: Character;
}

export function CharacterAchievements({ character }: CharacterAchievementsProps) {
  return (
    <Card>
      <CardContent className="py-12">
        <div className="text-center text-muted-foreground">
          <p>Character achievements coming soon.</p>
          <p className="text-sm mt-2">This will show achievements specific to {character.name}.</p>
        </div>
      </CardContent>
    </Card>
  );
}
