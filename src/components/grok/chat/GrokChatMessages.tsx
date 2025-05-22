
import React, { useRef, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { GrokChatMessage } from '@/types/grok';
import { useIsMobile } from '@/hooks/use-mobile';

interface GrokChatMessagesProps {
  messages: GrokChatMessage[];
  title: string;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const GrokChatMessages: React.FC<GrokChatMessagesProps> = ({ 
  messages, 
  title,
  messagesEndRef
}) => {
  const { isMobile } = useIsMobile();

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <>
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center text-center p-4 text-muted-foreground">
          <Brain className="h-10 w-10 sm:h-12 sm:w-12 mb-3 sm:mb-4 text-carbon-400" />
          <h3 className="text-base sm:text-lg font-medium mb-1">Welcome to {title}</h3>
          <p className="max-w-md text-sm sm:text-base">
            Ask questions about sustainable construction, materials, compliance, or best practices.
          </p>
        </div>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {messages.filter(msg => msg.role !== 'system').map(message => (
            <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[90%] sm:max-w-[75%] rounded-lg px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base ${
                  message.role === 'user' 
                    ? 'bg-carbon-600 text-white' 
                    : 'bg-carbon-100 dark:bg-carbon-800 text-carbon-800 dark:text-carbon-200'
                }`}
              >
                <div className="whitespace-pre-line">{message.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </>
  );
};

export default GrokChatMessages;
