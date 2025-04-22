
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
    });

    // Add unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.captureException(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), {
        source: 'unhandledrejection'
      });
    });
    
    // Add performance monitoring
    if (this.environment === 'production' && 'PerformanceObserver' in window) {
      this.initPerformanceMonitoring();
    }

    this.isInitialized = true;
    console.info('Error tracking service initialized');
  }
  
  private initPerformanceMonitoring(): void {
    try {
      // Monitor Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry && lastEntry.startTime > 2500) {
          console.warn('High LCP detected:', lastEntry.startTime);
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });
      
      // Monitor First Input Delay (FID)
      const fidObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          const typedEntry = entry as PerformanceEntryWithTiming;
          if (typedEntry.processingStart && typedEntry.processingStart - typedEntry.startTime > 100) {
            console.warn('High FID detected:', typedEntry.processingStart - typedEntry.startTime);
          }
        }
      });
      fidObserver.observe({ type: 'first-input', buffered: true });
      
      // Monitor Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries()) {
          const typedEntry = entry as PerformanceEntryWithTiming;
          if (!typedEntry.hadRecentInput) {
            clsValue += typedEntry.value || 0;
          }
        }
        if (clsValue > 0.1) {
          console.warn('High CLS detected:', clsValue);
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });
      
      console.info('Performance monitoring initialized');
    } catch (e) {
      console.error('Failed to initialize performance monitoring:', e);
    }
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
