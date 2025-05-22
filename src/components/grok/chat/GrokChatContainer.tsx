
import React, { useRef } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import GrokChatMessages from './GrokChatMessages';
import GrokChatForm from './GrokChatForm';
import GrokChatError from './GrokChatError';
import GrokChatUnconfigured from './GrokChatUnconfigured';
import GrokUsageDisplay from '../GrokUsageDisplay';
import { GrokChatMessage } from '@/types/grok';
import { useIsMobile } from '@/hooks/use-mobile';
import { WifiOff } from 'lucide-react';
import { useSimpleOfflineMode } from '@/hooks/useSimpleOfflineMode';

interface GrokChatContainerProps {
  messages: GrokChatMessage[];
  error: string | null;
  title: string;
  isLoading: boolean;
  isConfigured: boolean;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  placeholder: string;
  className?: string;
}

const GrokChatContainer: React.FC<GrokChatContainerProps> = ({
  messages,
  error,
  title,
  isLoading,
  isConfigured,
  input,
  handleInputChange,
  handleSubmit,
  placeholder,
  className
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useIsMobile();
  const { isOffline, checkConnection } = useSimpleOfflineMode();

  // Handle offline state display
  const displayOfflineMessage = isOffline && isConfigured;

  return (
    <Card className={`flex flex-col ${isMobile ? 'h-[calc(100vh-240px)]' : 'h-[calc(100vh-320px)] md:h-[600px]'} ${className}`}>
      {/* Chat messages area with offline state handling */}
      <CardContent className="flex-1 overflow-y-auto py-4 px-3 sm:py-6 sm:px-6 relative">
        {displayOfflineMessage && (
          <div className="absolute top-0 left-0 right-0 bg-amber-50 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800 p-2 sm:p-3 flex items-center justify-center">
            <WifiOff className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400 mr-2" />
            <span className="text-xs sm:text-sm text-amber-700 dark:text-amber-300">
              You're offline. Grok services will be limited until connection is restored.
            </span>
          </div>
        )}
        
        <GrokChatMessages 
          messages={messages}
          title={title}
          messagesEndRef={messagesEndRef}
        />
      </CardContent>
      
      {/* Input area with improved error handling */}
      <CardFooter className="p-3 sm:p-4 border-t">
        <GrokChatError error={error} isOffline={isOffline} onCheckConnection={checkConnection} />
        
        {!isConfigured ? (
          <GrokChatUnconfigured />
        ) : (
          <div className="w-full flex flex-col sm:flex-row gap-2">
            <div className="flex-grow relative">
              <GrokChatForm
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                placeholder={isMobile ? "Ask Grok..." : placeholder}
                isLoading={isLoading}
                isConfigured={isConfigured}
                isOffline={isOffline}
              />
            </div>
            
            {/* Usage display - compact on mobile, expanded on larger screens */}
            <div className={isMobile ? "mt-2 w-full" : "hidden sm:block w-48"}>
              <GrokUsageDisplay compact={!isMobile} />
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default GrokChatContainer;
