
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorTrackingService from '@/services/error/errorTrackingService';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, WifiOff, Signal } from "lucide-react";
import { toast } from 'sonner';
import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { checkSupabaseConnectionWithRetry } from '@/services/supabase/connection';

interface ErrorBoundaryWrapperProps {
  children: React.ReactNode;
  feature: string;
  fallbackComponent?: React.ComponentType<{ 
    error: Error; 
    resetErrorBoundary: () => void;
    feature?: string;
  }>;
  className?: string;
  onReset?: () => void;
  resetCondition?: any; // When this value changes, the error boundary will reset
  ignoreErrors?: boolean; // If true, will still render children even if there's an error
}

const ErrorFallback = ({ 
  error, 
  resetErrorBoundary,
  feature 
}: { 
  error: Error; 
  resetErrorBoundary: () => void;
  feature?: string;
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const { isOnline } = useNetworkStatus();
  const resetAttemptRef = useRef(0);
  
  // Log the error with context
  useEffect(() => {
    if (error && feature) {
      ErrorTrackingService.captureException(error, { feature });
    }
  }, [error, feature]);
  
  const handleReset = async () => {
    setIsChecking(true);
    resetAttemptRef.current += 1;
    
    if (!isOnline) {
      toast.error("You're currently offline. Please check your connection.", {
        id: "offline-reset-error",
        duration: 5000,
      });
      setIsChecking(false);
      return;
    }
    
    try {
      // Check if we can connect to the server before resetting
      const canConnect = await checkSupabaseConnectionWithRetry(2, 1000);
      
      if (!canConnect) {
        toast.error("Cannot connect to the server. Please try again when you have better connectivity.", {
          id: "connection-reset-error",
          duration: 5000,
        });
        setIsChecking(false);
        return;
      }
      
      // If everything looks good, proceed with reset
      resetErrorBoundary();
      toast.success("Reset successful! Trying again...", {
        id: "reset-success",
        duration: 3000,
      });
    } catch (e) {
      console.error("Error checking connection:", e);
      toast.error("Something went wrong. Please try again.", {
        id: "reset-error",
        duration: 3000,
      });
    } finally {
      setIsChecking(false);
    }
  };
  
  // Determine if this is a network-related error
  const isNetworkError = error && (
    error.message.includes("Failed to fetch") ||
    error.message.includes("NetworkError") ||
    error.message.includes("Network Error") ||
    error.message.includes("timed out") ||
    error.message.includes("connection") ||
    !isOnline
  );
  
  return (
    <Card className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-center">
      <div className="flex flex-col items-center p-2">
        {isNetworkError ? (
          <WifiOff className="h-10 w-10 text-red-600 mb-2" aria-hidden="true" />
        ) : (
          <AlertTriangle className="h-10 w-10 text-red-600 mb-2" aria-hidden="true" />
        )}
        
        <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
          {isNetworkError 
            ? "Connection Error" 
            : feature 
              ? `${feature} Error` 
              : 'Something went wrong'}
        </h3>
        
        <p className="mt-2 text-red-700 dark:text-red-400 text-sm">
          {isNetworkError
            ? "There was a problem connecting to the server. Please check your internet connection."
            : error?.message || `There was a problem with ${feature || 'this component'}.`}
        </p>
        
        <div className="flex gap-2 mt-4">
          <Button 
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            onClick={handleReset}
            disabled={isChecking}
          >
            {isChecking ? (
              <>
                <Signal className="h-4 w-4 mr-2 animate-pulse" />
                Checking Connection...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ 
  children, 
  feature,
  fallbackComponent,
  className,
  onReset,
  resetCondition,
  ignoreErrors = false
}) => {
  const [key, setKey] = useState(0);
  const [hasError, setHasError] = useState(false);
  const FallbackComponent = fallbackComponent || 
    (({ error, resetErrorBoundary }) => (
      <ErrorFallback 
        error={error} 
        resetErrorBoundary={resetErrorBoundary}
        feature={feature}
      />
    ));

  // Reset the error boundary when resetCondition changes
  useEffect(() => {
    if (resetCondition !== undefined && hasError) {
      setKey(prevKey => prevKey + 1);
      setHasError(false);
    }
  }, [resetCondition, hasError]);

  const handleReset = useCallback(() => {
    // Force a re-render by changing the key
    setKey(prevKey => prevKey + 1);
    setHasError(false);
    
    // Call custom reset handler if provided
    if (onReset) onReset();
    
    // Dismiss any existing error toasts
    toast.dismiss();
  }, [onReset]);

  const handleError = (error: Error, info: { componentStack: string }) => {
    setHasError(true);
    
    ErrorTrackingService.captureException(error, { 
      feature,
      componentStack: info.componentStack,
      url: window.location.href,
      route: window.location.pathname
    });
    console.error(`Error in ${feature}:`, error);
  };

  // If ignoreErrors is true, render both the error boundary and the children
  if (ignoreErrors && hasError) {
    return (
      <div className={className}>
        <div className="mb-4">
          <FallbackComponent 
            error={new Error(`An error occurred in ${feature}`)} 
            resetErrorBoundary={handleReset}
            feature={feature}
          />
        </div>
        {React.Children.map(children, child => child)}
      </div>
    );
  }

  return (
    <div className={className}>
      <ErrorBoundary
        key={`error-boundary-${feature}-${key}`}
        FallbackComponent={FallbackComponent}
        onError={handleError}
        onReset={handleReset}
      >
        {children}
      </ErrorBoundary>
    </div>
  );
};

export default ErrorBoundaryWrapper;
