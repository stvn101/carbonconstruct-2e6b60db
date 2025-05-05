
import React, { useState, useEffect } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface MaterialLoadingStateProps {
  handleRefresh: () => void;
}

const MaterialLoadingState: React.FC<MaterialLoadingStateProps> = ({ handleRefresh }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingTime, setLoadingTime] = useState(0);
  const [showRetry, setShowRetry] = useState(false);

  // Simulate loading progress and monitor time
  useEffect(() => {
    const startTime = Date.now();
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        // Start fast, then slow down as we approach 100
        const remaining = 100 - prev;
        const increment = Math.max(1, Math.min(5, remaining * 0.1));
        return Math.min(95, prev + increment); // Never reach 100 automatically
      });
      
      // Update elapsed time
      setLoadingTime(Math.floor((Date.now() - startTime) / 1000));
    }, 250);
    
    // Show retry option after 10 seconds
    const retryTimer = setTimeout(() => {
      setShowRetry(true);
    }, 10000);
    
    return () => {
      clearInterval(progressInterval);
      clearTimeout(retryTimer);
    };
  }, []);

  // Determine loading message based on time elapsed
  const loadingMessage = loadingTime < 3 ? 'Connecting to database...' :
                         loadingTime < 6 ? 'Fetching materials...' :
                         loadingTime < 10 ? 'Processing material data...' :
                         'Still working on it...';

  return (
    <div className="container mx-auto px-4 py-8 content-top-spacing pt-24">
      <div className="max-w-5xl mx-auto">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-carbon-600" />
          <h2 className="text-2xl font-bold">Loading Material Database...</h2>
          <p className="text-muted-foreground mb-6">{loadingMessage}</p>
          
          <div className="max-w-md mx-auto mb-6">
            <Progress value={loadingProgress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {loadingTime > 0 && `Loading for ${loadingTime} seconds`}
            </p>
          </div>
          
          {/* Show retry button after delay */}
          {showRetry && (
            <div className="mt-4">
              <p className="text-sm mb-2">Taking longer than expected? Try refreshing manually:</p>
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                className="mx-auto"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Materials
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialLoadingState;
