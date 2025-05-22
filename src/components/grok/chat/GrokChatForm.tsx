
import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SendIcon, User } from 'lucide-react';

interface GrokChatFormProps {
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  placeholder: string;
  isLoading: boolean;
  isConfigured: boolean;
}

const GrokChatForm: React.FC<GrokChatFormProps> = ({
  input,
  handleInputChange,
  handleSubmit,
  placeholder,
  isLoading,
  isConfigured
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  if (!isConfigured) {
    return null;
  }
  
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <div className="relative flex-grow">
        <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={input}
          onChange={handleInputChange}
          className="pl-9"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        size="icon" 
        disabled={!input.trim() || isLoading}
      >
        <SendIcon className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default GrokChatForm;
