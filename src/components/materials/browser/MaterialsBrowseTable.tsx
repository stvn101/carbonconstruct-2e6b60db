
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, Database } from "lucide-react";
import MaterialDetailsDialog from "./MaterialDetailsDialog";
import SortIndicator from "./SortIndicator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EnrichedMaterial } from "@/utils/materialUtils";

interface MaterialsBrowseTableProps {
  sortedMaterials: EnrichedMaterial[];
  sortField: keyof EnrichedMaterial;
  sortDirection: "asc" | "desc";
  handleSort: (field: keyof EnrichedMaterial) => void;
  totalMaterialCount: number;
}

const MaterialsBrowseTable: React.FC<MaterialsBrowseTableProps> = ({
  sortedMaterials,
  sortField,
  sortDirection,
  handleSort,
  totalMaterialCount,
}) => (
  <div>
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("factor")}>
              <div className="flex items-center">
                Emission Factor
                <SortIndicator
                  active={sortField === "factor"}
                  direction={sortDirection}
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-60">
                        Emissions per kg of material (kg CO₂e/kg)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </TableHead>
            <TableHead
              className="hidden md:table-cell cursor-pointer"
              onClick={() => handleSort("sustainabilityScore")}
            >
              <div className="flex items-center">
                Sustainability
                <SortIndicator active={sortField === "sustainabilityScore"} direction={sortDirection} />
              </div>
            </TableHead>
            <TableHead className="text-right">Details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedMaterials.map(material => (
            <TableRow key={material.type}>
              <TableCell>
                <div>
                  {material.type}
                  {material.alternativeToStandard && (
                    <Badge className="ml-2 bg-green-600">Eco</Badge>
                  )}
                </div>
                <div className="md:hidden text-xs text-muted-foreground mt-1">
                  {material.category}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {material.category}
              </TableCell>
              <TableCell>
                {material.factor} kg CO₂e/kg
                {material.carbonReduction > 0 && (
                  <div className="text-xs text-green-600 font-medium mt-1">
                    {material.carbonReduction}% less CO₂
                  </div>
                )}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mr-2">
                    <div
                      className="bg-carbon-600 h-2.5 rounded-full"
                      style={{ width: `${material.sustainabilityScore}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium">{material.sustainabilityScore}</span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <MaterialDetailsDialog material={material} />
              </TableCell>
            </TableRow>
          ))}
          {sortedMaterials.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                <Database className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p>No materials found matching your filters</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
    <p className="text-sm text-muted-foreground mt-2">
      Showing {sortedMaterials.length} of {totalMaterialCount} materials
    </p>
  </div>
);

export default MaterialsBrowseTable;
