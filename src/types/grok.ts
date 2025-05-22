
export interface GrokChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface GrokChatProps {
  placeholder?: string;
  title?: string;
  initialContext?: string;
  className?: string;
}
