
import React from "react";
import { Button } from "@/components/ui/button";
import { Database, RefreshCw } from "lucide-react";

export const MaterialTableNoData: React.FC = () => {
  return (
    <div className="text-center py-12 px-4 bg-muted/20 rounded-lg border border-dashed flex flex-col items-center">
      <Database className="h-16 w-16 mb-4 text-muted-foreground" />
      <h3 className="text-xl font-medium mb-2">Material Data Unavailable</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        We're unable to load the materials data at this time. This could be due to a connection issue or server unavailability.
      </p>
      <Button 
        onClick={() => window.location.reload()}
        className="bg-carbon-600 hover:bg-carbon-700 flex items-center gap-2"
      >
        <RefreshCw className="h-4 w-4" />
        <span>Refresh Page</span>
      </Button>
    </div>
  );
};
