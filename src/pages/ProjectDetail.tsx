
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth";
import { useProjects } from "@/contexts/ProjectContext";
import { useCalculator } from "@/contexts/calculator";
import { toast } from "sonner";

// Import refactored components
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectDetailsTab from "@/components/project/ProjectDetailsTab";
import ProjectCalculatorTab from "@/components/project/ProjectCalculatorTab";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { getProject, updateProject, deleteProject, exportProjectPDF, exportProjectCSV } = useProjects();
  const isPremiumUser = user && profile?.subscription_tier === 'premium';
  
  // Get the project data
  const project = getProject(projectId || "");
  const [calculatorContextError, setCalculatorContextError] = useState(false);
  
  // Use calculator context safely
  let calculatorData = {};
  try {
    calculatorData = useCalculator();
  } catch (error) {
    console.error("Failed to load calculator context:", error);
    setCalculatorContextError(true);
  }
  
  const { setCalculationInput, calculationInput, calculationResult, handleCalculate } = calculatorData as any;
  
  // Redirect if project not found
  useEffect(() => {
    if (!project && user) {
      toast.error("Project not found");
      navigate("/dashboard");
    }
  }, [project, navigate, user]);
  
  // Load project data into calculator
  useEffect(() => {
    if (project && setCalculationInput && !calculatorContextError) {
      try {
        setCalculationInput({
          materials: project.materials || [],
          transport: project.transport || [],
          energy: project.energy || []
        });
      } catch (error) {
        console.error("Error setting calculator input:", error);
        setCalculatorContextError(true);
      }
    }
  }, [project, setCalculationInput, calculatorContextError]);
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground mb-4">Please log in to view this project</p>
          <Button onClick={() => navigate("/auth")}>Log In</Button>
        </div>
      </div>
    );
  }
  
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-carbon-600"></div>
      </div>
    );
  }
  
  // Handle delete project
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await deleteProject(project.id);
        toast.success("Project deleted successfully");
        navigate("/dashboard");
      } catch (error) {
        console.error("Error deleting project:", error);
        toast.error("Failed to delete project");
      }
    }
  };

  const recordCalculatorUsage = async () => {
    if (handleCalculate) {
      try {
        handleCalculate();
      } catch (error) {
        console.error("Error during calculation:", error);
        toast.error("Calculation failed. Please try again.");
      }
    } else {
      toast.error("Calculator is not available");
    }
  };

  return (
    <motion.div 
      className={`min-h-screen flex flex-col ${isPremiumUser ? 'premium-user' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>{project.name} | CarbonConstruct Australia</title>
        <meta name="description" content={`Details for project: ${project.name}`} />
      </Helmet>
      <Navbar />
      <main className="flex-grow content-top-spacing px-4 pb-10">
        <div className="container mx-auto">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4 mt-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          {/* Project Header */}
          <ProjectHeader 
            project={project} 
            onUpdateProject={async (updatedProject) => {
              await updateProject(updatedProject);
              return;
            }}
            onDelete={handleDelete}
          />
          
          {/* Project Tabs */}
          <Tabs defaultValue="details" className="mb-4">
            <TabsList className="w-full sm:w-auto flex">
              <TabsTrigger value="details" className="flex-1 sm:flex-initial data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                Project Details
              </TabsTrigger>
              <TabsTrigger value="calculator" className="flex-1 sm:flex-initial data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                Calculator
              </TabsTrigger>
              
              {/* Premium-only tab example */}
              <TabsTrigger value="advanced" className="flex-1 sm:flex-initial data-[state=active]:bg-carbon-500 data-[state=active]:text-white premium-feature">
                Advanced Analysis
              </TabsTrigger>
            </TabsList>
            
            {/* Project Details Tab */}
            <TabsContent value="details">
              <ProjectDetailsTab 
                project={project}
                onExportPDF={() => exportProjectPDF(project)}
                onExportCSV={() => exportProjectCSV(project)}
              />
            </TabsContent>
            
            {/* Calculator Tab */}
            <TabsContent value="calculator">
              {calculatorContextError ? (
                <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
                  <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Calculator Error</h3>
                  <p className="mt-2 text-red-700 dark:text-red-400">
                    There was a problem loading the calculator. Please refresh the page or try again later.
                  </p>
                  <Button 
                    onClick={() => window.location.reload()}
                    variant="destructive"
                    className="mt-4"
                  >
                    Refresh Page
                  </Button>
                </div>
              ) : (
                <ProjectCalculatorTab 
                  calculationInput={calculationInput}
                  calculationResult={calculationResult}
                  onCalculate={recordCalculatorUsage}
                />
              )}
            </TabsContent>
            
            {/* Premium-only tab content example */}
            <TabsContent value="advanced" className="premium-feature">
              <div className="bg-carbon-50 dark:bg-carbon-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Advanced Analysis (Premium Feature)</h3>
                <p className="text-muted-foreground mb-4">
                  This section contains advanced analytics and insights for your project.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default ProjectDetail;
