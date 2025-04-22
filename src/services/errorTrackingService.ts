
// Enhanced error tracking service with production optimizations

type ErrorMetadata = Record<string, any>;

interface PerformanceEntryWithTiming extends PerformanceEntry {
  processingStart?: number;
  startTime: number;
  value?: number;
  hadRecentInput?: boolean;
}

class ErrorTrackingService {
  private static instance: ErrorTrackingService;
  private isInitialized = false;
  private environment: string;
  private errorCount: Record<string, number> = {};
  private readonly MAX_ERRORS_PER_TYPE = 5;
  
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
      
      // Prevent default error handling in production to improve UX
      if (this.environment === 'production') {
        event.preventDefault();
      }
    });

    // Add unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), {
        source: 'unhandledrejection'
      });
      
      // Prevent default handling in production
      if (this.environment === 'production') {
        event.preventDefault();
      }
    });

    this.isInitialized = true;
    console.info('Error tracking service initialized');
  }

  public captureException(error: Error, metadata: ErrorMetadata = {}): void {
    const errorKey = `${error.name}:${error.message}`;
    this.errorCount[errorKey] = (this.errorCount[errorKey] || 0) + 1;
    
    // Avoid logging the same error too many times
    if (this.errorCount[errorKey] > this.MAX_ERRORS_PER_TYPE) {
      if (this.errorCount[errorKey] === this.MAX_ERRORS_PER_TYPE + 1) {
        console.warn(`Error "${errorKey}" occurred too many times. Suppressing future logs.`);
      }
      return;
    }
    
    // In production, you would send this to a service like Sentry, LogRocket, etc.
    if (this.environment === 'production') {
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
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          }
        },
        count: this.errorCount[errorKey]
      });
    } else {
      // In development, just log with full details
      console.error('[DEV Error]', error, metadata);
    }
  }

  public captureMessage(message: string, metadata: ErrorMetadata = {}): void {
    if (this.environment === 'production') {
      console.warn('[Error Tracking] Message:', message, metadata);
    } else {
      console.warn('[DEV Message]', message, metadata);
    }
  }

  public setUser(userId: string, email?: string): void {
    console.info('Set user context:', { userId, email });
  }

  public clearUser(): void {
    console.info('User context cleared');
  }
  
  // Add accessibility error reporting
  public captureAccessibilityIssue(element: HTMLElement, issue: string): void {
    const elementPath = this.getElementPath(element);
    this.captureMessage(`Accessibility issue: ${issue}`, {
      elementPath,
      elementType: element.tagName,
      elementId: element.id,
      elementClasses: element.className
    });
  }
  
  // Helper to get DOM path for element
  private getElementPath(element: HTMLElement): string {
    const path: string[] = [];
    let currentElem: HTMLElement | null = element;
    
    while (currentElem && currentElem !== document.body) {
      let selector = currentElem.tagName.toLowerCase();
      
      if (currentElem.id) {
        selector += `#${currentElem.id}`;
      } else if (currentElem.className) {
        selector += `.${currentElem.className.split(' ')[0]}`;
      }
      
      path.unshift(selector);
      currentElem = currentElem.parentElement;
      
      // Limit path length
      if (path.length > 5) break;
    }
    
    return path.join(' > ');
  }
}

export default ErrorTrackingService.getInstance();
