
import React from 'react';
import ErrorBoundaryWrapper from '../error/ErrorBoundaryWrapper';

// This is a compatibility layer for all the existing imports to @/components/ErrorBoundary
// It forwards to the new refactored components in the src/components/error directory

interface ErrorBoundaryProps {
  children: React.ReactNode;
  feature?: string;
  fallbackComponent?: React.ComponentType<{
    error: Error; 
    resetErrorBoundary: () => void;
    feature?: string;
  }>;
  className?: string;
  onReset?: () => void;
  resetCondition?: any;
  ignoreErrors?: boolean;
}

// Main ErrorBoundary component to maintain backwards compatibility
const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ 
  children, 
  feature = 'Unknown',
  fallbackComponent,
  className,
  onReset,
  resetCondition,
  ignoreErrors
}) => {
  return (
    <ErrorBoundaryWrapper
      feature={feature}
      fallbackComponent={fallbackComponent}
      className={className}
      onReset={onReset}
      resetCondition={resetCondition}
      ignoreErrors={ignoreErrors}
    >
      {children}
    </ErrorBoundaryWrapper>
  );
};

export default ErrorBoundary;
