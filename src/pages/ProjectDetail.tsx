import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectContext";
import { useCalculator } from "@/hooks/useCalculator";
import { toast } from "sonner";

// Import refactored components
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectDetailsTab from "@/components/project/ProjectDetailsTab";
import ProjectCalculatorTab from "@/components/project/ProjectCalculatorTab";

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProject, updateProject, deleteProject, exportProjectPDF, exportProjectCSV } = useProjects();
  
  // Get the project data
  const project = getProject(projectId || "");
  
  // Add setCalculationInput to calculator hooks
  const calculator = useCalculator();
  
  // Redirect if project not found
  useEffect(() => {
    if (!project && !user) {
      toast.error("Project not found");
      navigate("/dashboard");
    }
  }, [project, navigate, user]);
  
  // Load project data into calculator
  useEffect(() => {
    if (project && calculator.setCalculationInput) {
      calculator.setCalculationInput({
        materials: project.materials,
        transport: project.transport,
        energy: project.energy
      });
    }
  }, [project, calculator.setCalculationInput, project?.materials, project?.transport, project?.energy]);
  
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
        toast.error("Failed to delete project");
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>{project.name} | CarbonConstruct</title>
        <meta name="description" content={`Details for project: ${project.name}`} />
      </Helmet>
      <Navbar />
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto">
          <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
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
            <TabsList>
              <TabsTrigger value="details" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                Project Details
              </TabsTrigger>
              <TabsTrigger value="calculator" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                Calculator
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
                calculationInput={calculator.calculationInput}
                calculationResult={calculator.calculationResult}
                onUpdateMaterial={calculator.handleUpdateMaterial}
                onAddMaterial={calculator.handleAddMaterial}
                onRemoveMaterial={calculator.handleRemoveMaterial}
                onUpdateTransport={calculator.handleUpdateTransport}
                onAddTransport={calculator.handleAddTransport}
                onRemoveTransport={calculator.handleRemoveTransport}
                onUpdateEnergy={calculator.handleUpdateEnergy}
                onAddEnergy={calculator.handleAddEnergy}
                onRemoveEnergy={calculator.handleRemoveEnergy}
                onCalculate={calculator.handleCalculate}
                onNextTab={calculator.handleNextTab}
                onPrevTab={calculator.handlePrevTab}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default ProjectDetail;
