import { useViewModeStore } from '../store/viewModeStore';

/**
 * Custom hook to access view mode state
 * Provides easy access to current view mode and selected character
 */
export function useViewMode() {
  const { viewMode, selectedCharacter } = useViewModeStore();

  return {
    viewMode,
    selectedCharacter,
    isAccountView: viewMode === 'account',
    isCharacterView: viewMode === 'character',
  };
}
