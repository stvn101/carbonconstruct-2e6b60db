
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MaterialTableRowProps {
  material: any;
  index: number;
}

export const MaterialTableRow: React.FC<MaterialTableRowProps> = ({ material, index }) => {
  if (!material || !material.name) return null;
  
  const rowVariant = index % 2 === 0 ? "bg-background" : "bg-muted/30";
  
  // Format carbon footprint value with 2 decimal places if it exists
  const formattedCarbonFootprint = material.carbon_footprint_kgco2e_kg !== undefined && 
    material.carbon_footprint_kgco2e_kg !== null
    ? `${material.carbon_footprint_kgco2e_kg.toFixed(2)} kg CO₂e/kg`
    : "N/A";

  return (
    <TableRow className={rowVariant}>
      <TableCell className="font-medium">
        <div>{material.name}</div>
        <div className="sm:hidden text-xs text-muted-foreground mt-1">
          {material.category || "Uncategorized"}
        </div>
      </TableCell>
      
      <TableCell className="hidden sm:table-cell">{material.category || "Uncategorized"}</TableCell>
      
      <TableCell>
        <span className="font-medium">{formattedCarbonFootprint}</span>
        {material.alternativeto && (
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            Alternative to: {material.alternativeto}
          </div>
        )}
      </TableCell>
      
      <TableCell className="hidden md:table-cell">
        {material.region || "Global"}
      </TableCell>
      
      <TableCell className="hidden lg:table-cell">
        <div className="flex flex-wrap gap-1">
          {Array.isArray(material.tags) && material.tags.length > 0 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-wrap gap-1 max-w-[150px] overflow-hidden">
                    {material.tags.slice(0, 2).map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs whitespace-nowrap">
                        {tag}
                      </Badge>
                    ))}
                    {material.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{material.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[250px]">
                  <div className="flex flex-wrap gap-1">
                    {material.tags.map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span className="text-xs text-muted-foreground">No tags</span>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
