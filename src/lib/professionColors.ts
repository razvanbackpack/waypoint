import type { Profession } from '@/api/types';

export const PROFESSION_COLORS: Record<string, { primary: string; dark: string; light: string }> = {
  Guardian: {
    primary: '#72C1D9',
    dark: '#186885',
    light: '#BCE8FD',
  },
  Revenant: {
    primary: '#D16E5A',
    dark: '#A66356',
    light: '#E4AEA3',
  },
  Warrior: {
    primary: '#FFD166',
    dark: '#CAAA2A',
    light: '#FFF2A4',
  },
  Engineer: {
    primary: '#D09C59',
    dark: '#87581D',
    light: '#E8BC84',
  },
  Ranger: {
    primary: '#8CDC82',
    dark: '#67A833',
    light: '#D2F6BC',
  },
  Thief: {
    primary: '#C08F95',
    dark: '#974550',
    light: '#DEC6C9',
  },
  Elementalist: {
    primary: '#F68A87',
    dark: '#DC423E',
    light: '#F6BEBC',
  },
  Mesmer: {
    primary: '#B679D5',
    dark: '#69278A',
    light: '#D09EEA',
  },
  Necromancer: {
    primary: '#52A76F',
    dark: '#2C9D5D',
    light: '#BFE6D0',
  },
};

export const RARITY_COLORS: Record<string, { light: string; dark: string }> = {
  Junk: {
    light: '#666666',
    dark: '#828282',
  },
  Basic: {
    light: '#6B7280',
    dark: '#FFFFFF',
  },
  Fine: {
    light: '#2563EB',
    dark: '#62A4DA',
  },
  Masterwork: {
    light: '#15803D',
    dark: '#1A9306',
  },
  Rare: {
    light: '#A16207',
    dark: '#FCD00B',
  },
  Exotic: {
    light: '#C2410C',
    dark: '#FFA405',
  },
  Ascended: {
    light: '#BE185D',
    dark: '#FB3E8D',
  },
  Legendary: {
    light: '#7C3AED',
    dark: '#974EFF',
  },
};

export function getProfessionColor(profession: string | Profession, variant: 'primary' | 'dark' | 'light' = 'primary'): string {
  const colors = PROFESSION_COLORS[profession];
  return colors ? colors[variant] : '#FFFFFF';
}

export function getRarityColor(rarity: string, variant: 'light' | 'dark' = 'dark'): string {
  const colors = RARITY_COLORS[rarity];
  return colors ? colors[variant] : (variant === 'light' ? '#6B7280' : '#FFFFFF');
}
