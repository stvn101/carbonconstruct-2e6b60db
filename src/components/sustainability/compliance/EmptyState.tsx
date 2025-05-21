
import React from "react";
import { Button } from "@/components/ui/button";
import { ShieldX } from "lucide-react";

interface EmptyStateProps {
  onRunCheck: () => void;
  isLoading: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRunCheck, isLoading }) => {
  return (
    <div className="text-center py-4">
      <ShieldX className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
      <h3 className="font-medium mb-1">No Compliance Data</h3>
      <p className="text-muted-foreground mb-4">
        Run a compliance check to analyze your project against NCC 2025 and NABERS standards.
      </p>
      <Button 
        onClick={onRunCheck} 
        disabled={isLoading || !onRunCheck}
        className="bg-carbon-600 hover:bg-carbon-700 text-white"
      >
        {isLoading ? 'Checking...' : 'Run Compliance Check'}
      </Button>
    </div>
  );
};

export default EmptyState;
