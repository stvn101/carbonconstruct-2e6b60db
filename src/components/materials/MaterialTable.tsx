
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCaption
} from "@/components/ui/table";
import { ExtendedMaterialData } from "@/lib/materials/materialTypes";
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";
import { MaterialTableHeader } from "./table/MaterialTableHeader";
import { MaterialTableRow } from "./table/MaterialTableRow";
import { MaterialTableSkeleton } from "./table/MaterialTableSkeleton";
import { MaterialTableEmptyState } from "./table/MaterialTableEmptyState";
import { MaterialTableNoData } from "./table/MaterialTableNoData";
import { MaterialTableLoadingOverlay } from "./table/MaterialTableLoadingOverlay";

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
  // Handle invalid data
  if (!filteredMaterials || !Array.isArray(filteredMaterials)) {
    console.error("Invalid filtered materials data:", filteredMaterials);
    return <MaterialTableNoData />;
  }
  
  // Loading skeleton for initial load
  if (loading && filteredMaterials.length === 0) {
    return <MaterialTableSkeleton />;
  }
  
  return (
    <ErrorBoundaryWrapper feature="Materials Table">
      <Table>
        <TableCaption>
          Comprehensive database of construction materials and their carbon footprints
        </TableCaption>
        <MaterialTableHeader />
        <TableBody>
          <MaterialTableLoadingOverlay 
            materials={filteredMaterials} 
            isLoading={loading} 
          />
          
          {!loading && filteredMaterials.map((material, index) => (
            <MaterialTableRow 
              key={`${material.name}-${index}`} 
              material={material} 
              index={index} 
            />
          ))}
        </TableBody>
      </Table>
      
      <MaterialTableEmptyState 
        isLoading={loading} 
        resetFilters={resetFilters} 
      />
    </ErrorBoundaryWrapper>
  );
};

export default MaterialTable;
