
import React from 'react';
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../CalculatorErrorBoundary";

interface CalculatorErrorBoundaryWrapperProps {
  children: React.ReactNode;
  onResetError: () => void;
  resetKeys?: any[];
}

const CalculatorErrorBoundaryWrapper: React.FC<CalculatorErrorBoundaryWrapperProps> = ({ 
  children, 
  onResetError,
  resetKeys = []
}) => {
  return (
    <ErrorBoundary 
      fallbackRender={({error, resetErrorBoundary}) => (
        <ErrorFallback 
          error={error} 
          resetErrorBoundary={resetErrorBoundary} 
          onReset={onResetError} 
        />
      )}
      onReset={onResetError}
      resetKeys={resetKeys}
    >
      {children}
    </ErrorBoundary>
  );
};

export default CalculatorErrorBoundaryWrapper;
