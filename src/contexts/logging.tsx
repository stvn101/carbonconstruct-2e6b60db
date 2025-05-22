
import React, { createContext, useContext, useState } from 'react';

interface LoggingContextType {
  enableLogging: boolean;
  setEnableLogging: (enable: boolean) => void;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  setLogLevel: (level: 'error' | 'warn' | 'info' | 'debug') => void;
}

const LoggingContext = createContext<LoggingContextType | undefined>(undefined);

export const LoggingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [enableLogging, setEnableLogging] = useState<boolean>(process.env.NODE_ENV === 'development');
  const [logLevel, setLogLevel] = useState<'error' | 'warn' | 'info' | 'debug'>('error');

  return (
    <LoggingContext.Provider value={{ 
      enableLogging, 
      setEnableLogging, 
      logLevel, 
      setLogLevel 
    }}>
      {children}
    </LoggingContext.Provider>
  );
};

export const useLogging = () => {
  const context = useContext(LoggingContext);
  
  if (context === undefined) {
    throw new Error('useLogging must be used within a LoggingProvider');
  }
  
  return context;
};
