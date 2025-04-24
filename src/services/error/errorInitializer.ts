
import { ErrorTracker } from './types';

export function initializeErrorHandling(errorTracker: ErrorTracker): void {
  window.addEventListener('error', (event) => {
    errorTracker.captureException(event.error || new Error(event.message), {
      source: 'window.onerror',
      lineno: event.lineno,
      colno: event.colno,
      filename: event.filename
    });
    
    if (import.meta.env.MODE === 'production') {
      event.preventDefault();
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    errorTracker.captureException(
      event.reason instanceof Error ? event.reason : new Error(String(event.reason)), 
      { source: 'unhandledrejection' }
    );
    
    if (import.meta.env.MODE === 'production') {
      event.preventDefault();
    }
  });

  window.addEventListener('online', () => errorTracker.flush());

  if (navigator.onLine) {
    errorTracker.flush();
  }
}
