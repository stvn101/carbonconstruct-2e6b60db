import { useState } from "react";
import { motion } from "framer-motion";
import { useCalculator } from "@/contexts/calculator";
import { useProjects } from "@/contexts/ProjectContext";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import CalculatorError from "./calculator/CalculatorError";
import CalculatorHeader from "./calculator/CalculatorHeader";
import ProjectNameCard from "./calculator/ProjectNameCard";
import CalculatorTabs from "./calculator/CalculatorTabs";
import PageLoading from "./ui/page-loading";
import SaveProjectConfirmDialog from "./calculator/SaveProjectConfirmDialog";
import CalculatorUsageTracker from "./calculator/CalculatorUsageTracker";
import { useIsMobile } from "@/hooks/use-mobile";

export interface CarbonCalculatorProps {
  demoMode?: boolean;
}

const CarbonCalculator = ({ demoMode }: CarbonCalculatorProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { saveProject, projects } = useProjects();
  const [projectName, setProjectName] = useState("New Carbon Project");
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const isMobile = useIsMobile();

  // Try to access calculator context, handle errors gracefully
  let calculatorContext;
  try {
    calculatorContext = useCalculator();
  } catch (error) {
    console.error("Error accessing calculator context:", error);
    return <CalculatorError />;
  }

  const {
    calculationInput,
    calculationResult,
    activeTab,
    setActiveTab,
    handleCalculate
  } = calculatorContext;

  const isExistingProject = !!projects.find(
    p => p.name.toLowerCase() === projectName.toLowerCase()
  );

  const handleSaveClick = () => {
    if (!user) {
      toast.error("Please log in to save your project");
      navigate("/auth");
      return;
    }
    
    if (!calculationInput || !calculationResult) {
      toast.error("Please complete your calculation before saving");
      return;
    }

    setShowSaveDialog(true);
  };

  const handleSaveConfirm = async () => {
    setIsSaving(true);
    
    try {
      await saveProject({
        name: projectName,
        description: "Carbon calculation project",
        materials: calculationInput.materials,
        transport: calculationInput.transport,
        energy: calculationInput.energy,
        result: calculationResult,
        tags: ["carbon", "calculation"],
        status: 'draft',
        total_emissions: calculationResult.totalEmissions || 0,
        premium_only: false
      });
      
      toast.success("Project saved successfully!");
      navigate(`/projects`);
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
      setIsSaving(false);
      setShowSaveDialog(false);
    }
  };

  const handleCalculateWithTracking = () => {
    if (isCalculating) return;
    setIsCalculating(true);
    
    try {
      handleCalculate();
      setTimeout(() => {
        setIsCalculating(false);
      }, 100);
    } catch (error) {
      console.error("Error during calculation:", error);
      setIsCalculating(false);
      toast.error("Calculation failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6">
      <CalculatorHeader />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <ProjectNameCard
          projectName={projectName}
          onProjectNameChange={setProjectName}
          onSave={handleSaveClick}
          isSaving={isSaving}
        />
      
        <CalculatorTabs 
          isMobile={isMobile}
          activeTab={activeTab || "materials"}
          setActiveTab={setActiveTab}
          onCalculate={handleCalculateWithTracking}
        />
      </motion.div>
      
      {/* Loading overlay while saving */}
      <PageLoading isLoading={isSaving} text="Saving project..." />

      {/* Save confirmation dialog */}
      <SaveProjectConfirmDialog
        isOpen={showSaveDialog}
        projectName={projectName}
        isSaving={isSaving}
        onConfirm={handleSaveConfirm}
        onCancel={() => setShowSaveDialog(false)}
        isOverwrite={isExistingProject}
      />

      {/* Usage tracker */}
      <CalculatorUsageTracker
        demoMode={demoMode}
        onComplete={() => setIsCalculating(false)}
      />
    </div>
  );
};

export default CarbonCalculator;
