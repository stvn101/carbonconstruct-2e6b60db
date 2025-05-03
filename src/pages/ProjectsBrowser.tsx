
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FolderPlus, Calculator, ArrowLeft, RefreshCw } from "lucide-react";
import { useProjects } from "@/contexts/ProjectContext";
import ProjectsList from "@/components/projects/ProjectsList";
import { ProjectCardSkeleton } from "@/components/project/ProjectCardSkeleton";
import { useAuth } from '@/contexts/auth';
import { ScrollArea } from '@/components/ui/scroll-area';
import PageLoading from '@/components/ui/page-loading';
import ProjectsErrorState from "@/components/projects/ProjectsErrorState";
import { useOfflineMode } from "@/hooks/useOfflineMode";
import ErrorBoundary from "@/components/ErrorBoundary";
import { toast } from 'sonner';

const ProjectsBrowser: React.FC = () => {
  const { projects, isLoading, fetchError, loadProjects } = useProjects();
  const { user, profile } = useAuth();
  const isPremiumUser = user && profile?.subscription_tier === 'premium';
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const { isOfflineMode, checkConnection, connectionAttempts, isCheckingConnection } = useOfflineMode();
  const pageInitializedRef = useRef(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Setup loading timeout
  useEffect(() => {
    if (isLoading) {
      // Set a timeout to prevent infinite loading
      loadingTimeoutRef.current = setTimeout(() => {
        if (isLoading) {
          toast.error("Loading projects timed out. Please try refreshing.");
          setIsPageLoaded(true); // Force page to show even if loading
        }
      }, 15000); // 15 second timeout
    }
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [isLoading]);
  
  // Delay setting page loaded status to prevent flickering
  useEffect(() => {
    // Only do this once to prevent repeated flashes
    if (!pageInitializedRef.current) {
      pageInitializedRef.current = true;
      const timer = setTimeout(() => {
        setIsPageLoaded(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleRetryLoad = useCallback(() => {
    // Prevent multiple simultaneous retries
    if (retryTimeoutRef.current) return;
    
    setLoadAttempts(prev => prev + 1);
    
    // Show loading toast
    toast.loading("Checking connection...", { id: "retry-connection-check" });
    
    // Check connection first
    checkConnection();
    
    // Wait a moment then refresh
    retryTimeoutRef.current = setTimeout(() => {
      toast.dismiss("retry-connection-check");
      
      // Try to load projects again
      if (loadProjects) {
        loadProjects().catch(err => {
          console.error("Error reloading projects:", err);
          toast.error("Failed to load projects. Please try again later.");
        });
      }
      
      // Instead of full page refresh, just show loading state again
      setIsPageLoaded(false);
      setTimeout(() => {
        setIsPageLoaded(true);
        retryTimeoutRef.current = null;
      }, 300);
    }, 1500);
  }, [checkConnection, loadProjects]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <motion.div 
      className={`min-h-screen flex flex-col bg-carbon-50 dark:bg-carbon-900 overflow-x-hidden ${isPremiumUser ? 'premium-user' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Browse Projects | CarbonConstruct</title>
        <meta name="description" content="Browse and manage your carbon calculation projects" />
      </Helmet>
      <Navbar />
      <main className="flex-grow content-top-spacing px-4 pb-12 overflow-y-auto">
        {!isPageLoaded ? (
          <PageLoading isLoading={true} text="Loading projects..." />
        ) : (
          <ErrorBoundary 
            feature="Projects Browser" 
            ignoreErrors={true} 
            resetCondition={loadAttempts}
          >
            <ScrollArea className="h-full w-full">
              <div className="container mx-auto">
                <div className="mb-6 pt-16">
                  <Button variant="ghost" asChild className="mb-4">
                    <Link to="/dashboard">
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back to Dashboard
                    </Link>
                  </Button>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Projects Browser</h1>
                    <p className="text-muted-foreground">Find and manage all your carbon calculation projects</p>
                  </div>
                  <div className="mt-4 md:mt-0 space-x-2 flex flex-wrap gap-2">
                    <Button 
                      asChild
                      variant="outline"
                    >
                      <Link to="/projects/new">
                        <FolderPlus className="h-4 w-4 mr-2" />
                        <span className="whitespace-nowrap">New Project</span>
                      </Link>
                    </Button>
                    <Button 
                      asChild
                      className="bg-carbon-600 hover:bg-carbon-700 text-white"
                    >
                      <Link to="/calculator">
                        <Calculator className="h-4 w-4 mr-2" />
                        <span className="whitespace-nowrap">New Calculation</span>
                      </Link>
                    </Button>
                  </div>
                </div>
                
                <ProjectsErrorState 
                  isOffline={isOfflineMode}
                  hasError={!!fetchError && connectionAttempts > 1 && !isOfflineMode}
                  onRetry={handleRetryLoad}
                  isRetrying={!!retryTimeoutRef.current || isCheckingConnection}
                />

                {isLoading && (!projects || projects.length === 0) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                      <ProjectCardSkeleton key={i} />
                    ))}
                  </div>
                ) : projects.length === 0 && !isOfflineMode ? (
                  <div className="text-center py-12 border rounded-lg bg-white dark:bg-carbon-800 shadow-sm p-8">
                    <h2 className="text-xl font-semibold mb-2">No Projects Found</h2>
                    <p className="text-muted-foreground mb-6">
                      {user ? "You haven't created any projects yet." : "Please sign in to view your projects."}
                    </p>
                    <div className="flex justify-center gap-2">
                      <Button 
                        asChild
                        variant="outline"
                      >
                        <Link to="/projects/new">
                          <FolderPlus className="h-4 w-4 mr-2" />
                          Create Your First Project
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <ProjectsList 
                    projects={projects || []} 
                    title="All Projects" 
                    showSearch={true} 
                  />
                )}

                {/* Add a manual refresh button for stuck loading states */}
                {(isLoading && projects && projects.length > 0) && (
                  <div className="flex justify-center mt-8">
                    <Button 
                      variant="outline" 
                      onClick={handleRetryLoad}
                      className="flex items-center gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh Projects
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </ErrorBoundary>
        )}
      </main>
      <Footer />
    </motion.div>
  );
};

export default ProjectsBrowser;
