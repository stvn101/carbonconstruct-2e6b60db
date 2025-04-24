
import { ErrorMetadata, ErrorTracker } from './types';
import { formatError, getElementPath, getSessionDuration } from './errorUtils';
import errorStore from './errorStore';

class ErrorTrackingService implements ErrorTracker {
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
    if (this.isInitialized) return;

    window.addEventListener('error', (event) => {
      this.captureException(event.error || new Error(event.message), {
        source: 'window.onerror',
        lineno: event.lineno,
        colno: event.colno,
        filename: event.filename
      });
      
      if (this.environment === 'production') {
        event.preventDefault();
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(
        event.reason instanceof Error ? event.reason : new Error(String(event.reason)), 
        { source: 'unhandledrejection' }
      );
      
      if (this.environment === 'production') {
        event.preventDefault();
      }
    });

    window.addEventListener('online', () => this.sendOfflineErrors());

    if (navigator.onLine) {
      this.sendOfflineErrors();
    }

    this.isInitialized = true;
    console.info('Error tracking service initialized');
  }

  private sendOfflineErrors(): void {
    const errors = errorStore.getOfflineErrors();
    errors.forEach(({error, metadata}) => {
      this.captureException(error, {...metadata, wasOffline: true});
    });
  }

  public captureException(error: Error, metadata: ErrorMetadata = {}): void {
    if (!error) return;
    
    const errorKey = `${error.name}:${error.message}`;
    
    if (errorStore.hasReachedLimit(errorKey)) {
      if (errorStore.incrementErrorCount(errorKey) === errorStore.MAX_ERRORS_PER_TYPE + 1) {
        console.warn(`Error "${errorKey}" occurred too many times. Suppressing future logs.`);
      }
      return;
    }

    if (errorStore.shouldThrottleError(errorKey)) {
      return;
    }
    
    if (!navigator.onLine) {
      errorStore.storeOfflineError(error, metadata);
      return;
    }
    
    if (this.environment === 'production') {
      console.error('[Error Tracking]', formatError(error, {
        ...metadata,
        sessionDuration: getSessionDuration(),
      }));
      errorStore.executeCallbacks(error);
    } else {
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
  
  public captureAccessibilityIssue(element: HTMLElement, issue: string): void {
    const elementPath = getElementPath(element);
    this.captureMessage(`Accessibility issue: ${issue}`, {
      elementPath,
      elementType: element.tagName,
      elementId: element.id,
      elementClasses: element.className
    });
  }

  public flush(): void {
    if (navigator.onLine) {
      this.sendOfflineErrors();
    }
  }
}

export default ErrorTrackingService.getInstance();
