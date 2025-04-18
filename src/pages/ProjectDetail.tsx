
import { useEffect } from "react";
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
  
  // Use calculator context
  const { setCalculationInput, calculationInput, calculationResult, handleCalculate } = useCalculator();
  
  // Redirect if project not found
  useEffect(() => {
    if (!project && !user) {
      toast.error("Project not found");
      navigate("/dashboard");
    }
  }, [project, navigate, user]);
  
  // Load project data into calculator
  useEffect(() => {
    if (project && setCalculationInput) {
      setCalculationInput({
        materials: project.materials,
        transport: project.transport,
        energy: project.energy
      });
    }
  }, [project, setCalculationInput]);
  
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
        console.error("Error saving project:", error);
        toast.error("Failed to delete project");
      }
    }
  };

  const recordCalculatorUsage = async () => {
    handleCalculate();
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
                onExportPDF={exportProjectPDF}
                onExportCSV={exportProjectCSV}
              />
            </TabsContent>
            
            {/* Calculator Tab */}
            <TabsContent value="calculator">
              <ProjectCalculatorTab 
                calculationInput={calculationInput}
                calculationResult={calculationResult}
                onCalculate={recordCalculatorUsage}
              />
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
