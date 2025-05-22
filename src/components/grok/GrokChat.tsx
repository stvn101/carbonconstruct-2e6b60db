
import React, { useState, useRef, useEffect } from 'react';
import { useGrok } from '@/contexts/GrokContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon, Brain, AlertCircle, User } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { withGrokErrorHandling } from '@/utils/errorHandling/grokNetworkHandler';
import GrokUsageDisplay from './GrokUsageDisplay';

interface GrokChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface GrokChatProps {
  placeholder?: string;
  title?: string;
  initialContext?: string;
  className?: string;
}

// Helper to get a chat message ID
const getMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const GrokChat: React.FC<GrokChatProps> = ({ 
  placeholder = 'Ask Grok AI a question...',
  title = 'Grok AI Assistant',
  initialContext,
  className
}) => {
  const { askGrok, isConfigured, isProcessing } = useGrok();
  const [messages, setMessages] = useState<GrokChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || !isConfigured || isProcessing) return;
    
    // Add user message
    const userMessage: GrokChatMessage = {
      id: getMessageId(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setError(null);
    
    // Add temporary assistant message (loading state)
    const tempAssistantId = getMessageId();
    setMessages(prev => [...prev, {
      id: tempAssistantId,
      role: 'assistant',
      content: '...',
      timestamp: new Date()
    }]);
    
    try {
      // Send to Grok with enhanced error handling
      const response = await withGrokErrorHandling(
        askGrok(userMessage.content),
        {
          timeout: 60000, // 60 second timeout
          maxRetries: 2,
          context: 'chat',
          fallback: () => ({
            text: "I'm currently having trouble connecting to my knowledge base. Please try again shortly, or ask a different question.",
            error: undefined
          })
        }
      );
      
      // Replace temporary message with actual response
      setMessages(prev => prev.map(msg => 
        msg.id === tempAssistantId 
          ? {
              id: tempAssistantId,
              role: 'assistant',
              content: response.text,
              timestamp: new Date()
            }
          : msg
      ));
      
      // Focus input for next message
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error in Grok chat:', error);
      
      // Replace temporary message with error
      setMessages(prev => prev.filter(msg => msg.id !== tempAssistantId));
      setError('Failed to get a response. Please try again.');
    }
  };

  return (
    <Card className={`flex flex-col h-[calc(100vh-320px)] md:h-[600px] ${className}`}>
      {/* Chat messages area with improved mobile styling */}
      <CardContent className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
            <Brain className="h-12 w-12 mb-4 text-carbon-400" />
            <h3 className="text-lg font-medium mb-1">Welcome to {title}</h3>
            <p className="max-w-md">
              Ask questions about sustainable construction, materials, compliance, or best practices.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {messages.filter(msg => msg.role !== 'system').map(message => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] sm:max-w-[75%] rounded-lg px-4 py-2 ${
                    message.role === 'user' 
                      ? 'bg-carbon-600 text-white' 
                      : 'bg-carbon-100 dark:bg-carbon-800 text-carbon-800 dark:text-carbon-200'
                  }`}
                >
                  {message.role === 'assistant' && message.content === '...' ? (
                    <div className="flex items-center space-x-1">
                      <div className="h-1.5 w-1.5 bg-carbon-400 dark:bg-carbon-500 rounded-full animate-bounce"></div>
                      <div className="h-1.5 w-1.5 bg-carbon-400 dark:bg-carbon-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="h-1.5 w-1.5 bg-carbon-400 dark:bg-carbon-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-line">{message.content}</div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </CardContent>
      
      {/* Input area */}
      <CardFooter className="p-4 border-t">
        {error && (
          <Alert variant="destructive" className="mb-2">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!isConfigured ? (
          <div className="w-full px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 mt-0.5" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Grok AI is not configured. Please go to Settings to configure your API key.
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col sm:flex-row gap-2">
            <div className="flex-grow relative">
              <form onSubmit={handleSubmit} className="flex gap-2 w-full">
                <div className="relative flex-grow">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={inputRef}
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="pl-9"
                    disabled={isProcessing}
                  />
                </div>
                <Button 
                  type="submit" 
                  size="icon" 
                  disabled={!inputValue.trim() || isProcessing}
                >
                  <SendIcon className="h-4 w-4" />
                </Button>
              </form>
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
