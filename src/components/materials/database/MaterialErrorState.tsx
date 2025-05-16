
import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MaterialErrorStateProps {
  error: Error;
  onRetry: () => void;
  isRefreshing?: boolean;
}

const MaterialErrorState: React.FC<MaterialErrorStateProps> = ({ 
  error, 
  onRetry,
  isRefreshing = false
}) => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="max-w-xl mx-auto text-center bg-red-50 dark:bg-red-900/20 rounded-lg p-8 border border-red-200 dark:border-red-800">
        <AlertTriangle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-800 dark:text-red-300 mb-2">
          Unable to Load Materials
        </h2>
        <p className="text-red-700 dark:text-red-300 mb-6">
          We encountered an issue while trying to load the materials database. Please try again later.
        </p>
        
        <div className="bg-white dark:bg-gray-800 rounded p-4 mb-6 text-left overflow-x-auto">
          <p className="font-mono text-sm text-red-600 dark:text-red-400 break-all">
            {error.message || "Unknown error"}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
            disabled={isRefreshing}
          >
            Reload Page
          </Button>
          
          <Button
            onClick={onRetry}
            className="bg-carbon-600 hover:bg-carbon-700 text-white flex items-center gap-2"
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Retrying...' : 'Retry Loading Materials'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MaterialErrorState;
