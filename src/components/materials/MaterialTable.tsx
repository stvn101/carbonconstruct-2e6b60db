
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
import { Database } from "lucide-react";
import MaterialDetails from "./MaterialDetails";
import { ExtendedMaterialData } from "@/lib/materials/materialTypes";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";

interface MaterialTableProps {
  filteredMaterials: ExtendedMaterialData[];
  resetFilters: () => void;
}

const MaterialTable: React.FC<MaterialTableProps> = ({ filteredMaterials, resetFilters }) => {
  if (!filteredMaterials || !Array.isArray(filteredMaterials)) {
    console.error("Invalid filtered materials data:", filteredMaterials);
    return (
      <div className="text-center py-6">
        <Database className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
        <p className="text-muted-foreground mt-2">No materials data available.</p>
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
          {filteredMaterials.map((material, index) => {
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
          })}
        </TableBody>
      </Table>
      
      {filteredMaterials.length === 0 && (
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
