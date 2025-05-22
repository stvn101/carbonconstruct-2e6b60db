
import React from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onRunCheck: () => void;
  isLoading?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onRunCheck, isLoading = false }) => {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
        <Shield className="h-6 w-6 text-carbon-600 dark:text-carbon-400" />
      </div>
      <h3 className="text-lg font-medium mb-2">No compliance data available</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-md">
        Run a compliance check to verify if your project meets the NCC 2025 and NABERS requirements
      </p>
      <Button onClick={onRunCheck} disabled={isLoading}>
        {isLoading ? 'Checking...' : 'Run Compliance Check'}
      </Button>
    </div>
  );
};

export default EmptyState;
