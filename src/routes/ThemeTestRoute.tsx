
import React from 'react';
import ThemeTestEnhanced from '@/components/ThemeTestEnhanced';

const ThemeTestRoute: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-4">
        <ThemeTestEnhanced />
      </div>
    </div>
  );
};

export default ThemeTestRoute;
