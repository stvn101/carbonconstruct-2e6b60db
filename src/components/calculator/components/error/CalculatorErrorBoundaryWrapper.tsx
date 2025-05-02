
import React, { useEffect } from 'react';
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "../CalculatorErrorBoundary";
import { toast } from 'sonner';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

interface CalculatorErrorBoundaryWrapperProps {
  children: React.ReactNode;
  onResetError: () => void;
  resetKeys?: any[];
  feature?: string;
}

const CalculatorErrorBoundaryWrapper: React.FC<CalculatorErrorBoundaryWrapperProps> = ({ 
  children, 
  onResetError,
  resetKeys = [],
  feature = 'Calculator'
}) => {
  const { isOnline } = useOnlineStatus();
  
  // Effect to detect network status changes
  useEffect(() => {
    if (!isOnline) {
      toast.warning("You're offline. Calculator functionality may be limited.", {
        id: "calculator-offline-warning",
        duration: 5000
      });
    }
  }, [isOnline]);

  const handleError = (error: Error) => {
    console.error(`${feature} error:`, error);
    
    // Check for specific error types
    if (error.message.includes("too many re-renders") || 
        error.message.includes("Maximum update depth exceeded")) {
      toast.error("Calculator encountered a rendering issue. Try refreshing the page.", {
        id: "calculator-render-error",
        duration: 7000
      });
    }
    else if (!isOnline) {
      toast.error("Network issue detected. Please check your connection.", {
        id: "calculator-network-error",
        duration: 5000
      });
    }
    else {
      // Generic error handling
      toast.error(`Calculator error: ${error.message}`, {
        id: "calculator-generic-error",
        duration: 5000
      });
    }
  };

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
      onError={handleError}
      resetKeys={[...resetKeys, isOnline]}
    >
      {children}
    </ErrorBoundary>
  );
};

export default CalculatorErrorBoundaryWrapper;
