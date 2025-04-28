
import React from 'react';
import { Card } from '@/components/ui/card';
import { ErrorIcon } from './components/ErrorIcon';
import { ErrorMessage } from './components/ErrorMessage';
import { RetryButton } from './components/RetryButton';

interface ErrorFallbackCardProps {
  error: Error;
  isNetworkError: boolean;
  isChecking: boolean;
  onReset: () => void;
}

const ErrorFallbackCard: React.FC<ErrorFallbackCardProps> = ({
  error,
  isNetworkError,
  isChecking,
  onReset
}) => {
  return (
    <Card className="p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-center">
      <div className="flex flex-col items-center p-2">
        <ErrorIcon isNetworkError={isNetworkError} />
        <ErrorMessage error={error} isNetworkError={isNetworkError} />
        <RetryButton onReset={onReset} isChecking={isChecking} />
      </div>
    </Card>
  );
};

export default ErrorFallbackCard;
