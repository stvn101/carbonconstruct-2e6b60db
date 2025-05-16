
import React from "react";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw, Filter } from "lucide-react";

interface MaterialTableEmptyStateProps {
  isLoading: boolean;
  resetFilters: () => void;
  filteredCount?: number;
}

export const MaterialTableEmptyState: React.FC<MaterialTableEmptyStateProps> = ({ 
  isLoading, 
  resetFilters,
  filteredCount = 0
}) => {
  // Don't show empty state when loading or when there are filtered results
  if (isLoading || filteredCount > 0) {
    return null;
  }

  return (
    <div className="text-center py-8 mt-4 bg-muted/20 rounded-lg border border-dashed">
      <Database className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-1">No materials found</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
        Try changing your search criteria or removing filters to find more materials
      </p>
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Button 
          onClick={resetFilters}
          variant="outline" 
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          <span>Clear Filters</span>
        </Button>
        <Button 
          variant="default" 
          className="bg-carbon-600 hover:bg-carbon-700 flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Data</span>
        </Button>
      </div>
    </div>
  );
};
