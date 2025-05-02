
import React, { useEffect, useState, Suspense } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import CarbonCalculator from "@/components/CarbonCalculator";
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CloudOff, RefreshCw, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalculatorHeader from "@/components/calculator/CalculatorHeader";
import { useA11y } from "@/hooks/useA11y";
import { useSimpleOfflineMode } from '@/hooks/useSimpleOfflineMode';
import { CalculatorProvider } from "@/contexts/calculator";
import { ProjectProvider } from "@/contexts/ProjectContext";
import { ErrorBoundary } from "react-error-boundary";

// Fallback component for when calculator is loading
const CalculatorLoading = () => (
  <div className="flex flex-col items-center justify-center p-12 space-y-4">
    <Loader2 className="h-12 w-12 text-carbon-600 animate-spin" />
    <p className="text-lg font-medium">Loading Carbon Calculator...</p>
    <p className="text-sm text-muted-foreground">This may take a moment as we prepare your calculations...</p>
  </div>
);

// Error fallback component for calculator load errors
const CalculatorLoadError = ({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) => (
  <div className="p-6 border border-destructive/50 bg-destructive/10 rounded-md text-center mx-auto max-w-2xl">
    <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
    <h3 className="text-lg font-semibold mb-2">Calculator Failed to Load</h3>
    <p className="text-muted-foreground mb-4">{error?.message || "An error occurred while loading the calculator"}</p>
    <div className="flex flex-wrap gap-2 justify-center">
      <Button 
        onClick={resetErrorBoundary}
        className="bg-carbon-600 text-white hover:bg-carbon-700"
      >
        <RefreshCw className="h-4 w-4 mr-2" />
        Try Again
      </Button>
      <Button 
        onClick={() => window.location.reload()}
        variant="outline"
      >
        Refresh Page
      </Button>
    </div>
  </div>
);

function Calculator() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [demoMode, setDemoMode] = useState(false);
  const [calculatorReady, setCalculatorReady] = useState(false);
  const { isOffline } = useSimpleOfflineMode();
  
  // Set page title and a11y features
  useA11y({
    title: "Carbon Calculator - CarbonConstruct",
    announceRouteChanges: true,
    focusMainContentOnRouteChange: true
  });
  
  useEffect(() => {
    // Check if we're in demo mode from navigation state
    if (location.state?.demoMode) {
      setDemoMode(true);
    } else if (!user) {
      // If not explicitly in demo mode and not logged in, default to demo mode
      setDemoMode(true);
    }
    
    // Check if we've been redirected from authentication
    if (location.state?.fromAuth && user) {
      toast.success("Successfully signed in! You can now save your projects.");
    }

    // Start with a small delay to ensure proper loading
    const timer = setTimeout(() => setCalculatorReady(true), 300);
    
    return () => clearTimeout(timer);
  }, [location, user]);

  const handleSignUp = () => {
    navigate("/auth", { state: { returnTo: "/calculator" } });
  };

  const handleResetCalculatorError = () => {
    // Add a short delay to give time for state updates
    toast.info("Resetting calculator...");
    setTimeout(() => {
      setCalculatorReady(false);
      setTimeout(() => setCalculatorReady(true), 300);
    }, 100);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12" id="main-content" tabIndex={-1}>
        <CalculatorHeader />
        
        {!isOffline ? null : (
          <Alert className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800">
            <CloudOff className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">You're Offline</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              The calculator will work in demo mode, but you won't be able to save projects.
              <div className="mt-2">
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-amber-600 hover:bg-amber-700 text-white"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Check connection
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {/* Wrap with both ProjectProvider and CalculatorProvider */}
        <ProjectProvider>
          <CalculatorProvider>
            <ErrorBoundary 
              FallbackComponent={CalculatorLoadError}
              onReset={handleResetCalculatorError}
              resetKeys={[location.key, isOffline]}
            >
              <Suspense fallback={<CalculatorLoading />}>
                {calculatorReady ? (
                  <CarbonCalculator 
                    demoMode={!user || demoMode || isOffline} 
                  />
                ) : (
                  <CalculatorLoading />
                )}
              </Suspense>
            </ErrorBoundary>
          </CalculatorProvider>
        </ProjectProvider>
      </main>
      <Footer />
    </div>
  );
}

export default Calculator;
