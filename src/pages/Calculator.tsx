
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import CarbonCalculator from "@/components/CarbonCalculator";
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CloudOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import CalculatorHeader from "@/components/calculator/CalculatorHeader";
import { useA11y } from "@/hooks/useA11y";
import { useSimpleOfflineMode } from "@/hooks/useSimpleOfflineMode";

function Calculator() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [demoMode, setDemoMode] = useState(false);
  const { isOffline, checkConnection } = useSimpleOfflineMode();
  
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
  }, [location, user]);

  const handleSignUp = () => {
    navigate("/auth", { state: { returnTo: "/calculator" } });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12" id="main-content" tabIndex={-1}>
        <CalculatorHeader />
        
        {isOffline && (
          <Alert className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800">
            <CloudOff className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">You're Offline</AlertTitle>
            <AlertDescription className="text-amber-700 dark:text-amber-400">
              The calculator will work in demo mode, but you won't be able to save projects.
              <div className="mt-2">
                <Button 
                  onClick={checkConnection} 
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
        
        <CarbonCalculator 
          demoMode={!user || demoMode || isOffline}
        />
      </main>
      <Footer />
    </div>
  );
}

export default Calculator;
