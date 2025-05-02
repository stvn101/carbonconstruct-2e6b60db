
import React from 'react';
import { Database } from 'lucide-react';
import RegionStats from './RegionStats';
import { MaterialsByRegion } from '@/lib/materialTypes';
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";

interface DatabaseHeaderProps {
  globalRegion: string;
  materialsByRegion: MaterialsByRegion;
}

const DatabaseHeader = ({ materialsByRegion }: DatabaseHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-carbon-100">
          <Database className="h-6 w-6 text-carbon-700" />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2">
        Australian Material Database
      </h1>
      <p className="text-lg text-muted-foreground">
        Comprehensive database of construction materials with carbon coefficients across Australia
      </p>
      
      <ErrorBoundaryWrapper feature="Region Stats">
        {materialsByRegion && Object.keys(materialsByRegion).length > 0 && (
          <RegionStats materialsByRegion={materialsByRegion} />
        )}
      </ErrorBoundaryWrapper>
    </div>
  );
};

export default DatabaseHeader;
