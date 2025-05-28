
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  feature?: string;
  className?: string;
  isChecking?: boolean;
  retryCount?: number;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  feature = "Unknown",
  className = "",
  isChecking = false,
  retryCount = 0
}) => {
  return (
    <Card className={`border-destructive ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center text-destructive">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Something went wrong in {feature}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          <p>Error: {error.message}</p>
          {retryCount > 0 && (
            <p className="mt-2">Retry attempts: {retryCount}</p>
          )}
        </div>
        <Button 
          onClick={resetErrorBoundary}
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};
