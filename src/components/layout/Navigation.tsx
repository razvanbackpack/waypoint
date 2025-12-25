import { useState, useEffect } from 'react';
import { Link, useRouterState, useNavigate } from '@tanstack/react-router';
import { Check, X, Menu, XIcon, User, TrendingUp, Clock, CalendarCheck, Hammer, Database } from 'lucide-react';
import { Button } from '../ui/button';
import { useApiKey } from '../../api/hooks/useApiKey';
import { useCharacters } from '../../api/hooks/useGW2Api';
import { useViewModeStore } from '../../store/viewModeStore';
import { ThemeToggle } from './ThemeToggle';
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
    navigate({ to: '/' });
  };

  // Get display value for the select
  const getDisplayValue = () => {
    return selectedCharacter || 'Select Character';
  };

  const isActive = (path: string) => currentPath === path;

  return (
    <>
      <nav className="bg-card border-b-2 border-primary/30 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Logo/Title */}
            <Link
              to="/"
              className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity"
            >
              <span className="text-xl font-bold tracking-wide">
                <span className="text-gw2-gold">Waypoint</span>
              </span>
            </Link>

            {/* Center: Navigation Links */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {/* Trading Post Button - Desktop Only */}
              <Button variant="ghost" size="sm" asChild className="h-9 w-9 md:w-auto md:px-2 lg:px-3 lg:gap-2">
                <Link
                  to="/trading-post"
                  className={cn(
                    "transition-all duration-200 relative",
                    isActive('/trading-post') && "text-gw2-gold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:glow-gold-sm"
                  )}
                >
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden lg:inline text-sm font-medium">TP</span>
                </Link>
              </Button>

              {/* Crafting Button */}
              <Button variant="ghost" size="sm" asChild className="h-9 w-9 md:w-auto md:px-2 lg:px-3 lg:gap-2">
                <Link
                  to="/crafting"
                  className={cn(
                    "transition-all duration-200 relative",
                    isActive('/crafting') && "text-gw2-gold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:glow-gold-sm"
                  )}
                >
                  <Hammer className="h-4 w-4" />
                  <span className="hidden lg:inline text-sm font-medium">Craft</span>
                </Link>
              </Button>

              {/* Events Button */}
              <Button variant="ghost" size="sm" asChild className="h-9 w-9 md:w-auto md:px-2 lg:px-3 lg:gap-2">
                <Link
                  to="/timers"
                  className={cn(
                    "transition-all duration-200 relative",
                    isActive('/timers') && "text-gw2-gold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:glow-gold-sm"
                  )}
                >
                  <Clock className="h-4 w-4" />
                  <span className="hidden lg:inline text-sm font-medium">Events</span>
                </Link>
              </Button>

              {/* Dailies Button */}
              <Button variant="ghost" size="sm" asChild className="h-9 w-9 md:w-auto md:px-2 lg:px-3 lg:gap-2">
                <Link
                  to="/dailies"
                  className={cn(
                    "transition-all duration-200 relative",
                    isActive('/dailies') && "text-gw2-gold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:glow-gold-sm"
                  )}
                >
                  <CalendarCheck className="h-4 w-4" />
                  <span className="hidden lg:inline text-sm font-medium">Daily</span>
                </Link>
              </Button>

              {/* Settings Button with Connection Status */}
              <Button variant="ghost" size="sm" asChild className="h-9 w-9 md:w-auto md:px-2 lg:px-3 lg:gap-2 relative">
                <Link
                  to="/settings"
                  className={cn(
                    "transition-all duration-200 relative",
                    isActive('/settings') && "text-gw2-gold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:glow-gold-sm"
                  )}
                >
                  <Database className="h-4 w-4" />
                  <span className="hidden lg:inline text-sm font-medium">Settings</span>
                  {/* Connection Status Indicator */}
                  <span
                    className={cn(
                      "absolute top-1 right-1 h-2 w-2 rounded-full ring-1 ring-card",
                      hasApiKey ? "bg-green-500" : "bg-red-500"
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

              {/* Theme Toggle */}
              <ThemeToggle />
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
            <div className="md:hidden py-4 space-y-2 border-t border-border animate-fade-in">
              <Link
                to="/trading-post"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive('/trading-post')
                    ? 'bg-primary/10 text-gw2-gold'
                    : 'text-foreground/80 hover:bg-muted'
                )}
              >
                <TrendingUp className="h-4 w-4" />
                <span>Trading Post</span>
              </Link>
              <Link
                to="/crafting"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive('/crafting')
                    ? 'bg-primary/10 text-gw2-gold'
                    : 'text-foreground/80 hover:bg-muted'
                )}
              >
                <Hammer className="h-4 w-4" />
                <span>Crafting</span>
              </Link>
              <Link
                to="/timers"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive('/timers')
                    ? 'bg-primary/10 text-gw2-gold'
                    : 'text-foreground/80 hover:bg-muted'
                )}
              >
                <Clock className="h-4 w-4" />
                <span>Events</span>
              </Link>
              <Link
                to="/dailies"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive('/dailies')
                    ? 'bg-primary/10 text-gw2-gold'
                    : 'text-foreground/80 hover:bg-muted'
                )}
              >
                <CalendarCheck className="h-4 w-4" />
                <span>Daily</span>
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200",
                  isActive('/settings')
                    ? 'bg-primary/10 text-gw2-gold'
                    : 'text-foreground/80 hover:bg-muted'
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

                {/* Mobile Theme Toggle */}
                <ThemeToggle />

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
