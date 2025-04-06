
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const AuthCallback = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get code and session from the URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);
      
      // Process the OAuth callback
      try {
        // Handle the redirect automatically
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (data?.session) {
          // Successfully logged in, redirect to dashboard
          navigate("/dashboard");
        } else {
          // No session found, redirect to auth page
          navigate("/auth");
        }
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/auth");
      }
    };
    
    handleAuthCallback();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
      <p className="mt-4 text-gray-600 dark:text-gray-400">Processing authentication...</p>
    </div>
  );
};

export default AuthCallback;
