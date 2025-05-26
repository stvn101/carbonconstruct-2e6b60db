import React, { Suspense } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface SuspenseBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function SuspenseBoundary({ 
  children, 
  fallback = <LoadingSpinner size="large" className="min-h-[200px]" />
}: SuspenseBoundaryProps) {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
} 