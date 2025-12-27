import { useState, useEffect } from 'react';
import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { Check, X, Menu, XIcon, User, Clock, CalendarCheck, Hammer, Database, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { useApiKey } from '../../api/hooks/useApiKey';
import { useCharacters } from '../../api/hooks/useGW2Api';
import { useViewModeStore } from '../../store/viewModeStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { cn } from '../../lib/utils';

export function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { hasApiKey } = useApiKey();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const navigate = useNavigate();

  // View mode store
  const { selectedCharacter, setSelectedCharacter, initializeFromConfig } = useViewModeStore();

  // Fetch character list
  const { data: characters = [], isLoading: isLoadingCharacters } = useCharacters({
    enabled: hasApiKey,
  });

  // Initialize view mode from config on mount
  useEffect(() => {
    initializeFromConfig();
  }, [initializeFromConfig]);

  // Auto-select first character when characters load and none is selected
  useEffect(() => {
    if (characters.length > 0 && !selectedCharacter) {
      setSelectedCharacter(characters[0]);
    }
  }, [characters, selectedCharacter, setSelectedCharacter]);

  // Handle character selection
  const handleViewChange = (value: string) => {
    setSelectedCharacter(value);
    // Navigate to characters page when a character is selected
    navigate({ to: '/characters' });
  };

  // Get display value for the select
  const getDisplayValue = () => {
    return selectedCharacter || 'Select Character';
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <>
      <nav className="bg-card/80 backdrop-blur-md border-b-2 border-primary/30 sticky top-0 z-50 shadow-lg bg-gradient-to-r from-card/90 via-card/80 to-card/90">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo/Title */}
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gw2-gold to-gw2-gold-light text-xl font-bold font-display tracking-wide drop-shadow-sm">
                Waypoint
              </span>
            </Link>

            {/* Center: Navigation Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {/* Events Button (Home) */}
              <Button variant="ghost" size="sm" asChild className="h-9 w-9 md:w-auto md:px-2 lg:px-3 lg:gap-2 hover:bg-primary/10 hover:text-gw2-gold">
                <Link
                  to="/"
                  className={cn(
                    "transition-all duration-200 relative",
                    isActive('/') && "text-gw2-gold bg-primary/5 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gw2-gold after:shadow-[0_0_8px_rgba(255,204,0,0.6)]"
                  )}
                >
                  <Clock className="h-4 w-4" />
                  <span className="hidden lg:inline text-sm font-medium">Events</span>
                </Link>
              </Button>

              {/* Characters Button */}
              <Button variant="ghost" size="sm" asChild className="h-9 w-9 md:w-auto md:px-2 lg:px-3 lg:gap-2 hover:bg-primary/10 hover:text-gw2-gold">
                <Link
                  to="/characters"
                  className={cn(
                    "transition-all duration-200 relative",
                    isActive('/characters') && "text-gw2-gold bg-primary/5 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gw2-gold after:shadow-[0_0_8px_rgba(255,204,0,0.6)]"
                  )}
                >
                  <Users className="h-4 w-4" />
                  <span className="hidden lg:inline text-sm font-medium">Characters</span>
                </Link>
              </Button>

              {/* Recipes Button */}
              <Button variant="ghost" size="sm" asChild className="h-9 w-9 md:w-auto md:px-2 lg:px-3 lg:gap-2 hover:bg-primary/10 hover:text-gw2-gold">
                <Link
                  to="/crafting"
                  className={cn(
                    "transition-all duration-200 relative",
                    isActive('/crafting') && "text-gw2-gold bg-primary/5 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gw2-gold after:shadow-[0_0_8px_rgba(255,204,0,0.6)]"
                  )}
                >
                  <Hammer className="h-4 w-4" />
                  <span className="hidden lg:inline text-sm font-medium">Recipes</span>
                </Link>
              </Button>

              {/* Objectives Button */}
              <Button variant="ghost" size="sm" asChild className="h-9 w-9 md:w-auto md:px-2 lg:px-3 lg:gap-2 hover:bg-primary/10 hover:text-gw2-gold">
                <Link
                  to="/dailies"
                  className={cn(
                    "transition-all duration-200 relative",
                    isActive('/dailies') && "text-gw2-gold bg-primary/5 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gw2-gold after:shadow-[0_0_8px_rgba(255,204,0,0.6)]"
                  )}
                >
                  <CalendarCheck className="h-4 w-4" />
                  <span className="hidden lg:inline text-sm font-medium">Objectives</span>
                </Link>
              </Button>

              {/* Settings Button with Connection Status */}
              <Button variant="ghost" size="sm" asChild className="h-9 w-9 md:w-auto md:px-2 lg:px-3 lg:gap-2 relative hover:bg-primary/10 hover:text-gw2-gold">
                <Link
                  to="/settings"
                  className={cn(
                    "transition-all duration-200 relative",
                    isActive('/settings') && "text-gw2-gold bg-primary/5 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gw2-gold after:shadow-[0_0_8px_rgba(255,204,0,0.6)]"
                  )}
                >
                  <Database className="h-4 w-4" />
                  <span className="hidden lg:inline text-sm font-medium">Settings</span>
                  {/* Connection Status Indicator */}
                  <span
                    className={cn(
                      "absolute top-1 right-1 h-2 w-2 rounded-full ring-1 ring-card",
                      hasApiKey ? "bg-green-500 animate-pulse" : "bg-destructive"
                    )}
                    aria-label={hasApiKey ? "Connected" : "Not Connected"}
                  />
                </Link>
              </Button>
            </div>

            {/* Right: Utilities */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {/* Character Selector */}
              {hasApiKey && (
                <Select
                  value={selectedCharacter || ''}
                  onValueChange={handleViewChange}
                  disabled={isLoadingCharacters}
                >
                  <SelectTrigger className="w-auto min-w-[100px] max-w-[120px] lg:min-w-[160px] lg:max-w-none h-9 bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 hidden lg:inline" />
                      <SelectValue className="truncate text-sm">
                        {getDisplayValue()}
                      </SelectValue>
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {characters.length > 0 && characters.map((character) => (
                      <SelectItem key={character} value={character}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span className="text-sm">{character}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-border animate-in slide-in-from-top-2 duration-200">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive('/')
                    ? 'bg-primary/10 text-gw2-gold'
                    : 'text-foreground/80 hover:bg-white/10'
                )}
              >
                <Clock className="h-4 w-4" />
                <span>Events</span>
              </Link>
              <Link
                to="/characters"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive('/characters')
                    ? 'bg-primary/10 text-gw2-gold'
                    : 'text-foreground/80 hover:bg-white/10'
                )}
              >
                <Users className="h-4 w-4" />
                <span>Characters</span>
              </Link>
              <Link
                to="/crafting"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive('/crafting')
                    ? 'bg-primary/10 text-gw2-gold'
                    : 'text-foreground/80 hover:bg-white/10'
                )}
              >
                <Hammer className="h-4 w-4" />
                <span>Recipes</span>
              </Link>
              <Link
                to="/dailies"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive('/dailies')
                    ? 'bg-primary/10 text-gw2-gold'
                    : 'text-foreground/80 hover:bg-white/10'
                )}
              >
                <CalendarCheck className="h-4 w-4" />
                <span>Objectives</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive('/settings')
                    ? 'bg-primary/10 text-gw2-gold'
                    : 'text-foreground/80 hover:bg-white/10'
                )}
              >
                <Database className="h-4 w-4" />
                <span>Settings</span>
              </Link>

              <div className="px-3 pt-3 border-t border-border space-y-3">
                {/* Mobile Character Selector */}
                {hasApiKey && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground px-1">
                      Character
                    </label>
                    <Select
                      value={selectedCharacter || ''}
                      onValueChange={handleViewChange}
                      disabled={isLoadingCharacters}
                    >
                      <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <SelectValue>
                            {getDisplayValue()}
                          </SelectValue>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {characters.length > 0 && characters.map((character) => (
                          <SelectItem key={character} value={character}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{character}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}


                {/* Mobile Connection Status */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted">
                  {hasApiKey ? (
                    <>
                      <Check className="h-4 w-4 text-green-500" />
                      <span className="text-sm font-medium text-green-500">Connected</span>
                    </>
                  ) : (
                    <>
                      <X className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-muted-foreground">Not Connected</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
