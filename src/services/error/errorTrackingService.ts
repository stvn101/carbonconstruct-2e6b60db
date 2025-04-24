
import { ErrorMetadata, ErrorTracker } from './types';
import { initializeErrorHandling } from './errorInitializer';
import { formatError, getElementPath } from './errorUtils';
import { ErrorStore } from './errorStore';

class ErrorTrackingService implements ErrorTracker {
  private static instance: ErrorTrackingService;
  private isInitialized = false;
  private environment: string;
  private errorStore: ErrorStore;
  
  private constructor() {
    this.environment = import.meta.env.MODE || 'development';
    this.errorStore = new ErrorStore();
  }

  public static getInstance(): ErrorTrackingService {
    if (!ErrorTrackingService.instance) {
      ErrorTrackingService.instance = new ErrorTrackingService();
    }
    return ErrorTrackingService.instance;
  }

  public initialize(): void {
    if (this.isInitialized) return;
    initializeErrorHandling(this);
    this.isInitialized = true;
    console.info('Error tracking service initialized');
  }

  public captureException(error: Error, metadata: ErrorMetadata = {}): void {
    if (!error) return;
    
    const errorKey = `${error.name}:${error.message}`;
    
    if (this.errorStore.hasReachedLimit(errorKey)) {
      if (this.errorStore.incrementErrorCount(errorKey) === this.errorStore.getMaxErrorsLimit() + 1) {
        console.warn(`Error "${errorKey}" occurred too many times. Suppressing future logs.`);
      }
      return;
    }

    if (this.errorStore.shouldThrottleError(errorKey)) {
      return;
    }
    
    if (!navigator.onLine) {
      this.errorStore.storeOfflineError(error, metadata);
      return;
    }
    
    if (this.environment === 'production') {
      console.error('[Error Tracking]', formatError(error, metadata));
      this.errorStore.executeCallbacks(error);
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

  private sendOfflineErrors(): void {
    const errors = this.errorStore.getOfflineErrors();
    errors.forEach(({error, metadata}) => {
      this.captureException(error, {...metadata, wasOffline: true});
    });
  }
}

export default ErrorTrackingService.getInstance();
