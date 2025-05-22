
import { useState, useRef, useEffect } from 'react';
import { useGrok } from '@/contexts/GrokContext';
import { useChat } from 'ai/react';
import { GrokChatMessage } from '@/types/grok';
import { useSimpleOfflineMode } from '@/hooks/useSimpleOfflineMode';

// Helper to get a chat message ID
const getMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

interface UseGrokChatLogicProps {
  initialContext?: string;
}

export const useGrokChatLogic = ({ initialContext }: UseGrokChatLogicProps = {}) => {
  const { isConfigured } = useGrok();
  const [messages, setMessages] = useState<GrokChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOffline } = useSimpleOfflineMode();
  
  // Clear error when going back online
  useEffect(() => {
    if (!isOffline && error?.includes('network') || error?.includes('offline')) {
      setError(null);
    }
  }, [isOffline, error]);

  // Use the Vercel AI SDK's useChat hook for streaming capabilities
  const { input, handleInputChange, handleSubmit: handleVercelSubmit, isLoading } = useChat({
    api: '/api/chat',
    onFinish: (message) => {
      // Add the assistant's response to our messages array
      setMessages(prev => [...prev, {
        id: getMessageId(),
        role: 'assistant',
        content: message.content,
        timestamp: new Date()
      }]);
    },
    onError: (error) => {
      console.error("Error in chat:", error);
      
      // Show network-specific error message if offline
      if (isOffline || error.message.includes('network') || error.message.includes('failed to fetch')) {
        setError("Network connection issue. Please check your internet and try again.");
      } else {
        setError(error.message || "An error occurred while processing your request.");
      }
    }
  });

  // Add initial system message for context if provided
  useEffect(() => {
    if (initialContext && messages.length === 0) {
      setMessages([{
        id: getMessageId(),
        role: 'system',
        content: initialContext,
        timestamp: new Date()
      }]);
    }
  }, [initialContext, messages.length]);

  // Custom submit handler that integrates Vercel AI with our existing GrokContext
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !isConfigured || isLoading || isOffline) {
      // Show specific message if trying to submit while offline
      if (isOffline) {
        setError("You're currently offline. Please reconnect to use Grok AI services.");
      }
      return;
    }
    
    // Add user message
    const userMessage: GrokChatMessage = {
      id: getMessageId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setError(null);
    
    try {
      // Process with Vercel AI SDK (we're still using our handleSubmit from useChat)
      handleVercelSubmit(e);
      
      // Focus input for next message
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error in Grok chat:', error);
      
      // Show network-specific error if offline
      if (isOffline || (error instanceof Error && (error.message.includes('network') || error.message.includes('failed to fetch')))) {
        setError("Network connection issue. Please check your internet and try again.");
      } else {
        setError('Failed to get a response. Please try again.');
      }
    }
  };

  return {
    messages,
    error,
    isLoading,
    input,
    isConfigured,
    isOffline,
    handleInputChange,
    handleSubmit,
    inputRef
  };
};
