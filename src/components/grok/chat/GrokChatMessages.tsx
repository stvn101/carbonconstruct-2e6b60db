
import React, { useRef, useEffect } from 'react';
import { Brain } from 'lucide-react';
import { GrokChatMessage } from '@/types/grok';

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
  return (
    <>
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
