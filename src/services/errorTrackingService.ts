
// Simple error tracking service that can be expanded or integrated with third-party services

type ErrorMetadata = Record<string, any>;

class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private isInitialized = false;
  private environment: string;

  private constructor() {
    this.environment = import.meta.env.MODE || 'development';
  }

  public static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  public initialize(): void {
    if (this.isInitialized) {
      return;
    }

    // Add global error handler
    window.addEventListener('error', (event) => {
      this.captureException(event.error || new Error(event.message), {
        source: 'window.onerror',
        lineno: event.lineno,
        colno: event.colno,
        filename: event.filename
      });
    });

    // Add unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), {
        source: 'unhandledrejection'
      });
    });

    this.isInitialized = true;
    console.info('Error tracking service initialized');
  }

  public captureException(error: Error, metadata: ErrorMetadata = {}): void {
    // In production, you would send this to your error tracking service
    // For now, we just log it in a structured way
    if (this.environment === 'production') {
      // Here you would typically send the error to a service like Sentry, LogRocket, etc.
      console.error('[Error Tracking]', {
        timestamp: new Date().toISOString(),
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        metadata: {
          ...metadata,
          url: window.location.href,
          userAgent: navigator.userAgent
        }
      });
    } else {
      // In development, just log with full details
      console.error('[DEV Error]', error, metadata);
    }
  }

  public captureMessage(message: string, metadata: ErrorMetadata = {}): void {
    if (this.environment === 'production') {
      console.warn('[Error Tracking] Message:', message, metadata);
      // Send to error tracking service in production
    } else {
      console.warn('[DEV Message]', message, metadata);
    }
  }

  public setUser(userId: string, email?: string): void {
    // In production, you would associate the current session with a user
    console.info('Set user context:', { userId, email });
  }

  public clearUser(): void {
    // Clear user association
    console.info('User context cleared');
  }
}

export default ErrorTrackingService.getInstance();
