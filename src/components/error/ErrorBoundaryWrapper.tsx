
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorTrackingService from '@/services/errorTrackingService';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw } from "lucide-react";

type ErrorBoundaryWrapperProps = {
  children: React.ReactNode;
  feature: string;
  fallbackComponent?: React.ComponentType<{ 
    error: Error; 
    resetErrorBoundary: () => void;
    feature?: string;
  }>;
  className?: string;
  onReset?: () => void;
};

const ErrorFallback = ({ 
  error, 
  resetErrorBoundary,
  feature 
}: { 
  error: Error; 
  resetErrorBoundary: () => void;
  feature?: string;
}) => {
  // Log the error with context
  React.useEffect(() => {
    if (error && feature) {
      ErrorTrackingService.captureException(error, { feature });
    }
  }, [error, feature]);
  
  return (
    <Card className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-center">
      <div className="flex flex-col items-center p-2">
        <AlertTriangle className="h-10 w-10 text-red-600 mb-2" aria-hidden="true" />
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
          {feature ? `${feature} Error` : 'Something went wrong'}
        </h3>
        <p className="mt-2 text-red-700 dark:text-red-400 text-sm">
          {error?.message || `There was a problem with ${feature || 'this component'}.`}
        </p>
        <Button 
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          onClick={resetErrorBoundary}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    </Card>
  );
};

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ 
  children, 
  feature,
  fallbackComponent,
  className,
  onReset
}) => {
  const [key, setKey] = React.useState(0);
  const FallbackComponent = fallbackComponent || 
    (({ error, resetErrorBoundary }) => (
      <ErrorFallback 
        error={error} 
        resetErrorBoundary={resetErrorBoundary}
        feature={feature}
      />
    ));

  const handleReset = React.useCallback(() => {
    // Force a re-render by changing the key
    setKey(prevKey => prevKey + 1);
    // Call custom reset handler if provided
    if (onReset) onReset();
  }, [onReset]);

  return (
    <div className={className}>
      <ErrorBoundary
        key={`error-boundary-${feature}-${key}`}
        FallbackComponent={FallbackComponent}
        onError={(error, info) => {
          ErrorTrackingService.captureException(error, { 
            feature,
            componentStack: info.componentStack,
            url: window.location.href,
            route: window.location.pathname
          });
          console.error(`Error in ${feature}:`, error);
        }}
        onReset={handleReset}
      >
        {children}
      </ErrorBoundary>
    </div>
  );
};

export default ErrorBoundaryWrapper;
