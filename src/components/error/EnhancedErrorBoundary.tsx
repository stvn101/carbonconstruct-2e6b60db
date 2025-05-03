
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallbackCard from './ErrorFallbackCard';
import { useEnhancedErrorBoundary } from '@/hooks/useEnhancedErrorBoundary';
import { isNetworkError } from '@/utils/errorHandling/isNetworkError';

interface EnhancedErrorBoundaryProps {
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

const EnhancedErrorBoundary: React.FC<EnhancedErrorBoundaryProps> = ({ 
  children, 
  feature,
  fallbackComponent,
  className,
  onReset,
  resetCondition,
  ignoreErrors = false
}) => {
  const boundaryId = `boundary-${feature.replace(/\s+/g, '-')}`;
  
  const {
    isChecking,
    handleReset,
    hasExceededRetries
  } = useEnhancedErrorBoundary(boundaryId, onReset);

  // Effect to reset error state when resetCondition changes
  React.useEffect(() => {
    if (resetCondition !== undefined) {
      handleReset();
    }
  }, [resetCondition, handleReset]);

  const handleError = React.useCallback((error: Error, info: { componentStack: string }) => {
    console.error(`Error in ${feature}:`, error);
    console.error("Component Stack:", info.componentStack);
  }, [feature]);

  const DefaultFallback = React.useCallback(({ error, resetErrorBoundary }) => (
    <ErrorFallbackCard
      error={error}
      isNetworkError={isNetworkError(error)}
      isChecking={isChecking}
      onReset={resetErrorBoundary}
      hasExceededRetries={hasExceededRetries}
    />
  ), [isChecking, hasExceededRetries]);

  const FallbackComponent = fallbackComponent || DefaultFallback;

  return (
    <div className={className}>
      <ErrorBoundary
        key={`error-boundary-${feature}`}
        FallbackComponent={FallbackComponent}
        onError={handleError}
        onReset={handleReset}
      >
        {children}
      </ErrorBoundary>
    </div>
  );
};

export default EnhancedErrorBoundary;
