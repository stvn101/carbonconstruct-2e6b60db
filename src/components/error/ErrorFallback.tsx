
import React, { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, ChevronLeft, WifiOff } from "lucide-react";
import errorTrackingService from "@/services/error/errorTrackingService";
import { toast } from "sonner";

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  feature?: string;
  isNetworkError: boolean;
  isChecking: boolean;
  onReset: () => void;
  onGoBack: () => void;
  onGoHome: () => void;
  onRefresh: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  feature,
  isNetworkError,
  isChecking,
  onReset,
  onGoBack,
  onGoHome,
  onRefresh
}) => {
  useEffect(() => {
    errorTrackingService.captureException(error, {
      componentStack: error.stack,
      source: feature || 'ErrorBoundary',
      url: window.location.href,
      route: window.location.pathname
    });
  }, [error, feature]);

  return (
    <div className="min-h-[200px] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-6">
        <Alert variant={isNetworkError ? "warning" : "destructive"} className="mb-6">
          {isNetworkError ? (
            <WifiOff className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <AlertTitle className="mb-2">
            {isNetworkError 
              ? "Connection Issue Detected" 
              : feature 
                ? `${feature} Error` 
                : 'Something went wrong'}
          </AlertTitle>
          <AlertDescription className="text-sm">
            {isNetworkError 
              ? "We're having trouble connecting to our servers. Please check your internet connection and try again."
              : "We apologize for the inconvenience. This section has encountered an error."}
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-medium mb-2">Error Details</h3>
            <div className="bg-background/95 p-3 rounded-md overflow-auto max-h-48 text-sm font-mono">
              {error?.toString() || "Unknown error"}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={onReset} 
              className="flex items-center gap-2"
              disabled={isChecking}
            >
              <RefreshCw className={`h-4 w-4 ${isChecking ? 'animate-spin' : ''}`} />
              {isChecking ? 'Checking Connection...' : 'Try Again'}
            </Button>
            <Button variant="outline" onClick={onGoBack} className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              Go Back
            </Button>
            <Button variant="secondary" onClick={onRefresh} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Reload Page
            </Button>
            <Button variant="secondary" onClick={onGoHome} className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ErrorFallback;
