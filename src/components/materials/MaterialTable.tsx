
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
import { Database, Info } from "lucide-react";
import MaterialDetails from "./MaterialDetails";
import { MATERIAL_FACTORS } from "@/lib/carbonCalculations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExtendedMaterialData {
  name: string;
  factor: number;
  unit: string;
  region?: string;
  alternativeTo?: string;
  notes?: string;
  tags?: string[];
  sustainabilityScore?: number;
  recyclability?: "High" | "Medium" | "Low";
}

interface MaterialTableProps {
  filteredMaterials: Array<[string, ExtendedMaterialData]>;
  resetFilters: () => void;
}

const MaterialTable: React.FC<MaterialTableProps> = ({ filteredMaterials, resetFilters }) => {
  return (
    <>
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
          {filteredMaterials.map(([key, material]) => (
            <TableRow 
              key={key} 
              className={material.region?.includes("Australia") 
                ? "bg-carbon-50 dark:bg-carbon-800/20" 
                : ""}
            >
              <TableCell className="font-medium">{material.name}</TableCell>
              <TableCell className="text-right">
                {material.factor} kg CO₂e/{material.unit}
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
                          {MATERIAL_FACTORS[material.alternativeTo as keyof typeof MATERIAL_FACTORS]?.name}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
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
                <MaterialDetails material={material} />
              </TableCell>
            </TableRow>
          ))}
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
    </>
  );
};

export default MaterialTable;
