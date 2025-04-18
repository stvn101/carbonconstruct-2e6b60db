import React from 'react';
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FolderPlus, Calculator, ArrowLeft } from "lucide-react";
import { useProjects } from "@/contexts/ProjectContext";
import ProjectsList from "@/components/projects/ProjectsList";
import { useAuth } from '@/contexts/auth';

const ProjectsBrowser: React.FC = () => {
  const { projects, isLoading } = useProjects();
  const { user, profile } = useAuth();
  const isPremiumUser = user && profile?.subscription_tier === 'premium';
  
  return (
    <motion.div 
      className={`min-h-screen flex flex-col bg-carbon-50 dark:bg-carbon-900 ${isPremiumUser ? 'premium-user' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Browse Projects | CarbonConstruct</title>
        <meta name="description" content="Browse and manage your carbon calculation projects" />
      </Helmet>
      <Navbar />
      <main className="flex-grow content-top-spacing px-4 pb-12">
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
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
            </div>
          ) : (
            <ProjectsList projects={projects} title="All Projects" />
          )}
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default ProjectsBrowser;
