
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get code and session from the URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);
      
      // Process the OAuth callback
      try {
        setIsProcessing(true);
        
        // Handle the redirect automatically
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          // Check if we have a returnUrl in the session storage
          const returnUrl = sessionStorage.getItem('authReturnUrl') || '/dashboard';
          sessionStorage.removeItem('authReturnUrl'); // Clean up
          
          console.log("Authentication successful:", data.session);
          
          // Successfully logged in, redirect to dashboard or return URL
          toast.success(`Successfully signed in${data.session.user?.email ? ` as ${data.session.user.email}` : ''}`);
          
          navigate(returnUrl, { 
            state: { fromAuth: true },
            replace: true
          });
        } else {
          // Check queryParams for error message
          const errorMsg = queryParams.get('error_description') || hashParams.get('error_description');
          
          if (errorMsg) {
            setError(errorMsg);
            setIsProcessing(false);
          } else {
            // No session found, redirect to auth page
            navigate("/auth", { replace: true });
          }
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        setError(error.message || "Authentication failed. Please try again.");
        setIsProcessing(false);
      }
    };
    
    handleAuthCallback();
  }, [navigate]);
  
  const handleRetry = () => {
    navigate("/auth", { replace: true });
  };
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-carbon-50 dark:bg-gray-900">
        <div className="w-full max-w-md">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <div>
              <h3 className="font-medium">Authentication Error</h3>
              <p className="text-sm">{error}</p>
            </div>
          </Alert>
          <Button onClick={handleRetry} className="w-full">
            Return to Login
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-carbon-50 dark:bg-gray-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Processing authentication...</p>
    </div>
  );
};

export default AuthCallback;
