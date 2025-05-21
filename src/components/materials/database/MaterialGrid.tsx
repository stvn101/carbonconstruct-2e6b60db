
import React from "react";
import { Grid } from "@/components/ui/grid";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExtendedMaterialData } from "@/lib/materials/materialTypes";
import { Recycle, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MaterialGridProps {
  materials: ExtendedMaterialData[];
  loading?: boolean;
}

const MaterialGrid: React.FC<MaterialGridProps> = ({ materials, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={`skeleton-${i}`} className="h-64">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-4/5 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-6 w-1/3" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (!materials || materials.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium">No materials found</h3>
        <p className="text-muted-foreground mt-1">Try adjusting your filters or search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {materials.map((material) => (
        <Card key={material.id} className="flex flex-col h-full">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium truncate">{material.name}</h3>
                {material.category && (
                  <p className="text-sm text-muted-foreground">{material.category}</p>
                )}
              </div>
              {material.alternativeTo && (
                <Badge variant="outline" className="text-xs">
                  Alternative
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Carbon footprint:</span>
                <span className="font-medium">
                  {material.carbon_footprint_kgco2e_kg?.toFixed(2) || material.factor?.toFixed(2) || "N/A"} kg CO₂e/{material.unit || "kg"}
                </span>
              </div>
              {material.region && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Region:</span>
                  <span>{material.region}</span>
                </div>
              )}
              {material.sustainabilityScore !== undefined && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sustainability:</span>
                  <span>{material.sustainabilityScore}/100</span>
                </div>
              )}
              {material.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {material.description}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="pt-2 border-t">
            {material.recyclability && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Recycle className="h-3 w-3 mr-1 text-green-600" />
                Recyclability: <span className="font-medium ml-1">{material.recyclability}</span>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default MaterialGrid;
