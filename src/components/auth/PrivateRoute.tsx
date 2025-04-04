
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
      </div>
    );
  }

  // If not logged in, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" />;
  }

  // If logged in, render the protected component
  return <>{children}</>;
};

export default PrivateRoute;
