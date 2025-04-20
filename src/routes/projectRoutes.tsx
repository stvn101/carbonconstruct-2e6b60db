
import React, { Suspense } from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';
import { RequireAuth } from '@/components/RequireAuth';
import PageLoading from '@/components/ui/page-loading';

const UserProjects = React.lazy(() => import('@/pages/UserProjects'));
const ProjectsBrowser = React.lazy(() => import('@/pages/ProjectsBrowser'));
const Calculator = React.lazy(() => import('@/pages/Calculator'));
const ProjectDetail = React.lazy(() => import('@/pages/ProjectDetail'));

export const projectRoutes = (
  <>
    <Route path="/projects" element={
      <ErrorBoundary feature="Projects">
        <RequireAuth>
          <Suspense fallback={<PageLoading isLoading={true} text="Loading projects..." />}>
            <UserProjects />
          </Suspense>
        </RequireAuth>
      </ErrorBoundary>
    } />
    <Route path="/projects/browse" element={
      <ErrorBoundary feature="Projects">
        <RequireAuth>
          <Suspense fallback={<PageLoading isLoading={true} />}>
            <ProjectsBrowser />
          </Suspense>
        </RequireAuth>
      </ErrorBoundary>
    } />
    <Route path="/projects/new" element={
      <ErrorBoundary feature="Projects">
        <RequireAuth>
          <Suspense fallback={<PageLoading isLoading={true} />}>
            <Calculator />
          </Suspense>
        </RequireAuth>
      </ErrorBoundary>
    } />
    <Route path="/projects/:projectId" element={
      <ErrorBoundary feature="Projects">
        <RequireAuth>
          <Suspense fallback={<PageLoading isLoading={true} />}>
            <ProjectDetail />
          </Suspense>
        </RequireAuth>
      </ErrorBoundary>
    } />
  </>
);
