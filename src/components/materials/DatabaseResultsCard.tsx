
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MaterialTable from './MaterialTable';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { Loader2, Database } from 'lucide-react';

interface DatabaseResultsCardProps {
  filteredMaterials: ExtendedMaterialData[];
  resetFilters: () => void;
  materialCount: number;
  totalCount?: number;
  loading?: boolean;
}

const DatabaseResultsCard = ({ 
  filteredMaterials, 
  resetFilters,
  materialCount,
  totalCount = 0,
  loading = false
}: DatabaseResultsCardProps) => {
  const displayCount = totalCount || materialCount;
  
  return (
    <Card className="border-carbon-200 dark:border-carbon-700">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Construction Materials</span>
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </CardTitle>
        <CardDescription>
          Carbon coefficients and alternatives for sustainable construction in Australia
        </CardDescription>
      </CardHeader>
      <CardContent>
        {filteredMaterials.length > 0 ? (
          <>
            <MaterialTable 
              filteredMaterials={filteredMaterials} 
              resetFilters={resetFilters} 
              loading={loading}
            />
            
            <p className="text-sm text-muted-foreground mt-2">
              Showing {filteredMaterials.length} of {displayCount} materials
            </p>
          </>
        ) : (
          <div className="text-center py-8">
            <Database className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
            <p className="text-lg font-medium">No materials found</p>
            <p className="text-sm text-muted-foreground mb-4">Try changing your search criteria or removing filters</p>
            <button 
              onClick={resetFilters}
              className="px-4 py-2 bg-carbon-600 hover:bg-carbon-700 text-white rounded-md text-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DatabaseResultsCard;
