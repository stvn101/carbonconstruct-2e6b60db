
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import CarbonCalculator from "@/components/CarbonCalculator";
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

function Calculator() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [demoMode, setDemoMode] = useState(false);
  const isPremiumUser = profile?.subscription_tier === 'premium';
  
  useEffect(() => {
    // Check if we're in demo mode from navigation state
    if (location.state?.demoMode) {
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
  
  const exitDemoMode = () => {
    setDemoMode(false);
    // Reset location state so demo mode isn't persisted on refresh
    navigate("/calculator", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-6">Carbon Calculator</h1>
        
        {!user && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <AlertTitle className="text-yellow-800 dark:text-yellow-300">Demo Mode</AlertTitle>
            <AlertDescription className="text-yellow-700 dark:text-yellow-400">
              You're using the calculator in demo mode. Your calculations won't be saved.
              <div className="mt-2">
                <Button onClick={handleSignUp} className="mr-2 bg-carbon-600 hover:bg-carbon-700 text-white">Sign Up</Button>
                {demoMode && (
                  <Button variant="outline" onClick={exitDemoMode}>Exit Demo</Button>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        {user && !isPremiumUser && (
          <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/30 dark:border-blue-800">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-800 dark:text-blue-300">Free Account</AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-400">
              You're using the basic calculator. Upgrade to Premium for advanced features and unlimited calculations.
              <div className="mt-2">
                <Button 
                  onClick={() => navigate("/pricing")} 
                  className="bg-carbon-600 hover:bg-carbon-700 text-white"
                >
                  Upgrade to Premium
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <CarbonCalculator demoMode={!user || demoMode} isPremiumUser={isPremiumUser} />
      </main>
      <Footer />
    </div>
  );
}

export default Calculator;
