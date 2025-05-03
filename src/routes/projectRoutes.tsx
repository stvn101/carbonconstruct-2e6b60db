
import React from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { RequireAuth } from '@/components/RequireAuth';
import { lazyLoad } from '@/utils/lazyLoad';

const UserProjects = lazyLoad(() => import('@/pages/UserProjects'), 
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
  </div>
);
const ProjectsBrowser = lazyLoad(() => import('@/pages/ProjectsBrowser'));
const Calculator = lazyLoad(() => import('@/pages/Calculator'));
const ProjectDetail = lazyLoad(() => import('@/pages/ProjectDetail'));
const AuthenticationRequired = lazyLoad(() => import('@/components/project/AuthenticationRequired'));

export const projectRoutes = (
  <>
    <Route path="/projects" element={
      <ErrorBoundary feature="Projects">
        <RequireAuth>
          <UserProjects />
        </RequireAuth>
      </ErrorBoundary>
    } />
    <Route path="/projects/browse" element={
      <ErrorBoundary feature="Projects">
        <RequireAuth>
          <ProjectsBrowser />
        </RequireAuth>
      </ErrorBoundary>
    } />
    <Route path="/projects/new" element={
      <ErrorBoundary feature="Projects">
        <RequireAuth>
          <Calculator />
        </RequireAuth>
      </ErrorBoundary>
    } />
    <Route path="/projects/:projectId" element={
      <ErrorBoundary feature="Projects">
        <RequireAuth>
          <ProjectDetail />
        </RequireAuth>
      </ErrorBoundary>
    } />
    {/* Calculator is available to everyone, but with restricted functionality for non-premium users */}
    <Route path="/calculator" element={
      <ErrorBoundary feature="Calculator">
        <Calculator />
      </ErrorBoundary>
    } />
  </>
);
