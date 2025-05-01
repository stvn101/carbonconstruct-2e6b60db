
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MaterialTable from './MaterialTable';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';

interface DatabaseResultsCardProps {
  filteredMaterials: ExtendedMaterialData[];
  resetFilters: () => void;
  materialCount: number;
}

const DatabaseResultsCard = ({ 
  filteredMaterials, 
  resetFilters,
  materialCount
}: DatabaseResultsCardProps) => {
  return (
    <Card className="border-carbon-200 dark:border-carbon-700">
      <CardHeader>
        <CardTitle>Construction Materials</CardTitle>
        <CardDescription>
          Carbon coefficients and alternatives for sustainable construction in Australia
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MaterialTable 
          filteredMaterials={filteredMaterials} 
          resetFilters={resetFilters} 
        />
        
        <p className="text-sm text-muted-foreground mt-2">
          Showing {filteredMaterials.length} of {materialCount} materials
        </p>
      </CardContent>
    </Card>
  );
};

export default DatabaseResultsCard;
