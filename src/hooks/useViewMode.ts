import { useViewModeStore } from '../store/viewModeStore';

/**
 * Custom hook to access view mode state
 * Provides easy access to current view mode and selected character
 */
export function useViewMode() {
  const selectedCharacter = useViewModeStore((state) => state.selectedCharacter);

  return {
    viewMode: selectedCharacter ? 'character' : 'account',
    selectedCharacter,
    isAccountView: !selectedCharacter,
    isCharacterView: !!selectedCharacter,
  };
}
