import type { Character } from '@/api/types';

interface CharacterOverviewProps {
  character: Character;
}

export function CharacterOverview({ character: _character }: CharacterOverviewProps) {
  return (
    <div className="space-y-4">
      {/* Character stats, crafting disciplines, and guild info are now displayed in the header */}
    </div>
  );
}
