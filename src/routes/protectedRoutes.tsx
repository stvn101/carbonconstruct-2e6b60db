
import React from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { RequireAuth } from '@/components/RequireAuth';
import { lazyLoad } from '@/utils/lazyLoad';

const Dashboard = lazyLoad(() => import('@/pages/Dashboard'), 
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
  </div>
);
const MaterialDatabase = lazyLoad(() => import('@/pages/MaterialDatabase'));
const Notifications = lazyLoad(() => import('@/pages/Notifications'));
const UserProfile = lazyLoad(() => import('@/pages/UserProfile'));

export const protectedRoutes = (
  <>
    <Route path="/dashboard" element={
      <ErrorBoundary feature="Dashboard">
        <RequireAuth>
          <Dashboard />
        </RequireAuth>
      </ErrorBoundary>
    } />
    <Route path="/materials" element={
      <ErrorBoundary feature="Materials">
        <RequireAuth>
          <MaterialDatabase />
        </RequireAuth>
      </ErrorBoundary>
    } />
    <Route path="/notifications" element={
      <ErrorBoundary feature="Notifications">
        <RequireAuth>
          <Notifications />
        </RequireAuth>
      </ErrorBoundary>
    } />
    <Route path="/profile" element={
      <ErrorBoundary feature="User Profile">
        <RequireAuth>
          <UserProfile />
        </RequireAuth>
      </ErrorBoundary>
    } />
  </>
);
