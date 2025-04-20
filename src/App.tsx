
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { RegionProvider } from './contexts/RegionContext';
import { AuthProvider } from './contexts/auth';
import { ProjectProvider } from './contexts/ProjectContext';
import { CalculatorProvider } from './contexts/calculator';
import ErrorBoundary from './components/ErrorBoundary';
import PageLoading from './components/ui/page-loading';
import RouteChangeTracker from './components/RouteChangeTracker';
import SkipToContent from './components/SkipToContent';

// Regular imports for frequently accessed routes
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';

// Lazy load less frequently accessed routes
const Calculator = React.lazy(() => import('./pages/Calculator'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const About = React.lazy(() => import('./pages/About'));
const Blog = React.lazy(() => import('./pages/Blog'));
const Contact = React.lazy(() => import('./pages/Contact'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const UserProjects = React.lazy(() => import('./pages/UserProjects'));
const ProjectsBrowser = React.lazy(() => import('./pages/ProjectsBrowser'));
const MaterialBrowser = React.lazy(() => import('./pages/MaterialBrowser'));
const UserProfile = React.lazy(() => import('./pages/UserProfile'));
const Notifications = React.lazy(() => import('./pages/Notifications'));
const Help = React.lazy(() => import('./pages/Help'));
const ProjectDetail = React.lazy(() => import('./pages/ProjectDetail'));
const ConstructionCompanies = React.lazy(() => import('./pages/ConstructionCompanies'));
const SustainableBuilding = React.lazy(() => import('./pages/SustainableBuilding'));
const BlogPost = React.lazy(() => import('./pages/BlogPost'));
const TermsOfService = React.lazy(() => import('./pages/TermsOfService'));

import { RequireAuth } from './components/RequireAuth';
import { NoAuth } from './components/NoAuth';

const App: React.FC = () => {
  return (
    <ErrorBoundary feature="Application">
      <HelmetProvider>
        <ThemeProvider defaultTheme="light" storageKey="carbon-construct-theme">
          <RegionProvider>
            <Router>
              <AuthProvider>
                <ProjectProvider>
                  <CalculatorProvider>
                    <SkipToContent />
                    <RouteChangeTracker />
                    <Routes>
                      <Route path="/" element={<Index />} />
                      
                      {/* Auth routes with error boundary */}
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
                      
                      {/* Calculator routes with error boundary */}
                      <Route path="/calculator" element={
                        <ErrorBoundary feature="Calculator">
                          <Suspense fallback={<PageLoading isLoading={true} text="Loading calculator..." />}>
                            <Calculator />
                          </Suspense>
                        </ErrorBoundary>
                      } />
                      
                      {/* Marketing routes */}
                      <Route path="/pricing" element={
                        <Suspense fallback={<PageLoading isLoading={true} />}>
                          <Pricing />
                        </Suspense>
                      } />
                      <Route path="/about" element={
                        <Suspense fallback={<PageLoading isLoading={true} />}>
                          <About />
                        </Suspense>
                      } />
                      <Route path="/blog" element={
                        <Suspense fallback={<PageLoading isLoading={true} />}>
                          <Blog />
                        </Suspense>
                      } />
                      <Route path="/blog/posts/:slug" element={
                        <Suspense fallback={<PageLoading isLoading={true} />}>
                          <BlogPost />
                        </Suspense>
                      } />
                      <Route path="/contact" element={
                        <Suspense fallback={<PageLoading isLoading={true} />}>
                          <Contact />
                        </Suspense>
                      } />
                      <Route path="/help" element={
                        <Suspense fallback={<PageLoading isLoading={true} />}>
                          <Help />
                        </Suspense>
                      } />
                      <Route path="/terms-of-service" element={
                        <Suspense fallback={<PageLoading isLoading={true} />}>
                          <TermsOfService />
                        </Suspense>
                      } />
                      <Route path="/construction-companies" element={
                        <Suspense fallback={<PageLoading isLoading={true} />}>
                          <ConstructionCompanies />
                        </Suspense>
                      } />
                      <Route path="/sustainable-building" element={
                        <Suspense fallback={<PageLoading isLoading={true} />}>
                          <SustainableBuilding />
                        </Suspense>
                      } />
                      
                      {/* Protected routes with error boundary */}
                      <Route path="/dashboard" element={
                        <ErrorBoundary feature="Dashboard">
                          <RequireAuth>
                            <Suspense fallback={<PageLoading isLoading={true} text="Loading dashboard..." />}>
                              <Dashboard />
                            </Suspense>
                          </RequireAuth>
                        </ErrorBoundary>
                      } />
                      
                      {/* Project routes with error boundary */}
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
                      
                      {/* Materials routes with error boundary */}
                      <Route path="/materials" element={
                        <ErrorBoundary feature="Materials">
                          <Suspense fallback={<PageLoading isLoading={true} />}>
                            <MaterialBrowser />
                          </Suspense>
                        </ErrorBoundary>
                      } />
                      
                      {/* Notifications route */}
                      <Route path="/notifications" element={
                        <RequireAuth>
                          <Suspense fallback={<PageLoading isLoading={true} />}>
                            <Notifications />
                          </Suspense>
                        </RequireAuth>
                      } />
                      
                      <Route path="/case-studies" element={<Navigate to="/" />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    <Toaster />
                  </CalculatorProvider>
                </ProjectProvider>
              </AuthProvider>
            </Router>
          </RegionProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
