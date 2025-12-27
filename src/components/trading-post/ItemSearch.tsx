import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Star, Loader2 } from 'lucide-react';
import { useTradableItems } from '@/api/hooks/useTradableItems';
import type { Item } from '@/api/types';

const RECENT_SEARCHES_KEY = 'gw2-tools-recent-searches';
const MAX_RECENT_SEARCHES = 10;

interface ItemSearchProps {
  onSelectItem: (item: Item) => void;
  onAddToWatchlist?: (itemId: number) => void;
}

interface SearchResult extends Item {
  score?: number;
}

export function ItemSearch({ onSelectItem, onAddToWatchlist }: ItemSearchProps) {
  const { searchItems, isLoading: isLoadingCache } = useTradableItems();
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [recentSearches, setRecentSearches] = useState<Item[]>([]);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed);
        }
      } catch (error) {
        console.error('Failed to load recent searches:', error);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchTerm.trim().length < 2) {
      setSearchResults([]);
      setShowDropdown(searchTerm.length === 0 && recentSearches.length > 0);
      return;
    }

    setIsSearching(true);

    searchTimeoutRef.current = setTimeout(() => {
      try {
        // Use the cached items for instant search
        const results = searchItems(searchTerm, 20);
        setSearchResults(results);
        setShowDropdown(true);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // 300ms debounce

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, recentSearches.length, searchItems]);

  const saveToRecentSearches = (item: Item) => {
    const updated = [
      item,
      ...recentSearches.filter((i) => i.id !== item.id),
    ].slice(0, MAX_RECENT_SEARCHES);

    setRecentSearches(updated);
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  };

  const handleSelectItem = (item: Item) => {
    saveToRecentSearches(item);
    onSelectItem(item);
    setSearchTerm('');
    setShowDropdown(false);
    setSearchResults([]);
  };

  const handleAddToWatchlist = (item: Item, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onAddToWatchlist) {
      onAddToWatchlist(item.id);
    }
  };

  const getRarityClass = (rarity: string) => `rarity-${rarity.toLowerCase()}`;

  const displayResults = searchTerm.trim().length >= 2 ? searchResults : recentSearches;
  const showRecentLabel = searchTerm.trim().length === 0 && recentSearches.length > 0;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={isLoadingCache ? "Loading item database..." : "Search for items..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            if (recentSearches.length > 0 || searchResults.length > 0) {
              setShowDropdown(true);
            }
          }}
          disabled={isLoadingCache}
          className="pl-9 pr-4"
        />
        {(isSearching || isLoadingCache) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>

      {showDropdown && displayResults.length > 0 && (
        <Card className="absolute z-50 w-full mt-2 max-h-96 overflow-y-auto shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="py-2">
            {showRecentLabel && (
              <div className="px-4 py-2 text-xs font-medium text-muted-foreground">
                Recent Searches
              </div>
            )}
            {displayResults.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-4 py-2 hover:bg-muted/50 cursor-pointer transition-colors duration-200"
                onClick={() => handleSelectItem(item)}
              >
                {item.icon && (
                  <img
                    loading="lazy"
                    src={item.icon}
                    alt={item.name}
                    className={`w-10 h-10 rounded flex-shrink-0 border-2 ${getRarityClass(item.rarity)} rarity-border`}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium truncate ${getRarityClass(item.rarity)} rarity-text`}
                  >
                    {item.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.type} • {item.rarity}
                  </div>
                </div>
                {onAddToWatchlist && (
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={(e) => handleAddToWatchlist(item, e)}
                    className="flex-shrink-0 hover:text-primary"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
