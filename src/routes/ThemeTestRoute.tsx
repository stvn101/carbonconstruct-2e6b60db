
import React from 'react';
import ThemeTest from '@/components/ThemeTest';
import { ThemeToggle } from '@/components/ThemeToggle';

const ThemeTestRoute: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Theme Test Page</h1>
            <p className="text-muted-foreground">
              Use this page to verify theme consistency across the application.
            </p>
          </div>
          <ThemeToggle />
        </div>
        
        <div className="rounded-lg border border-border bg-card p-4">
          <ThemeTest />
        </div>
      </div>
    </div>
  );
};

export default ThemeTestRoute;
