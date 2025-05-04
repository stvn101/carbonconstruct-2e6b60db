
import React from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MaterialLoadingStateProps {
  handleRefresh: () => void;
}

const MaterialLoadingState: React.FC<MaterialLoadingStateProps> = ({ handleRefresh }) => {
  return (
    <div className="container mx-auto px-4 py-8 content-top-spacing pt-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-carbon-600" />
          <h2 className="text-2xl font-bold">Loading Material Database...</h2>
          <p className="text-muted-foreground">Fetching materials from database</p>
          
          {/* Add manual refresh option */}
          <Button 
            variant="outline" 
            className="mt-6"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Materials
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MaterialLoadingState;
