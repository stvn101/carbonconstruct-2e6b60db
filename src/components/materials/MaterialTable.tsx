
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
import { MATERIAL_FACTORS } from "@/lib/carbonCalculations";

interface ExtendedMaterialData {
  name: string;
  factor: number;
  unit: string;
  region?: string;
  alternativeTo?: string;
  notes?: string;
  tags?: string[];
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
          Comprehensive database of construction materials and their carbon footprints.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Material</TableHead>
            <TableHead className="text-right">Carbon Factor (kg CO2e/{"{unit}"})</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Alternative For</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMaterials.map(([key, material]) => (
            <TableRow 
              key={key} 
              className={material.region?.includes("Australia") 
                ? "bg-carbon-50 dark:bg-carbon-800/20 data-[state=selected]:bg-carbon-100 dark:data-[state=selected]:bg-carbon-800/40" 
                : ""}
            >
              <TableCell className="font-medium">{material.name}</TableCell>
              <TableCell className="text-right">
                {material.factor} ({material.unit})
              </TableCell>
              <TableCell>
                {material.region?.includes("Australia") 
                  ? <Badge variant="secondary" className="bg-carbon-100 dark:bg-carbon-800 dark:text-carbon-200">Australia</Badge> 
                  : material.region || "Global"}
              </TableCell>
              <TableCell>
                {material.alternativeTo ? 
                  MATERIAL_FACTORS[material.alternativeTo as keyof typeof MATERIAL_FACTORS]?.name : 
                  ""}
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
              <TableCell className="max-w-xs truncate" title={material.notes}>
                <div className="flex items-center justify-between">
                  <span className="truncate mr-2">{material.notes || ""}</span>
                  <MaterialDetails material={material} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {filteredMaterials.length === 0 && (
        <div className="text-center py-6">
          <p className="text-muted-foreground">No materials found matching your search criteria.</p>
          <Button 
            variant="outline" 
            className="mt-2"
            onClick={resetFilters}
          >
            Clear Filters
          </Button>
        </div>
      )}
    </>
  );
};

export default MaterialTable;
