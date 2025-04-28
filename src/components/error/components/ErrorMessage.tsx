
import React from 'react';

interface ErrorMessageProps {
  error: Error;
  isNetworkError: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, isNetworkError }) => {
  return (
    <div className="text-center">
      <h3 className="text-lg font-medium text-red-800 dark:text-red-300">
        {isNetworkError ? "Connection Error" : 'Something went wrong'}
      </h3>
      <p className="mt-2 text-red-700 dark:text-red-400 text-sm">
        {isNetworkError
          ? "There was a problem connecting to the server. Please check your internet connection."
          : error?.message || "An unexpected error occurred."}
      </p>
    </div>
  );
};
