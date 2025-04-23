
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorTrackingService from '@/services/errorTrackingService';

type ErrorBoundaryWrapperProps = {
  children: React.ReactNode;
  feature: string;
};

const ErrorFallback = ({ 
  error, 
  resetErrorBoundary,
  feature 
}: { 
  error: Error; 
  resetErrorBoundary: () => void;
  feature: string;
}) => {
  // Log the error with context
  React.useEffect(() => {
    ErrorTrackingService.captureException(error, { feature });
  }, [error, feature]);
  
  return (
    <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-center">
      <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
        {feature} Error
      </h3>
      <p className="mt-2 text-red-700 dark:text-red-400">
        {error.message || `There was a problem with the ${feature} component.`}
      </p>
      <button 
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        onClick={resetErrorBoundary}
      >
        Try Again
      </button>
    </div>
  );
};

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ 
  children, 
  feature 
}) => {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <ErrorFallback 
          error={error} 
          resetErrorBoundary={resetErrorBoundary}
          feature={feature}
        />
      )}
      onError={(error, info) => {
        ErrorTrackingService.captureException(error, { 
          feature,
          componentStack: info.componentStack
        });
      }}
      onReset={() => {
        // Log reset attempt
        console.info(`User attempted to recover from error in ${feature}`);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
