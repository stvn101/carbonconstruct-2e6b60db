
import React from 'react';
import { Database } from 'lucide-react';
import RegionStats from './RegionStats';
import { MaterialsByRegion } from '@/lib/materialTypes';
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface DatabaseHeaderProps {
  globalRegion: string;
  materialsByRegion: MaterialsByRegion;
  cacheInfo?: {
    lastUpdated: Date | null;
    itemCount: number | null;
  };
}

const DatabaseHeader = ({ materialsByRegion, cacheInfo }: DatabaseHeaderProps) => {
  // Format the last updated time
  const formattedLastUpdated = cacheInfo?.lastUpdated 
    ? new Intl.DateTimeFormat('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }).format(cacheInfo.lastUpdated)
    : 'Never';

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
      
      {/* Cache status indicator */}
      {cacheInfo?.lastUpdated && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="mt-2 flex justify-center">
                <Badge variant="outline" className="text-xs cursor-help">
                  {cacheInfo.itemCount} materials cached • Last updated: {formattedLastUpdated}
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">
                Materials are cached locally for faster loading. 
                Click "Refresh Data" to get the latest materials.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      
      <ErrorBoundaryWrapper feature="Region Stats">
        {materialsByRegion && Object.keys(materialsByRegion).length > 0 && (
          <RegionStats materialsByRegion={materialsByRegion} />
        )}
      </ErrorBoundaryWrapper>
    </div>
  );
};

export default DatabaseHeader;
