
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import aiService from '@/services/AIService';
import { toast } from 'sonner';

interface AIServiceContextType {
  isConfigured: boolean;
  configureAI: (apiKey: string) => void;
  resetAI: () => void;
}

const AIServiceContext = createContext<AIServiceContextType | undefined>(undefined);

// Your API key
const DEFAULT_API_KEY = '170cf47d2b04210ea8c8b68cc390487c';

export function AIServiceProvider({ children }: { children: ReactNode }) {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  
  // Auto-configure with your API key on component mount
  useEffect(() => {
    if (!isConfigured) {
      configureAI(DEFAULT_API_KEY);
      toast.success("AI services automatically configured");
    }
  }, []);
  
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
