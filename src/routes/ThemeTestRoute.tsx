
import React from 'react';
import ThemeTest from '@/components/ThemeTest';

const ThemeTestRoute: React.FC = () => {
  return (
    <div className="container mx-auto pt-20">
      <h1 className="text-2xl font-bold mb-4">Theme Test Page</h1>
      <p className="mb-8 text-muted-foreground">
        This page is for testing theme consistency across the application.
        It should only be used during development.
      </p>
      
      <ThemeTest />
    </div>
  );
};

export default ThemeTestRoute;
