
import React from 'react';
import ErrorTrackingService from '@/services/error/errorTrackingService';

interface ErrorBoundaryProps {
  onReset: () => void;
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorBoundaryProps) => {
  React.useEffect(() => {
    ErrorTrackingService.captureException(error, { 
      component: 'CalculatorContainer', 
      errorDetails: error.toString() 
    });
  }, [error]);
  
  return (
    <div className="p-6 border border-destructive/50 bg-destructive/10 rounded-md text-center" role="alert">
      <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
      <p className="text-muted-foreground mb-4">{error?.message || "An error occurred while rendering the calculator"}</p>
      <button 
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-carbon-600 text-white rounded-md hover:bg-carbon-700"
      >
        Try again
      </button>
    </div>
  );
};

export default ErrorFallback;
