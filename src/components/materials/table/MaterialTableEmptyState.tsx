
import React from "react";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

interface MaterialTableEmptyStateProps {
  isLoading: boolean;
  resetFilters: () => void;
}

export const MaterialTableEmptyState: React.FC<MaterialTableEmptyStateProps> = ({ 
  isLoading, 
  resetFilters 
}) => {
  if (isLoading) return null;
  
  return (
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
  );
};
