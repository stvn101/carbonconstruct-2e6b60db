
import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface MaterialErrorStateProps {
  error: Error | null;
  handleRefresh: () => void;
}

const MaterialErrorState: React.FC<MaterialErrorStateProps> = ({ error, handleRefresh }) => {
  // Determine error type to show appropriate message
  const isNetworkError = error?.message?.includes('network') || 
                         error?.message?.includes('offline') || 
                         error?.message?.includes('connection');
  
  const isTimeoutError = error?.message?.includes('timeout') || 
                         error?.message?.includes('timed out');
  
  const isDataError = error?.message?.includes('No materials found') ||
                      error?.message?.includes('empty');
  
  const errorTitle = isNetworkError ? 'Network Issue' :
                     isTimeoutError ? 'Request Timed Out' :
                     isDataError ? 'No Materials Found' :
                     'Error Loading Materials';
                     
  const errorDescription = isNetworkError ? 'Unable to reach the materials database. Please check your connection.' :
                          isTimeoutError ? 'The request took too long to complete. The server might be busy.' :
                          isDataError ? 'No materials were found in the database.' :
                          'Something went wrong while loading the materials.';

  return (
    <div className="container mx-auto px-4 py-8 content-top-spacing pt-24">
      <div className="max-w-5xl mx-auto">
        <Card className="border-red-200 dark:border-red-900">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <CardTitle>{errorTitle}</CardTitle>
            </div>
            <CardDescription>
              {errorDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-sm">
                <span className="font-medium">Error details: </span>
                <span className="font-mono">{error.message || 'Unknown error'}</span>
              </div>
            )}
            
            <div>
              <p className="mb-4 text-muted-foreground">
                You can try refreshing the materials data:
              </p>
              <Button 
                onClick={handleRefresh}
                className="bg-carbon-600 hover:bg-carbon-700 text-white"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Materials
              </Button>
            </div>
            
            <div className="border-t pt-4 text-sm text-muted-foreground">
              <p>
                If the issue persists, the application will use fallback material data to allow
                you to continue working.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaterialErrorState;
