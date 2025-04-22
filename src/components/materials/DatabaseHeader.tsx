
import React from 'react';
import { Database } from 'lucide-react';
import RegionStats from './RegionStats';
import { MaterialsByRegion } from '@/lib/materialTypes';

interface DatabaseHeaderProps {
  globalRegion: string;
  materialsByRegion: MaterialsByRegion;
}

const DatabaseHeader = ({ globalRegion, materialsByRegion }: DatabaseHeaderProps) => {
  const getHeaderDescription = () => {
    // Since we only have Australia now, we return the Australian-specific description
    return "Comprehensive database of construction materials with carbon coefficients across Australia";
  };

  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-carbon-100">
          <Database className="h-6 w-6 text-carbon-700" />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2">
        Material Database
      </h1>
      <p className="text-lg text-muted-foreground">
        {getHeaderDescription()}
      </p>
      
      <RegionStats materialsByRegion={materialsByRegion} />
    </div>
  );
};

export default DatabaseHeader;
