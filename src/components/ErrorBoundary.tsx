
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home, ChevronLeft } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetCondition?: any;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
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
        errorInfo: null
      });
    }
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  private handleGoBack = () => {
    window.history.back();
    this.handleReset();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <Card className="max-w-2xl w-full p-6">
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="mb-2">Something went wrong</AlertTitle>
              <AlertDescription className="text-sm">
                We apologize for the inconvenience. The application has encountered an error.
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
                <Button onClick={this.handleReset} className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button variant="outline" onClick={this.handleGoBack} className="flex items-center gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Go Back
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
