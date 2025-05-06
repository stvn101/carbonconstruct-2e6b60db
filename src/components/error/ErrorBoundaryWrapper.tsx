
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallbackCard from './ErrorFallbackCard';
import { useErrorBoundaryState } from '@/hooks/useErrorBoundaryState';
import { isNetworkError } from '@/utils/errorHandling/networkChecker';

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
  resetCondition?: any;
  ignoreErrors?: boolean;
}

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ 
  children, 
  feature,
  fallbackComponent,
  className,
  onReset,
  resetCondition,
  ignoreErrors = false
}) => {
  const {
    key,
    hasError,
    isChecking,
    handleReset,
    handleError
  } = useErrorBoundaryState(feature, onReset);

  // Effect to reset error state when resetCondition changes
  React.useEffect(() => {
    if (resetCondition !== undefined && hasError) {
      handleReset();
    }
  }, [resetCondition, hasError, handleReset]);

  const DefaultFallback = React.useCallback(({ error, resetErrorBoundary }) => (
    <ErrorFallbackCard
      error={error}
      isNetworkError={isNetworkError(error)}
      isChecking={isChecking}
      onReset={resetErrorBoundary}
    />
  ), [isChecking]);

  const FallbackComponent = fallbackComponent || DefaultFallback;

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
