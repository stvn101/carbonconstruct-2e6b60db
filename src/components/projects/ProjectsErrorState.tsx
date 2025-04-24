
import React from 'react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { RefreshCw, WifiOff, AlertCircle } from "lucide-react";

interface ProjectsErrorStateProps {
  isOffline: boolean;
  hasError: boolean;
  onRetry: () => void;
  isRetrying: boolean;
}

const ProjectsErrorState: React.FC<ProjectsErrorStateProps> = ({
  isOffline,
  hasError,
  onRetry,
  isRetrying
}) => {
  if (!isOffline && !hasError) return null;
  
  return (
    <Alert 
      variant={isOffline ? "warning" : "destructive"} 
      className="mb-6"
    >
      {isOffline ? (
        <WifiOff className="h-5 w-5" />
      ) : (
        <AlertCircle className="h-5 w-5" />
      )}
      <AlertTitle>
        {isOffline 
          ? "Connection Issue Detected" 
          : "Error Loading Projects"}
      </AlertTitle>
      <AlertDescription>
        {isOffline 
          ? "You're currently offline or we can't reach our servers. Your projects will appear when the connection is restored."
          : "We're experiencing technical issues loading your projects. Our team has been notified."}
        <div className="mt-2">
          <Button 
            onClick={onRetry} 
            variant="outline"
            size="sm"
            disabled={isRetrying}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'Checking...' : 'Try Again'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ProjectsErrorState;
