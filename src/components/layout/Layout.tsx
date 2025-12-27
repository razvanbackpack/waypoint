import type { ReactNode } from 'react';
import { Navigation } from './Navigation';
import { useTheme } from '../../hooks/useTheme';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  useTheme();

  return (
    <div className="min-h-screen bg-painterly">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
        {children}
      </main>
    </div>
  );
}
