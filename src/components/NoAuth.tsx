
import React from 'react';
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface NoAuthProps {
  children: React.ReactNode;
}

export const NoAuth = ({ children }: NoAuthProps) => {
  const { user, isLoading } = useAuth();

  // Show loading spinner while checking authentication status
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
      </div>
    );
  }

  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" />;
  }

  // If not logged in, render the auth component
  return <>{children}</>;
};
