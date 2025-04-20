
import React from 'react';
import { Route } from 'react-router-dom';
import { lazyLoad } from '@/utils/lazyLoad';
import Auth from '@/pages/Auth';
import AuthCallback from '@/pages/AuthCallback';
import { NoAuth } from '@/components/NoAuth';
import ErrorBoundary from '@/components/ErrorBoundary';

export const authRoutes = (
  <>
    <Route element={
      <ErrorBoundary feature="Authentication">
        <NoAuth>
          <Auth />
        </NoAuth>
      </ErrorBoundary>
    }>
      <Route path="/auth" element={<Auth />} />
      <Route path="/signin" element={<Auth />} />
      <Route path="/signup" element={<Auth />} />
    </Route>
    <Route path="/auth/callback" element={<AuthCallback />} />
  </>
);
