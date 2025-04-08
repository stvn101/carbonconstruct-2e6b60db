
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { RegionProvider } from './contexts/RegionContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';

// Import existing pages
import Calculator from './pages/Calculator';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import UserProjects from './pages/UserProjects';
import Auth from './pages/Auth';
import AuthCallback from './pages/AuthCallback';
import MaterialBrowser from './pages/MaterialBrowser';
import Index from './pages/Index';

// Import auth components
import { RequireAuth } from './components/RequireAuth';
import { NoAuth } from './components/NoAuth';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="carbon-construct-theme">
        <RegionProvider>
          <AuthProvider>
            <ProjectProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/calculator" element={<Calculator />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  <Route 
                    path="/dashboard" 
                    element={
                      <RequireAuth>
                        <Dashboard />
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
                  <Route path="/materials" element={<MaterialBrowser />} />
                  
                  {/* Auth routes */}
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
                </Routes>
              </Router>
            </ProjectProvider>
          </AuthProvider>
          <Toaster />
        </RegionProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
};

export default App;
