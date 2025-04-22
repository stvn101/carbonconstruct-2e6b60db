
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertCircle, LogIn } from "lucide-react";

interface AuthenticationRequiredProps {
  message?: string;
  redirectPath?: string;
}

const AuthenticationRequired = ({
  message = "Please log in to view this project",
  redirectPath = "/auth"
}: AuthenticationRequiredProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleLogin = () => {
    // Store the current path to redirect back after login
    navigate(redirectPath, { 
      state: { returnTo: location.pathname } 
    });
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6 bg-background border border-border rounded-lg shadow-sm">
        <AlertCircle className="mx-auto h-12 w-12 text-carbon-600 mb-4" />
        <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
        <p className="text-muted-foreground mb-6">{message}</p>
        <div className="space-y-2">
          <Button onClick={handleLogin} className="w-full bg-carbon-600 hover:bg-carbon-700 text-white">
            <LogIn className="h-4 w-4 mr-2" />
            Log In
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate("/")} 
            className="w-full"
          >
            Return to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationRequired;
