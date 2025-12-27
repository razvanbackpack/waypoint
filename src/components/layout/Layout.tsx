import type { ReactNode } from 'react';
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
        Built by{' '}
        <a
          href="https://github.com/razvanbackpack"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gw2-gold hover:underline"
        >
          razvanbackpack
        </a>
        {' '}• Not affiliated with ArenaNet
      </footer>
    </div>
  );
}
