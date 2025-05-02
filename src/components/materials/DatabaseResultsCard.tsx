
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MaterialTable from './MaterialTable';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { Loader2 } from 'lucide-react';

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
        <MaterialTable 
          filteredMaterials={filteredMaterials} 
          resetFilters={resetFilters} 
          loading={loading}
        />
        
        <p className="text-sm text-muted-foreground mt-2">
          Showing {filteredMaterials.length} of {totalCount || materialCount} materials
        </p>
      </CardContent>
    </Card>
  );
};

export default DatabaseResultsCard;
