
import React from "react";
import { Loader2 } from "lucide-react";
import { TableRow, TableCell } from "@/components/ui/table";

interface MaterialTableLoadingOverlayProps {
  materials: any[];
  isLoading: boolean;
}

export const MaterialTableLoadingOverlay: React.FC<MaterialTableLoadingOverlayProps> = ({ 
  materials, 
  isLoading 
}) => {
  if (!isLoading || !Array.isArray(materials) || materials.length === 0) {
    return null;
  }

  return (
    <TableRow className="relative">
      <TableCell colSpan={5} className="p-0 border-b-0">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-carbon-600" />
            <p className="mt-2 text-sm text-carbon-700 dark:text-carbon-300">
              Updating materials...
            </p>
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
};
