
import React from 'react';
import { Route } from 'react-router-dom';
import { lazyLoad } from '@/utils/lazyLoad';
import Auth from '@/pages/Auth';
import AuthCallback from '@/pages/AuthCallback';
import { NoAuth } from '@/components/NoAuth';
import ErrorBoundary from '@/components/ErrorBoundary';

export const authRoutes = (
  <>
    <Route 
      path="/auth" 
      element={
        <ErrorBoundary feature="Authentication">
          <NoAuth>
            <Auth />
          </NoAuth>
        </ErrorBoundary>
      } 
    />
    <Route 
      path="/signin" 
      element={
        <ErrorBoundary feature="Authentication">
          <NoAuth>
            <Auth initialTab="signin" />
          </NoAuth>
        </ErrorBoundary>
      } 
    />
    <Route 
      path="/signup" 
      element={
        <ErrorBoundary feature="Authentication">
          <NoAuth>
            <Auth initialTab="signup" />
          </NoAuth>
        </ErrorBoundary>
      } 
    />
    <Route 
      path="/auth/callback" 
      element={
        <ErrorBoundary feature="Authentication">
          <AuthCallback />
        </ErrorBoundary>
      } 
    />
  </>
);
