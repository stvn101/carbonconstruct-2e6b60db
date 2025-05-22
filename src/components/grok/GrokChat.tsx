
import React from 'react';
import GrokChatContainer from './chat/GrokChatContainer';
import { useGrokChatLogic } from './chat/useGrokChatLogic';
import { GrokChatProps } from '@/types/grok';

const GrokChat: React.FC<GrokChatProps> = ({ 
  placeholder = 'Ask Grok AI a question...',
  title = 'Grok AI Assistant',
  initialContext,
  className
}) => {
  const {
    messages,
    error,
    isLoading,
    input,
    isConfigured,
    handleInputChange,
    handleSubmit
  } = useGrokChatLogic({ initialContext });

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
      placeholder={placeholder}
      className={className}
    />
  );
};

export default GrokChat;
