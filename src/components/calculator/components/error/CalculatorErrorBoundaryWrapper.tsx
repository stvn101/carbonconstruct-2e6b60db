
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
      fallback={<ErrorFallback onReset={onResetError} />}
      onReset={onResetError}
      resetKeys={resetKeys}
    >
      {children}
    </ErrorBoundary>
  );
};

export default CalculatorErrorBoundaryWrapper;
