
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import grokService, { GrokResponse, GrokMode } from '@/services/GrokService';
import { toast } from 'sonner';

interface GrokContextType {
  isConfigured: boolean;
  configureGrok: (apiKey: string) => void;
  resetGrok: () => void;
  askGrok: (prompt: string, context?: any, mode?: GrokMode) => Promise<GrokResponse>;
  isProcessing: boolean;
  lastResponse: GrokResponse | null;
}

const GrokContext = createContext<GrokContextType | undefined>(undefined);

export function GrokProvider({ children }: { children: ReactNode }) {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<GrokResponse | null>(null);
  
  // Check if Grok service is configured on component mount
  useEffect(() => {
    const configStatus = grokService.isApiConfigured();
    setIsConfigured(configStatus);
  }, []);
  
  const configureGrok = (apiKey: string) => {
    if (!apiKey || apiKey.trim() === '') {
      toast.error("Please provide a valid Grok API key");
      return;
    }
    
    try {
      grokService.setApiKey(apiKey);
      setIsConfigured(true);
      toast.success("Grok AI services configured successfully");
    } catch (error) {
      toast.error("Failed to configure Grok AI services");
      console.error("Grok configuration error:", error);
    }
  };
  
  const resetGrok = () => {
    grokService.setApiKey('');
    setIsConfigured(false);
  };
  
  const askGrok = async (prompt: string, context?: any, mode?: GrokMode): Promise<GrokResponse> => {
    setIsProcessing(true);
    
    try {
      const response = await grokService.queryGrok({ prompt, context, mode });
      setLastResponse(response);
      return response;
    } catch (error) {
      const errorResponse: GrokResponse = {
        response: "Error processing your request. Please try again.",
        error: error instanceof Error ? error.message : String(error)
      };
      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setIsProcessing(false);
    }
  };
  
  const value = {
    isConfigured,
    configureGrok,
    resetGrok,
    askGrok,
    isProcessing,
    lastResponse
  };
  
  return (
    <GrokContext.Provider value={value}>
      {children}
    </GrokContext.Provider>
  );
}

export function useGrok() {
  const context = useContext(GrokContext);
  
  if (context === undefined) {
    throw new Error('useGrok must be used within a GrokProvider');
  }
  
  return context;
}
