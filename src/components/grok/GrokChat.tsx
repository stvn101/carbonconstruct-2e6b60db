
import React, { useState, useRef, useEffect } from 'react';
import { useGrok } from '@/contexts/GrokContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GrokResponse } from '@/services/GrokService';
import { Loader2, SendIcon, Settings2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Select,
  SelectContent, 
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface GrokChatProps {
  initialContext?: any;
  initialMode?: string;
  placeholder?: string;
  title?: string;
  className?: string;
}

const GrokChat: React.FC<GrokChatProps> = ({
  initialContext,
  initialMode = 'general',
  placeholder = "Ask Grok about sustainable construction...",
  title = "Grok AI Assistant",
  className = ""
}) => {
  const { askGrok, isConfigured, isProcessing } = useGrok();
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'Hello! I\'m Grok, your sustainable construction assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [mode, setMode] = useState(initialMode);
  const [context, setContext] = useState(initialContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of messages when new ones are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim() || !isConfigured) return;
    
    const userMessage: Message = {
      role: 'user',
      content: prompt,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setPrompt('');
    
    try {
      const response = await askGrok(prompt, context, mode as any);
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response.error ? `Error: ${response.error}` : response.response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `I encountered an error: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <Card className={`flex flex-col h-[600px] ${className}`}>
      <CardHeader className="px-4 py-3 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold text-carbon-700 dark:text-carbon-300">{title}</CardTitle>
          <Select value={mode} onValueChange={setMode}>
            <SelectTrigger className="w-[180px] h-8 text-xs">
              <SelectValue placeholder="Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="general">General</SelectItem>
              <SelectItem value="material_analysis">Material Analysis</SelectItem>
              <SelectItem value="compliance_check">Compliance Check</SelectItem>
              <SelectItem value="sustainability_advisor">Sustainability Advisor</SelectItem>
              <SelectItem value="creative">Creative Mode</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-4 overflow-y-auto">
        {!isConfigured && (
          <Alert className="mb-4">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Grok AI is not configured. Please set up your API key in settings.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div 
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-carbon-600 text-white' 
                    : message.role === 'system'
                      ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' 
                      : 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <CardFooter className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={placeholder}
            className="flex-grow min-h-[60px] resize-none"
            disabled={isProcessing || !isConfigured}
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isProcessing || !prompt.trim() || !isConfigured}
            className="self-end h-[60px] w-[60px]"
          >
            {isProcessing ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <SendIcon className="h-5 w-5" />
            )}
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default GrokChat;
