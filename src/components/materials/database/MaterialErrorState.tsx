
import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MaterialErrorStateProps {
  error: Error;
  handleRefresh: () => void;
}

const MaterialErrorState: React.FC<MaterialErrorStateProps> = ({ error, handleRefresh }) => {
  return (
    <div className="container mx-auto px-4 py-8 content-top-spacing pt-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
          <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold text-red-700 dark:text-red-400">Error Loading Materials</h2>
          <p className="text-red-600 dark:text-red-300 mt-2">
            {error.message || "Failed to load material data. Please try again later."}
          </p>
          <div className="flex gap-4 justify-center mt-4">
            <Button 
              className="bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </Button>
            <Button
              variant="outline"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Materials
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialErrorState;
