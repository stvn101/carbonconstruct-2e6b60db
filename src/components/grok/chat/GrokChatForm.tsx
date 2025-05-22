
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon, User, WifiOff } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface GrokChatFormProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  placeholder: string;
  isLoading: boolean;
  isConfigured: boolean;
  isOffline?: boolean;
}

const GrokChatForm: React.FC<GrokChatFormProps> = ({
  input,
  handleInputChange,
  handleSubmit,
  placeholder,
  isLoading,
  isConfigured,
  isOffline = false
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { isMobile } = useIsMobile();
  
  if (!isConfigured) {
    return null;
  }
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <div className="relative flex-grow">
        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder={isOffline ? "Offline mode - limited functionality" : placeholder}
          value={input}
          onChange={handleInputChange}
          className={`pl-9 ${isOffline ? 'bg-muted text-muted-foreground' : ''}`}
          disabled={isLoading || isOffline}
          autoComplete="off"
          style={isMobile ? { fontSize: '16px', paddingTop: '10px', paddingBottom: '10px' } : {}}
        />
      </div>
      <Button 
        type="submit" 
        size={isMobile ? "default" : "icon"} 
        disabled={!input.trim() || isLoading || isOffline}
        className={isMobile ? "h-10 px-4" : ""}
      >
        {isOffline ? (
          <WifiOff className="h-4 w-4" />
        ) : (
          <SendIcon className="h-4 w-4" />
        )}
        {isMobile && <span className="ml-2">{isOffline ? "Offline" : "Send"}</span>}
      </Button>
    </form>
  );
};

export default GrokChatForm;
