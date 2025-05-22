
import React from 'react';
import GrokChatContainer from './chat/GrokChatContainer';
import { useGrokChatLogic } from './chat/useGrokChatLogic';
import { GrokChatProps } from '@/types/grok';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * GrokChat Component
 * 
 * A chat interface component for interacting with Grok AI assistant.
 * It supports both online and offline modes, with responsive design for mobile.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.placeholder="Ask Grok AI a question..."] - Placeholder text for the input field
 * @param {string} [props.title="Grok AI Assistant"] - Title displayed at the top of the chat
 * @param {string} [props.initialContext] - Initial context to provide to Grok AI
 * @param {string} [props.className] - Additional CSS classes
 * 
 * @example
 * <GrokChat 
 *   placeholder="Ask about sustainable materials..."
 *   title="Materials Assistant"
 *   initialContext="I'm looking for low-carbon concrete alternatives."
 * />
 */
const GrokChat: React.FC<GrokChatProps> = ({ 
  placeholder = 'Ask Grok AI a question...',
  title = 'Grok AI Assistant',
  initialContext,
  className
}) => {
  const { isMobile } = useIsMobile();
  
  const {
    messages,
    error,
    isLoading,
    input,
    isConfigured,
    isOffline,
    handleInputChange,
    handleSubmit
  } = useGrokChatLogic({ initialContext });

  // Log component render for debugging in development
  if (process.env.NODE_ENV === 'development') {
    console.debug('[GrokChat] Rendering with:', { 
      messageCount: messages.length, 
      hasError: !!error, 
      isLoading, 
      isConfigured,
      isOffline
    });
  }

  return (
    <GrokChatContainer
      messages={messages}
      error={error}
      title={title}
      isLoading={isLoading}
      isConfigured={isConfigured}
      input={input}
      handleInputChange={handleInputChange}
      handleSubmit={handleSubmit}
      placeholder={isMobile ? 'Ask Grok...' : placeholder}
      className={className}
    />
  );
};

export default GrokChat;
