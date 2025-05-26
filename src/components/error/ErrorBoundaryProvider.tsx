import React, { Component, ErrorInfo, type ReactNode } from "react";
import { shownErrorToasts } from "@/utils/errorHandling/toastHelpers";
import ErrorTrackingService from "@/services/error/errorTrackingService";
import { ErrorFallback } from "./ErrorFallback";
import { shouldIgnoreError } from "@/utils/errorHandling/errorUtils";
import { toast } from "sonner";

interface Props {
  children: ReactNode;
  fallback?: ReactNode | ((props: { error: Error, resetErrorBoundary: () => void }) => ReactNode);
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetCondition?: any;
  feature?: string;
  className?: string;
  ignoreErrors?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  isChecking: boolean;
  retryCount: number;
}

export class ErrorBoundaryProvider extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    isChecking: false,
    retryCount: 0
  };

  public componentWillUnmount() {
    shownErrorToasts.clear();
  }

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { 
      hasError: true, 
      error, 
      errorInfo: null,
      isChecking: false 
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (this.props.ignoreErrors && shouldIgnoreError(error)) {
      this.setState({ hasError: false, error: null, errorInfo: null, isChecking: false });
      return;
    }

    this.setState({ errorInfo });

    ErrorTrackingService.captureException(error, {
      componentStack: errorInfo.componentStack,
      source: this.props.feature || 'ErrorBoundary',
      url: window.location.href,
      route: window.location.pathname,
      retryCount: this.state.retryCount
    });

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Show error toast if not already shown
    const errorId = `error-${this.props.feature || 'unknown'}-${error.message}`;
    if (!shownErrorToasts.has(errorId)) {
      toast.error("An error occurred. Please try again or contact support if the problem persists.", {
        id: errorId,
        duration: 5000
      });
      shownErrorToasts.add(errorId);
    }
  }

  public componentDidUpdate(prevProps: Props) {
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
    const { maxRetries = 3, retryDelay = 1000 } = this.props;
    
    if (this.state.retryCount < maxRetries) {
      this.setState({ isChecking: true });
      
      try {
        // Wait for the specified delay
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        // Reset the error state
        this.setState({
          hasError: false,
          error: null,
          errorInfo: null,
          isChecking: false,
          retryCount: this.state.retryCount + 1
        });
        
        toast.success("Recovery successful. The application has been reset.");
      } catch (error) {
        this.setState({ isChecking: false });
        toast.error("Failed to recover from the error. Please try reloading the page.");
      }
    } else {
      // If max retries reached, suggest page reload
      toast.error("Maximum retry attempts reached. Please reload the page.", {
        action: {
          label: "Reload",
          onClick: () => window.location.reload()
        }
      });
    }
  };

  public render() {
    if (this.state.hasError && this.state.error && this.props.ignoreErrors && shouldIgnoreError(this.state.error)) {
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

      return (
        <ErrorFallback 
          error={this.state.error as Error}
          resetErrorBoundary={this.handleReset}
          feature={this.props.feature}
          className={this.props.className}
          isChecking={this.state.isChecking}
          retryCount={this.state.retryCount}
        />
      );
    }

    return this.props.children;
  }
}
