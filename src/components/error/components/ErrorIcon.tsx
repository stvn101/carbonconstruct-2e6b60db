
import React from 'react';
import { WifiOff, AlertTriangle } from 'lucide-react';

interface ErrorIconProps {
  isNetworkError: boolean;
  className?: string;
}

export const ErrorIcon: React.FC<ErrorIconProps> = ({ isNetworkError, className = "h-10 w-10 text-red-600 mb-2" }) => {
  return isNetworkError ? (
    <WifiOff className={className} aria-hidden="true" />
  ) : (
    <AlertTriangle className={className} aria-hidden="true" />
  );
};
