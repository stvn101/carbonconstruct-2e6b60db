
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Calculator, FolderPlus } from "lucide-react";

interface EmptyProjectsListProps {
  hasFilters: boolean;
}

export const EmptyProjectsList = ({ hasFilters }: EmptyProjectsListProps) => {
  return (
    <div className="text-center py-12 bg-white dark:bg-card rounded-lg shadow-sm">
      <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
      <h2 className="text-xl font-medium mb-1 text-foreground">No projects found</h2>
      <p className="text-muted-foreground mb-4">
        {hasFilters 
          ? "Try adjusting your search or filters" 
          : "Start by creating your first carbon calculation"}
      </p>
      <div className="flex justify-center gap-2">
        <Button 
          asChild
          variant="outline"
        >
          <Link to="/projects/new">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Project
          </Link>
        </Button>
        <Button 
          asChild
          className="bg-carbon-600 hover:bg-carbon-700 text-white"
        >
          <Link to="/calculator">
            <Calculator className="h-4 w-4 mr-2" />
            New Calculation
          </Link>
        </Button>
      </div>
    </div>
  );
};
