
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

// Create and import missing components
import PrivateRoute from './components/auth/PrivateRoute';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <ThemeProvider defaultTheme="light" storageKey="carbon-construct-theme">
        <RegionProvider>
          <AuthProvider>
            <ProjectProvider>
              <Router>
                <Routes>
                  {/* Use Index page instead of Home since that's what exists */}
                  <Route path="/" element={<Index />} />
                  <Route path="/calculator" element={<Calculator />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/contact" element={<Contact />} />
                  
                  <Route 
                    path="/dashboard" 
                    element={
                      <PrivateRoute>
                        <Dashboard />
                      </PrivateRoute>
                    } 
                  />
                  <Route 
                    path="/projects" 
                    element={
                      <PrivateRoute>
                        <UserProjects />
                      </PrivateRoute>
                    } 
                  />
                  <Route path="/materials" element={<MaterialBrowser />} />
                  
                  <Route 
                    path="/signup" 
                    element={<Auth />} 
                  />
                  <Route 
                    path="/signin" 
                    element={<Auth />} 
                  />
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

// Import pages that were missing but needed by the Router
import Index from './pages/Index';
import MaterialBrowser from './pages/MaterialBrowser';
import Auth from './pages/Auth';

export default App;
