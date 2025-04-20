
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { RequireAuth } from '@/components/RequireAuth';
import PageLoading from '@/components/ui/page-loading';

const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const MaterialBrowser = React.lazy(() => import('@/pages/MaterialBrowser'));
const Notifications = React.lazy(() => import('@/pages/Notifications'));

export const protectedRoutes = (
  <>
    <Route path="/dashboard" element={
      <ErrorBoundary feature="Dashboard">
        <RequireAuth>
          <Suspense fallback={<PageLoading isLoading={true} text="Loading dashboard..." />}>
            <Dashboard />
          </Suspense>
        </RequireAuth>
      </ErrorBoundary>
    } />
    <Route path="/materials" element={
      <ErrorBoundary feature="Materials">
        <Suspense fallback={<PageLoading isLoading={true} />}>
          <MaterialBrowser />
        </Suspense>
      </ErrorBoundary>
    } />
    <Route path="/notifications" element={
      <RequireAuth>
        <Suspense fallback={<PageLoading isLoading={true} />}>
          <Notifications />
        </Suspense>
      </RequireAuth>
    } />
  </>
);
