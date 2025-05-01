
interface ErrorContext {
  [key: string]: any;
}

/**
 * Simple error tracking service for the application
 */
class ErrorTrackingService {
  private enabled: boolean = process.env.NODE_ENV === 'production';
  
  /**
   * Capture and log an exception
   */
  captureException(error: Error, context: ErrorContext = {}): void {
    // Log to console in all environments
    console.error(`[ErrorTracker] Error:`, error, 'Context:', context);
    
    // In production, we could send to a proper error tracking service
    if (this.enabled) {
      // Here you could integrate with Sentry, LogRocket, etc.
      try {
        // Example placeholder for integration with error tracking
        this.sendToErrorService(error, context);
      } catch (sendError) {
        // Fail silently if error tracking itself fails
        console.error('Failed to send error to tracking service', sendError);
      }
    }
  }
  
  /**
   * Placeholder for sending to an actual error service
   */
  private sendToErrorService(error: Error, context: ErrorContext): void {
    // In a real implementation, this would send to Sentry, LogRocket, etc.
    // For now, we're just logging to console
  }
  
  /**
   * Enable or disable error tracking
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
}

// Export a singleton instance
const errorTrackingService = new ErrorTrackingService();
export default errorTrackingService;
