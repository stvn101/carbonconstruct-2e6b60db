
import React from 'react';

interface TabErrorDisplayProps {
  error: string | null;
}

const TabErrorDisplay: React.FC<TabErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-4" role="alert">
      <p className="font-medium">{error}</p>
    </div>
  );
};

export default TabErrorDisplay;
