import type { ReactNode } from 'react';
import { Github } from 'lucide-react';
import { Navigation } from './Navigation';
import { useTheme } from '../../hooks/useTheme';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useTheme();

  return (
    <div className="min-h-screen bg-painterly flex flex-col">
      <Navigation />
      <main className="w-full max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 flex-1">
        {children}
      </main>
      <footer className="border-t border-border/50 py-4 text-center text-sm text-muted-foreground">
        <a
          href="https://github.com/razvanbackpack/waypoint"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-gw2-accent hover:underline"
        >
          <Github className="h-4 w-4" />
          Waypoint
        </a>
        {' '}• Not affiliated with ArenaNet
      </footer>
    </div>
  );
}
