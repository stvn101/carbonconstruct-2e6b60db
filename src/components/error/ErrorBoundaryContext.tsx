
import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorBoundaryContextType {
  registerErrorBoundary: (id: string) => void;
  unregisterErrorBoundary: (id: string) => void;
  notifyError: (id: string, error: Error) => void;
  resetErrorBoundary: (id: string) => void;
}

const ErrorBoundaryContext = createContext<ErrorBoundaryContextType | undefined>(undefined);

export const useErrorBoundaryContext = () => {
  const context = useContext(ErrorBoundaryContext);
  if (!context) {
    throw new Error('useErrorBoundaryContext must be used within an ErrorBoundaryProvider');
  }
  return context;
};

interface ErrorBoundaryProviderProps {
  children: React.ReactNode;
}

export const ErrorBoundaryProvider: React.FC<ErrorBoundaryProviderProps> = ({ children }) => {
  const [errorBoundaries, setErrorBoundaries] = useState<Record<string, boolean>>({});
  
  const registerErrorBoundary = useCallback((id: string) => {
    setErrorBoundaries(prev => ({ ...prev, [id]: false }));
  }, []);
  
  const unregisterErrorBoundary = useCallback((id: string) => {
    setErrorBoundaries(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  }, []);
  
  const notifyError = useCallback((id: string, error: Error) => {
    console.error(`Error in boundary ${id}:`, error);
    setErrorBoundaries(prev => ({ ...prev, [id]: true }));
  }, []);
  
  const resetErrorBoundary = useCallback((id: string) => {
    setErrorBoundaries(prev => ({ ...prev, [id]: false }));
    toast.success(`Component ${id} has been reset successfully`);
  }, []);
  
  const value = {
    registerErrorBoundary,
    unregisterErrorBoundary,
    notifyError,
    resetErrorBoundary
  };
  
  return (
    <ErrorBoundaryContext.Provider value={value}>
      {children}
    </ErrorBoundaryContext.Provider>
  );
};
