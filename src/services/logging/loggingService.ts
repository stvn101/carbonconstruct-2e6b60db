
import { toast } from 'sonner';

// Define log levels
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4
}

// Configuration object for logging
interface LoggingConfig {
  minLevel: LogLevel;
  enableConsoleOutput: boolean;
  enableRemoteLogging: boolean;
  enableUserFeedback: boolean;
  maxQueueSize: number;
  flushInterval: number;
}

// Define log entry structure
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  tags?: string[];
  data?: any;
  stack?: string;
  userId?: string;
}

class LoggingService {
  private static instance: LoggingService;
  private config: LoggingConfig = {
    minLevel: LogLevel.INFO,
    enableConsoleOutput: true,
    enableRemoteLogging: false,
    enableUserFeedback: true,
    maxQueueSize: 100,
    flushInterval: 30000 // 30 seconds
  };
  
  private logQueue: LogEntry[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private userId: string | null = null;

  private constructor() {
    // Set environment-specific defaults
    if (process.env.NODE_ENV === 'development') {
      this.config.minLevel = LogLevel.DEBUG;
      this.config.enableRemoteLogging = false;
    }
    
    // Start periodic flush
    this.startFlushTimer();
    
    // Handle unload event to flush logs
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.flush();
      });
    }
  }

  public static getInstance(): LoggingService {
    if (!LoggingService.instance) {
      LoggingService.instance = new LoggingService();
    }
    return LoggingService.instance;
  }

  public configure(config: Partial<LoggingConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Restart the flush timer with new interval if needed
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.startFlushTimer();
    }
  }

  public setUserId(userId: string | null): void {
    this.userId = userId;
  }

  private startFlushTimer(): void {
    if (this.config.enableRemoteLogging && this.config.flushInterval > 0) {
      this.flushTimer = setInterval(() => this.flush(), this.config.flushInterval);
    }
  }

  private addToQueue(entry: LogEntry): void {
    // Add user ID if available
    if (this.userId) {
      entry.userId = this.userId;
    }
    
    // Add to queue
    this.logQueue.push(entry);
    
    // Flush if queue gets too large
    if (this.logQueue.length >= this.config.maxQueueSize) {
      this.flush();
    }
  }

  private createEntry(
    level: LogLevel, 
    message: string, 
    context?: string, 
    data?: any, 
    tags?: string[]
  ): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      tags,
      data
    };
    
    // Add stack trace for errors and above
    if (level >= LogLevel.ERROR && data instanceof Error) {
      entry.stack = data.stack;
      entry.data = {
        name: data.name,
        message: data.message,
        ...entry.data
      };
    }
    
    return entry;
  }

  private consoleOutput(entry: LogEntry): void {
    if (!this.config.enableConsoleOutput) return;

    const timestamp = new Date(entry.timestamp).toLocaleTimeString();
    const prefix = `[${timestamp}]`;
    
    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.context ? `[${entry.context}]` : '', entry.message, entry.data || '');
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.context ? `[${entry.context}]` : '', entry.message, entry.data || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.context ? `[${entry.context}]` : '', entry.message, entry.data || '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, entry.context ? `[${entry.context}]` : '', entry.message, entry.data || '');
        if (entry.stack) console.error(entry.stack);
        break;
      case LogLevel.FATAL:
        console.error(prefix, entry.context ? `[${entry.context}]` : '', 'FATAL:', entry.message, entry.data || '');
        if (entry.stack) console.error(entry.stack);
        break;
    }
  }

  private async sendToRemote(entries: LogEntry[]): Promise<boolean> {
    if (!this.config.enableRemoteLogging || entries.length === 0) {
      return true;
    }
    
    try {
      // This would be implemented to send logs to a backend service
      // For example:
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ logs: entries })
      // });
      
      // For now, we'll just simulate success
      console.log(`Would send ${entries.length} logs to remote service`);
      return true;
    } catch (error) {
      console.error('Failed to send logs to remote service', error);
      return false;
    }
  }

  public async flush(): Promise<boolean> {
    if (this.logQueue.length === 0) {
      return true;
    }
    
    const entries = [...this.logQueue];
    
    if (this.config.enableRemoteLogging) {
      const success = await this.sendToRemote(entries);
      
      if (success) {
        this.logQueue = this.logQueue.slice(entries.length);
        return true;
      }
      
      return false;
    }
    
    // If remote logging is disabled, just clear the queue
    this.logQueue = [];
    return true;
  }

  public log(
    level: LogLevel, 
    message: string, 
    context?: string, 
    data?: any, 
    tags?: string[]
  ): void {
    // Skip if below minimum level
    if (level < this.config.minLevel) {
      return;
    }
    
    const entry = this.createEntry(level, message, context, data, tags);
    
    // Output to console
    this.consoleOutput(entry);
    
    // Add to queue for remote logging
    this.addToQueue(entry);
    
    // Show user feedback for important logs
    if (this.config.enableUserFeedback && level >= LogLevel.ERROR) {
      this.showUserFeedback(entry);
    }
  }

  public debug(message: string, context?: string, data?: any, tags?: string[]): void {
    this.log(LogLevel.DEBUG, message, context, data, tags);
  }

  public info(message: string, context?: string, data?: any, tags?: string[]): void {
    this.log(LogLevel.INFO, message, context, data, tags);
  }

  public warn(message: string, context?: string, data?: any, tags?: string[]): void {
    this.log(LogLevel.WARN, message, context, data, tags);
  }

  public error(message: string, context?: string, error?: Error, tags?: string[]): void {
    this.log(LogLevel.ERROR, message, context, error, tags);
  }

  public fatal(message: string, context?: string, error?: Error, tags?: string[]): void {
    this.log(LogLevel.FATAL, message, context, error, tags);
  }

  private showUserFeedback(entry: LogEntry): void {
    // Only show user feedback for errors and fatals
    if (entry.level < LogLevel.ERROR) return;
    
    const toastId = `log-${entry.level}-${Date.now()}`;
    
    if (entry.level === LogLevel.ERROR) {
      toast.error(entry.message, { id: toastId });
    } else if (entry.level === LogLevel.FATAL) {
      toast.error(`Critical Error: ${entry.message}`, { 
        id: toastId,
        duration: 0 // No auto-dismiss for fatal errors
      });
    }
  }
}

// Export a singleton instance
export const logger = LoggingService.getInstance();

// Export default for ease of use
export default logger;
