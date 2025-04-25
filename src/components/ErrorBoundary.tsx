
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, ChevronLeft, Wifi, WifiOff } from "lucide-react";
import errorTrackingService from "@/services/error/errorTrackingService";
import { toast } from "sonner";
import { checkNetworkStatus } from "@/utils/errorHandling";
import { checkSupabaseConnectionWithRetry } from "@/services/supabase/connection";

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error, resetErrorBoundary: () => void }) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetCondition?: any;
  feature?: string;
  className?: string;
  ignoreErrors?: boolean; // Option to ignore certain errors
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isChecking: boolean;
}

// Set of already shown error messages to prevent duplicates
const shownErrorMessages = new Set<string>();

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isChecking: false
  };

  // Clean up error tracking on unmount
  public componentWillUnmount() {
    shownErrorMessages.clear();
  }

  // Check if the error should be ignored
  private shouldIgnoreError(error: Error): boolean {
    if (this.props.ignoreErrors) {
      // Expanded list of network-related errors to ignore
      if (error.message && (
        error.message.includes("duplicate key") || 
        error.message.includes("23505") ||
        error.message.includes("Failed to fetch") ||
        error.message.includes("timed out") ||
        error.message.includes("timeout") ||
        error.message.includes("Network request failed") ||
        error.message.includes("NetworkError") ||
        error.message.includes("AbortError") ||
        error.message.includes("network") ||
        error.message.includes("Network Error") ||
        error.message.includes("offline") ||
        error.message.includes("connection") ||
        // Add more database-related errors
        error.message.includes("database connection") ||
        error.message.includes("connection refused") ||
        error.message.includes("pool timeout") ||
        error.message.includes("connection terminated")
      )) {
        return true;
      }
    }
    return false;
  }

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error, 
      errorInfo: null,
      isChecking: false 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Ignore certain errors if the ignoreErrors prop is true
    if (this.shouldIgnoreError(error)) {
      this.setState({ hasError: false, error: null, errorInfo: null, isChecking: false });
      
      // For network errors, display a different toast
      // Only show if this exact message hasn't been shown recently
      const errorKey = `${error.name}:${error.message}`;
      
      if (!shownErrorMessages.has(errorKey)) {
        shownErrorMessages.add(errorKey);
        
        if (error.message && (
          error.message.includes("Failed to fetch") || 
          error.message.includes("Network request failed") || 
          error.message.includes("NetworkError")
        )) {
          toast.error("Network connection issue detected. Please check your internet connection.", {
            id: "network-error",
            duration: 5000,
            icon: <WifiOff className="h-5 w-5" />
          });
        } else if (error.message && (error.message.includes("timed out") || error.message.includes("timeout"))) {
          toast.error("Operation timed out. Please check your connection and try again.", {
            id: "timeout-error",
            duration: 5000
          });
        }
        
        // Auto-remove from tracking after 1 minute
        setTimeout(() => {
          shownErrorMessages.delete(errorKey);
        }, 60000);
      }
      
      return;
    }

    this.setState({
      error,
      errorInfo
    });

    // Track the error with our error tracking service
    errorTrackingService.captureException(error, {
      componentStack: errorInfo.componentStack,
      source: this.props.feature || 'ErrorBoundary',
      url: window.location.href,
      route: window.location.pathname
    });

    // Call onError prop if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public componentDidUpdate(prevProps: Props) {
    // Reset error state if resetCondition prop changes
    if (this.props.resetCondition !== prevProps.resetCondition && this.state.hasError) {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isChecking: false
      });
    }
  }

  private handleReset = async () => {
    // Set checking state to show loading indicator
    this.setState({ isChecking: true });
    
    try {
      // Check network status first
      const isOnline = await checkNetworkStatus();
      
      if (!isOnline) {
        toast.error("You're currently offline. Please check your connection first.", {
          id: "reset-offline-error",
          duration: 5000,
        });
        this.setState({ isChecking: false });
        return;
      }
      
      // Then check database connection if we're online
      const dbConnected = await checkSupabaseConnectionWithRetry(1, 1500);
      
      if (!dbConnected) {
        toast.error("Cannot connect to the server. Please try again when you have better connectivity.", {
          id: "reset-db-error",
          duration: 5000,
        });
        this.setState({ isChecking: false });
        return;
      }
      
      // Only reset if both checks pass
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isChecking: false
      });
    } catch (error) {
      console.error("Error while checking connection:", error);
      
      // Still reset the error state, but show a warning
      toast.warning("Connection check failed, but attempting recovery anyway", {
        id: "reset-warning",
        duration: 3000,
      });
      
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        isChecking: false
      });
    }
  };

  private handleGoBack = () => {
    window.history.back();
    this.handleReset();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleRefresh = () => {
    window.location.reload();
  };

  private isNetworkRelatedError(): boolean {
    const error = this.state.error;
    if (!error) return false;
    
    return error.message && (
      error.message.includes("Failed to fetch") || 
      error.message.includes("Network request failed") ||
      error.message.includes("NetworkError") ||
      error.message.includes("AbortError") ||
      error.message.includes("network") ||
      error.message.includes("Network Error") ||
      error.message.includes("offline") ||
      error.message.includes("connection")
    );
  }

  public render() {
    // If the error should be ignored, just render the children
    if (this.state.hasError && this.state.error && this.shouldIgnoreError(this.state.error)) {
      return this.props.children;
    }

    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return (this.props.fallback as Function)({ 
            error: this.state.error as Error, 
            resetErrorBoundary: this.handleReset 
          });
        }
        return this.props.fallback;
      }

      const isNetworkError = this.isNetworkRelatedError();

      return (
        <div className={`min-h-[200px] flex items-center justify-center p-4 ${this.props.className || ''}`}>
          <Card className="max-w-2xl w-full p-6">
            <Alert variant={isNetworkError ? "warning" : "destructive"} className="mb-6">
              {isNetworkError ? (
                <Wifi className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
              <AlertTitle className="mb-2">
                {isNetworkError 
                  ? "Connection Issue Detected" 
                  : this.props.feature 
                    ? `${this.props.feature} Error` 
                    : 'Something went wrong'}
              </AlertTitle>
              <AlertDescription className="text-sm">
                {isNetworkError 
                  ? "We're having trouble connecting to our servers. Please check your internet connection and try again."
                  : "We apologize for the inconvenience. This section has encountered an error."}
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-medium mb-2">Error Details</h3>
                <div className="bg-background/95 p-3 rounded-md overflow-auto max-h-48 text-sm font-mono">
                  {this.state.error?.toString() || "Unknown error"}
                </div>
                {this.state.errorInfo?.componentStack && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-muted-foreground">Stack trace</summary>
                    <pre className="mt-2 text-xs overflow-auto p-2 bg-background/95 rounded">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.handleReset} 
                  className="flex items-center gap-2"
                  disabled={this.state.isChecking}
                >
                  <RefreshCw className={`h-4 w-4 ${this.state.isChecking ? 'animate-spin' : ''}`} />
                  {this.state.isChecking ? 'Checking Connection...' : 'Try Again'}
                </Button>
                <Button variant="outline" onClick={this.handleGoBack} className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Go Back
                </Button>
                <Button variant="secondary" onClick={this.handleRefresh} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reload Page
                </Button>
                <Button variant="secondary" onClick={this.handleGoHome} className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Return Home
                </Button>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
