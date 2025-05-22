
import React, { useState, useRef, useEffect } from 'react';
import { useGrok } from '@/contexts/GrokContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useChat } from 'ai/react';
import GrokChatMessages from './chat/GrokChatMessages';
import GrokChatForm from './chat/GrokChatForm';
import GrokChatError from './chat/GrokChatError';
import GrokChatUnconfigured from './chat/GrokChatUnconfigured';
import GrokUsageDisplay from './GrokUsageDisplay';
import { GrokChatMessage, GrokChatProps } from '@/types/grok';

// Helper to get a chat message ID
const getMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const GrokChat: React.FC<GrokChatProps> = ({ 
  placeholder = 'Ask Grok AI a question...',
  title = 'Grok AI Assistant',
  initialContext,
  className
}) => {
  const { isConfigured } = useGrok();
  const [messages, setMessages] = useState<GrokChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use the Vercel AI SDK's useChat hook for streaming capabilities
  const { input, handleInputChange, handleSubmit: handleVercelSubmit, isLoading } = useChat({
    api: '/api/chat', // This would be your API endpoint (we'll use the GrokContext instead)
    onFinish: (message) => {
      // Add the assistant's response to our messages array
      setMessages(prev => [...prev, {
        id: getMessageId(),
        role: 'assistant',
        content: message.content,
        timestamp: new Date()
      }]);
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
  }, [initialContext]);

  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Custom submit handler that integrates Vercel AI with our existing GrokContext
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || !isConfigured || isLoading) return;
    
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
      setError('Failed to get a response. Please try again.');
    }
  };

  return (
    <Card className={`flex flex-col h-[calc(100vh-320px)] md:h-[600px] ${className}`}>
      {/* Chat messages area with improved mobile styling */}
      <CardContent className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
        <GrokChatMessages 
          messages={messages}
          title={title}
          messagesEndRef={messagesEndRef}
        />
      </CardContent>
      
      {/* Input area */}
      <CardFooter className="p-4 border-t">
        <GrokChatError error={error} />
        
        {!isConfigured ? (
          <GrokChatUnconfigured />
        ) : (
          <div className="w-full flex flex-col sm:flex-row gap-2">
            <div className="flex-grow relative">
              <GrokChatForm
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                placeholder={placeholder}
                isLoading={isLoading}
                isConfigured={isConfigured}
              />
            </div>
            
            {/* Compact usage display on larger screens */}
            <div className="hidden sm:block w-48">
              <GrokUsageDisplay compact />
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default GrokChat;
