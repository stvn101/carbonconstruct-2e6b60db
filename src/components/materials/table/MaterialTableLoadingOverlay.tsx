
import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { ExtendedMaterialData } from "@/lib/materials/materialTypes";

interface MaterialTableLoadingOverlayProps {
  materials: ExtendedMaterialData[];
  isLoading: boolean;
}

export const MaterialTableLoadingOverlay: React.FC<MaterialTableLoadingOverlayProps> = ({ 
  materials, 
  isLoading 
}) => {
  if (!isLoading || materials.length === 0) return null;
  
  return (
    <>
      {materials.map((material, index) => (
        <TableRow key={`loading-row-${index}`} className="opacity-50">
          <TableCell colSpan={7} className="h-16 relative">
            <div className="absolute inset-0 flex items-center justify-center bg-background/50">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
