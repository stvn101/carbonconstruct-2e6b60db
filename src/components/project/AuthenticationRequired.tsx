
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AuthenticationRequired = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
        <p className="text-muted-foreground mb-4">Please log in to view this project</p>
        <Button onClick={() => navigate("/auth")}>Log In</Button>
      </div>
    </div>
  );
};

export default AuthenticationRequired;
