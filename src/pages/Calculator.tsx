
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import CarbonCalculator from "@/components/CarbonCalculator";
import { toast } from "sonner";
import { useAuth } from '@/contexts/auth';
import CalculatorHeader from "@/components/calculator/CalculatorHeader";

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
  
  const exitDemoMode = () => {
    setDemoMode(false);
    // Reset location state so demo mode isn't persisted on refresh
    navigate("/calculator", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <CalculatorHeader isPremiumUser={isPremiumUser} />
        
        {/* Removed the redundant demo mode alert */}
        
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
