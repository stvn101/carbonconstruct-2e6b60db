
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, Loader2 } from "lucide-react";
import MaterialDetails from "./MaterialDetails";
import { ExtendedMaterialData } from "@/lib/materials/materialTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";
import { Skeleton } from "@/components/ui/skeleton";

interface MaterialTableProps {
  filteredMaterials: ExtendedMaterialData[];
  resetFilters: () => void;
  loading?: boolean;
}

const MaterialTable: React.FC<MaterialTableProps> = ({ 
  filteredMaterials, 
  resetFilters,
  loading = false
}) => {
  if (!filteredMaterials || !Array.isArray(filteredMaterials)) {
    console.error("Invalid filtered materials data:", filteredMaterials);
    return (
      <div className="text-center py-6">
        <Database className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground mt-2">No materials data available.</p>
      </div>
    );
  }
  
  // Loading skeleton
  if (loading && filteredMaterials.length === 0) {
    return (
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material</TableHead>
              <TableHead className="text-right">Carbon Factor</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Alternative For</TableHead>
              <TableHead>Sustainability</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3, 4, 5].map((i) => (
              <TableRow key={`loading-${i}`}>
                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                <TableCell><Skeleton className="h-5 w-24 ml-auto" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <p className="text-sm text-muted-foreground mt-2 flex items-center">
          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
          Loading materials...
        </p>
      </div>
    );
  }
  
  return (
    <ErrorBoundaryWrapper feature="Materials Table">
      <Table>
        <TableCaption>
          Comprehensive database of construction materials and their carbon footprints
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead className="text-right">Carbon Factor</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Alternative For</TableHead>
            <TableHead>Sustainability</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && filteredMaterials.length > 0 ? (
            // Show loading overlay on existing data
            filteredMaterials.map((material, index) => (
              <TableRow key={`loading-row-${index}`} className="opacity-50">
                <TableCell colSpan={7} className="h-16 relative">
                  <div className="absolute inset-0 flex items-center justify-center bg-background/50">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            // Show actual material data
            filteredMaterials.map((material, index) => {
              if (!material) return null;
              
              return (
                <TableRow 
                  key={material.name + '-' + index} 
                  className={material.region?.includes("Australia") 
                    ? "bg-carbon-50 dark:bg-carbon-800/20" 
                    : ""}
                >
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell className="text-right">
                    {material.factor} kg CO₂e/{material.unit || 'kg'}
                  </TableCell>
                  <TableCell>
                    {material.region?.split(", ").map((region) => (
                      <Badge 
                        key={region}
                        variant={region === "Australia" ? "secondary" : "outline"} 
                        className="mr-1"
                      >
                        {region}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    {material.alternativeTo ? 
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="cursor-help">
                              {material.alternativeTo}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                            <p>Alternative to standard material</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {material.sustainabilityScore && (
                      <Badge 
                        variant={
                          material.sustainabilityScore >= 80 ? "default" :
                          material.sustainabilityScore >= 60 ? "secondary" : "destructive"
                        }
                        className={
                          material.sustainabilityScore >= 80 ? "bg-green-500 hover:bg-green-600" :
                          material.sustainabilityScore >= 60 ? "bg-amber-500 hover:bg-amber-600" : ""
                        }
                      >
                        {material.sustainabilityScore}/100
                      </Badge>
                    )}
                    {material.recyclability && (
                      <Badge variant="outline" className="ml-1">
                        {material.recyclability} Recyclability
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {material.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ErrorBoundaryWrapper feature="Material Details">
                      <MaterialDetails material={material} />
                    </ErrorBoundaryWrapper>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
      
      {filteredMaterials.length === 0 && !loading && (
        <div className="text-center py-6">
          <Database className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mt-2">No materials found matching your criteria.</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      )}
    </ErrorBoundaryWrapper>
  );
};

export default MaterialTable;
