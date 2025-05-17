
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
  // Use either the carbon_footprint_kgco2e_kg or factor field
  const carbonFootprint = material.carbon_footprint_kgco2e_kg ?? material.factor ?? 0;
  const formattedCarbonFootprint = `${carbonFootprint.toFixed(2)} kg CO₂e/kg`;

  // Use the category field instead of directly accessing the category property
  const materialCategory = material.category || "Uncategorized";
  
  // Extract tags - either use the tags array or create from category
  const materialTags = Array.isArray(material.tags) && material.tags.length > 0
    ? material.tags
    : [materialCategory];
    
  // Determine if this is an alternative material
  const isAlternative = !!material.alternativeTo;

  return (
    <TableRow className={rowVariant}>
      <TableCell className="font-medium">
        <div>{material.name}</div>
        <div className="sm:hidden text-xs text-muted-foreground mt-1">
          {materialCategory}
        </div>
      </TableCell>
      
      <TableCell className="hidden sm:table-cell">{materialCategory}</TableCell>
      
      <TableCell>
        <span className="font-medium">{formattedCarbonFootprint}</span>
        {material.alternativeTo && (
          <div className="text-xs text-green-600 dark:text-green-400 mt-1">
            Alternative to: {material.alternativeTo}
          </div>
        )}
      </TableCell>
      
      <TableCell className="hidden md:table-cell">
        {material.region || "Australia"}
      </TableCell>
      
      <TableCell className="hidden lg:table-cell">
        <div className="flex flex-wrap gap-1">
          {materialTags.length > 0 ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex flex-wrap gap-1 max-w-[150px] overflow-hidden">
                    {materialTags.slice(0, 2).map((tag: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs whitespace-nowrap">
                        {tag}
                      </Badge>
                    ))}
                    {materialTags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{materialTags.length - 2}
                      </Badge>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[250px]">
                  <div className="flex flex-wrap gap-1">
                    {materialTags.map((tag: string, i: number) => (
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
