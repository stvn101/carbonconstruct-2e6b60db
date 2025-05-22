
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import vercelGrokService, { VercelGrokResponse, GrokMode } from '@/services/VercelGrokService';
import { toast } from 'sonner';
import { useGrokUsage } from '@/hooks/useGrokUsage';

// Estimate tokens in a message for usage tracking
const estimateTokens = (text: string): number => {
  // Simple estimation: ~4 chars per token on average
  return Math.ceil(text.length / 4);
};

interface GrokContextType {
  isConfigured: boolean;
  configureGrok: (apiKey: string) => void;
  resetGrok: () => void;
  askGrok: (prompt: string, context?: any, mode?: GrokMode) => Promise<VercelGrokResponse>;
  streamGrok: (prompt: string, context?: any, mode?: GrokMode) => AsyncIterable<string>;
  isProcessing: boolean;
  lastResponse: VercelGrokResponse | null;
}

const GrokContext = createContext<GrokContextType | undefined>(undefined);

export function GrokProvider({ children }: { children: ReactNode }) {
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<VercelGrokResponse | null>(null);
  const { recordUsage } = useGrokUsage();
  
  // Check if Grok service is configured on component mount
  useEffect(() => {
    const configStatus = vercelGrokService.isApiConfigured();
    setIsConfigured(configStatus);
  }, []);
  
  const configureGrok = (apiKey: string) => {
    if (!apiKey || apiKey.trim() === '') {
      toast.error("Please provide a valid Grok API key");
      return;
    }
    
    try {
      vercelGrokService.setApiKey(apiKey);
      setIsConfigured(true);
      toast.success("Grok AI services configured successfully");
    } catch (error) {
      toast.error("Failed to configure Grok AI services");
      console.error("Grok configuration error:", error);
    }
  };
  
  const resetGrok = () => {
    vercelGrokService.setApiKey('');
    setIsConfigured(false);
  };
  
  const askGrok = async (prompt: string, context?: any, mode?: GrokMode): Promise<VercelGrokResponse> => {
    setIsProcessing(true);
    
    try {
      const response = await vercelGrokService.queryGrok({ prompt, context, mode });
      setLastResponse(response);
      
      // Record usage - estimate tokens for prompt and response
      const promptTokens = estimateTokens(prompt);
      const responseTokens = estimateTokens(response.text);
      recordUsage('chat', promptTokens + responseTokens);
      
      return response;
    } catch (error) {
      const errorResponse: VercelGrokResponse = {
        text: "Error processing your request. Please try again.",
        error: error instanceof Error ? error.message : String(error)
      };
      setLastResponse(errorResponse);
      return errorResponse;
    } finally {
      setIsProcessing(false);
    }
  };
  
  // New method for streaming responses
  const streamGrok = (prompt: string, context?: any, mode?: GrokMode): AsyncIterable<string> => {
    setIsProcessing(true);
    
    // Record initial usage for prompt
    const promptTokens = estimateTokens(prompt);
    recordUsage('chat_stream', promptTokens);
    
    const stream = vercelGrokService.streamGrokResponse({ prompt, context, mode });
    
    // Wrap the stream to capture completion and estimate response tokens
    return {
      [Symbol.asyncIterator]: async function* () {
        try {
          let responseText = '';
          
          for await (const chunk of stream) {
            responseText += chunk;
            yield chunk;
          }
          
          // Record full response usage when stream completes
          const responseTokens = estimateTokens(responseText);
          recordUsage('chat_stream', responseTokens);
          
          // Update last response
          setLastResponse({
            text: responseText
          });
        } catch (error) {
          console.error("Error in Grok stream:", error);
          yield "Error: " + (error instanceof Error ? error.message : String(error));
        } finally {
          setIsProcessing(false);
        }
      }
    };
  };
  
  const value = {
    isConfigured,
    configureGrok,
    resetGrok,
    askGrok,
    streamGrok,
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
