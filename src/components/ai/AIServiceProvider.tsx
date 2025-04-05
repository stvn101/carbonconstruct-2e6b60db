
import React, { createContext, useContext, useState, ReactNode } from 'react';
import aiService from '@/services/AIService';

interface AIServiceContextType {
  isConfigured: boolean;
  configureAI: (apiKey: string) => void;
  resetAI: () => void;
}

const AIServiceContext = createContext<AIServiceContextType | undefined>(undefined);

export function AIServiceProvider({ children }: { children: ReactNode }) {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  
  const configureAI = (apiKey: string) => {
    aiService.setApiKey(apiKey);
    setIsConfigured(true);
  };
  
  const resetAI = () => {
    aiService.setApiKey('');
    setIsConfigured(false);
  };
  
  const value = {
    isConfigured,
    configureAI,
    resetAI
  };
  
  return (
    <AIServiceContext.Provider value={value}>
      {children}
    </AIServiceContext.Provider>
  );
}

export function useAIService() {
  const context = useContext(AIServiceContext);
  
  if (context === undefined) {
    throw new Error('useAIService must be used within an AIServiceProvider');
  }
  
  return context;
}
