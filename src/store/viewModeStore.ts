import { create } from 'zustand';
import { loadConfig, updateConfig } from '../utils/config';

interface ViewModeState {
  selectedCharacter: string | null;
  isLoading: boolean;
  setSelectedCharacter: (character: string) => void;
  initializeFromConfig: () => void;
  persistToConfig: () => void;
}

export const useViewModeStore = create<ViewModeState>((set, get) => ({
  selectedCharacter: null,
  isLoading: true,

  setSelectedCharacter: (character: string) => {
    set({ selectedCharacter: character });
    get().persistToConfig();
  },

  initializeFromConfig: () => {
    const config = loadConfig();
    set({
      selectedCharacter: config.defaultCharacter || null,
      isLoading: false,
    });
  },

  persistToConfig: () => {
    const { selectedCharacter } = get();
    updateConfig({
      defaultCharacter: selectedCharacter,
    });
  },
}));
