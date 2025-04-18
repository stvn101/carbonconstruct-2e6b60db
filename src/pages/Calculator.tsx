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
  const { user } = useAuth();
  const [demoMode, setDemoMode] = useState(false);

  useEffect(() => {
    // Check if we're in demo mode from navigation state
    if (location.state?.demoMode) {
      setDemoMode(true);
    }
  }, [location]);

  const handleSignUp = () => {
    navigate("/auth", { state: { returnTo: "/calculator" } });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow py-6 md:py-12 container mx-auto px-4 pt-24">
        <h1 className="text-3xl font-bold mb-6">Carbon Calculator</h1>
        
        {demoMode && !user && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Demo Mode</AlertTitle>
            <AlertDescription className="text-yellow-700">
              You're using the calculator in demo mode. Your calculations won't be saved.
              <div className="mt-2">
                <Button onClick={handleSignUp} className="mr-2">Sign Up</Button>
                <Button variant="outline" onClick={() => setDemoMode(false)}>Exit Demo</Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <CarbonCalculator demoMode={demoMode} />
      </main>
      <Footer />
    </div>
  );
}

export default Calculator;
