
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/auth";
import { useProjects } from "@/contexts/ProjectContext";
import { useCalculator } from "@/contexts/calculator";
import { toast } from "sonner";

// Import refactored components
import ProjectHeader from "@/components/project/ProjectHeader";
import BackButton from "@/components/project/BackButton";
import ProjectTabs from "@/components/project/ProjectTabs";
import LoadingState from "@/components/project/LoadingState";
import AuthenticationRequired from "@/components/project/AuthenticationRequired";

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
  }, [project, user, navigate]);
  
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
    return <AuthenticationRequired />;
  }
  
  if (!project) {
    return <LoadingState />;
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

  // Handle update project (fix type mismatch)
  const handleUpdateProject = async (updatedProject: SavedProject) => {
    try {
      await updateProject(updatedProject);
      return;
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
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
          <BackButton />
          
          <ProjectHeader 
            project={project} 
            onUpdateProject={handleUpdateProject}
            onDelete={handleDelete}
          />
          
          <ProjectTabs 
            project={project}
            isPremiumUser={isPremiumUser}
            onExportPDF={exportProjectPDF}
            onExportCSV={exportProjectCSV}
            calculatorData={{
              calculationInput,
              calculationResult,
              handleCalculate
            }}
          />
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default ProjectDetail;
