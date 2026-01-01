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
      <footer className="mx-4 mb-4 border-t border-primary/30 py-4">
        <div className="flex items-center justify-center gap-2 text-sm">
          <a
            href="https://github.com/razvanbackpack/waypoint"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] group"
          >
            <Github className="h-4 w-4 text-gw2-accent transition-transform duration-200 group-hover:scale-110" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gw2-accent to-gw2-accent-light font-semibold">
              Waypoint
            </span>
          </a>
          <span className="text-muted-foreground/70">•</span>
          <span className="text-muted-foreground/70">Not affiliated with ArenaNet</span>
        </div>
      </footer>
    </div>
  );
}
