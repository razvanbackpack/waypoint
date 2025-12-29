import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import type { Item } from '@/api/types';
import type { Recipe } from '@/api/types/crafting';

interface GameDataContextType {
  items: Item[];
  recipes: Recipe[];
  isLoading: boolean;
  error: string | null;

  // Lookup functions
  getItem: (id: number) => Item | undefined;
  getRecipe: (id: number) => Recipe | undefined;
  getRecipeByOutput: (itemId: number) => Recipe | undefined;
  searchItems: (query: string, limit?: number) => Item[];
  searchRecipes: (query: string, limit?: number) => Recipe[];
}

const GameDataContext = createContext<GameDataContextType | null>(null);

export function GameDataProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data once on mount
  useEffect(() => {
    async function loadData() {
      try {
        const [items1Res, items2Res, items3Res, recipesRes] = await Promise.all([
          fetch('/data/items-1.json'),
          fetch('/data/items-2.json'),
          fetch('/data/items-3.json'),
          fetch('/data/recipes.json')
        ]);

        if (!items1Res.ok || !items2Res.ok || !items3Res.ok || !recipesRes.ok) {
          setError('Failed to load game data');
          return;
        }

        const [items1, items2, items3, recipesData] = await Promise.all([
          items1Res.json(),
          items2Res.json(),
          items3Res.json(),
          recipesRes.json()
        ]);

        setItems([...items1, ...items2, ...items3]);
        setRecipes(recipesData);
      } catch (err) {
        setError('Failed to load game data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  // Create lookup maps (memoized)
  const itemMap = useMemo(() => new Map(items.map(i => [i.id, i])), [items]);
  const recipeMap = useMemo(() => new Map(recipes.map(r => [r.id, r])), [recipes]);
  const recipeByOutputMap = useMemo(() => new Map(recipes.map(r => [r.output_item_id, r])), [recipes]);

  // Lookup functions
  const getItem = (id: number) => itemMap.get(id);
  const getRecipe = (id: number) => recipeMap.get(id);
  const getRecipeByOutput = (itemId: number) => recipeByOutputMap.get(itemId);

  const searchItems = (query: string, limit = 50) => {
    const q = query.toLowerCase();
    return items.filter(i => i.name.toLowerCase().includes(q)).slice(0, limit);
  };

  const searchRecipes = (query: string, limit = 50) => {
    const q = query.toLowerCase();
    return recipes.filter(r => {
      const item = itemMap.get(r.output_item_id);
      return item?.name.toLowerCase().includes(q);
    }).slice(0, limit);
  };

  const value: GameDataContextType = {
    items,
    recipes,
    isLoading,
    error,
    getItem,
    getRecipe,
    getRecipeByOutput,
    searchItems,
    searchRecipes,
  };

  return (
    <GameDataContext.Provider value={value}>
      {children}
    </GameDataContext.Provider>
  );
}

export function useGameData() {
  const context = useContext(GameDataContext);
  if (!context) {
    throw new Error('useGameData must be used within a GameDataProvider');
  }
  return context;
}
