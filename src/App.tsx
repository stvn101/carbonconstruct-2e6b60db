import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './components/ThemeProvider';
import { Toaster } from './components/ui/sonner';
import { RegionProvider } from './contexts/RegionContext';
import Home from './pages/Home';
import Calculator from './pages/Calculator';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
import Materials from './pages/Materials';
import UserProjects from './pages/UserProjects';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
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
                  <Route path="/" element={<Home />} />
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
                  <Route path="/materials" element={<Materials />} />
                  
                  <Route 
                    path="/signup" 
                    element={
                      <NoAuth>
                        <SignUp />
                      </NoAuth>
                    } 
                  />
                  <Route 
                    path="/signin" 
                    element={
                      <NoAuth>
                        <SignIn />
                      </NoAuth>
                    } 
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

export default App;
