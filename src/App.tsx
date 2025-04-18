import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { RegionProvider } from './contexts/RegionContext';
import { AuthProvider } from './contexts/auth';
import { ProjectProvider } from './contexts/ProjectContext';
import { CalculatorProvider } from './contexts/CalculatorContext';
import ErrorBoundary from './components/ErrorBoundary';
import Calculator from './pages/Calculator';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import UserProjects from './pages/UserProjects';
import ProjectsBrowser from './pages/ProjectsBrowser';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import MaterialBrowser from './pages/MaterialBrowser';
import Index from './pages/Index';
import UserProfile from './pages/UserProfile';
import Notifications from './pages/Notifications';
import Help from './pages/Help';
import ProjectDetail from './pages/ProjectDetail';
import ConstructionCompanies from './pages/ConstructionCompanies';
import SustainableBuilding from './pages/SustainableBuilding';
import NotFound from './pages/NotFound';
import BlogPost from './pages/BlogPost';

import { RequireAuth } from './components/RequireAuth';
import { NoAuth } from './components/NoAuth';

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider defaultTheme="light" storageKey="carbon-construct-theme">
          <RegionProvider>
            <Router>
              <AuthProvider>
                <ProjectProvider>
                  <CalculatorProvider>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/calculator" element={<Calculator />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/posts/:slug" element={<BlogPost />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/help" element={<Help />} />
                      <Route path="/construction-companies" element={<ConstructionCompanies />} />
                      <Route path="/sustainable-building" element={<SustainableBuilding />} />
                      
                      <Route 
                        path="/dashboard" 
                        element={
                          <RequireAuth>
                            <Dashboard />
                          </RequireAuth>
                        } 
                      />
                      <Route 
                        path="/profile" 
                        element={
                          <RequireAuth>
                            <UserProfile />
                          </RequireAuth>
                        } 
                      />
                      <Route 
                        path="/projects" 
                        element={
                          <RequireAuth>
                            <UserProjects />
                          </RequireAuth>
                        } 
                      />
                      <Route 
                        path="/projects/browse" 
                        element={
                          <RequireAuth>
                            <ProjectsBrowser />
                          </RequireAuth>
                        } 
                      />
                      <Route 
                        path="/projects/new" 
                        element={
                          <RequireAuth>
                            <Calculator />
                          </RequireAuth>
                        } 
                      />
                      <Route 
                        path="/projects/:projectId" 
                        element={
                          <RequireAuth>
                            <ProjectDetail />
                          </RequireAuth>
                        } 
                      />
                      <Route path="/materials" element={<MaterialBrowser />} />
                      
                      <Route 
                        path="/notifications" 
                        element={
                          <RequireAuth>
                            <Notifications />
                          </RequireAuth>
                        } 
                      />
                      
                      <Route 
                        path="/auth" 
                        element={
                          <NoAuth>
                            <Auth />
                          </NoAuth>
                        } 
                      />
                      <Route 
                        path="/signin" 
                        element={
                          <NoAuth>
                            <Auth />
                          </NoAuth>
                        } 
                      />
                      <Route 
                        path="/signup" 
                        element={
                          <NoAuth>
                            <Auth />
                          </NoAuth>
                        } 
                      />
                      <Route path="/auth/callback" element={<AuthCallback />} />
                      
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
