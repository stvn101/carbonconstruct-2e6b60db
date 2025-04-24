
import React, { useEffect, useState } from 'react';
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useOfflineMode } from "@/hooks/useOfflineMode";

const ProjectsBrowser: React.FC = () => {
  const { projects, isLoading } = useProjects();
  const { user, profile } = useAuth();
  const isPremiumUser = user && profile?.subscription_tier === 'premium';
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const { isOfflineMode, checkConnection } = useOfflineMode();
  
  // Delay setting page loaded status to prevent flickering
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleRetryLoad = () => {
    setLoadAttempts(prev => prev + 1);
    // Force page refresh when retry button is clicked
    window.location.reload();
  };

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
          <ScrollArea className="h-full w-full">
            <div className="container mx-auto">
              <div className="mb-6">
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
              
              {/* Connection Error Alert */}
              {isOfflineMode && (
                <Alert className="mb-6 bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800">
                  <RefreshCw className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="text-amber-800 dark:text-amber-300">Connection Issue Detected</AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-400">
                    We're having trouble connecting to the server. Your projects will appear when the connection is restored.
                    <div className="mt-2">
                      <Button 
                        onClick={checkConnection} 
                        className="bg-amber-600 hover:bg-amber-700 text-white"
                        size="sm"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Check connection
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {isLoading ? (
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
                  {loadAttempts > 0 && (
                    <Alert className="mb-6 max-w-md mx-auto">
                      <AlertDescription>
                        Still having trouble loading your projects? Try refreshing the page or coming back later.
                      </AlertDescription>
                    </Alert>
                  )}
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
                    <Button
                      onClick={handleRetryLoad}
                      variant="secondary"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Retry Loading
                    </Button>
                  </div>
                </div>
              ) : (
                <ProjectsList 
                  projects={projects} 
                  title="All Projects" 
                  showSearch={true} 
                />
              )}
            </div>
          </ScrollArea>
        )}
      </main>
      <Footer />
    </motion.div>
  );
};

export default ProjectsBrowser;
