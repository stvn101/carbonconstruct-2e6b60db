
import React from 'react';
import { Search } from 'lucide-react';

const MaterialAnalysisEmpty: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="h-16 w-16 rounded-full bg-carbon-100 dark:bg-carbon-800 flex items-center justify-center">
        <Search className="h-8 w-8 text-carbon-500" />
      </div>
      <div className="text-center">
        <h3 className="font-medium mb-1">No Analysis Available</h3>
        <p className="text-sm text-muted-foreground">
          Run an analysis to get sustainability insights for your materials
        </p>
      </div>
    </div>
  );
};

export default MaterialAnalysisEmpty;
