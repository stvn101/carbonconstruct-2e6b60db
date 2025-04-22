
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

export interface CarbonCalculatorProps {
  demoMode?: boolean;
}

const CarbonCalculator = ({ demoMode = false }: CarbonCalculatorProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { saveProject, projects } = useProjects();
  const [projectName, setProjectName] = useState("New Carbon Project");
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
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
    setAuthError(null);
    
    if (!user) {
      setAuthError("Please log in to save your project");
      return;
    }
    
    if (!calculationInput || !calculationResult) {
      toast.error("Please complete your calculation before saving");
      return;
    }

    setShowSaveDialog(true);
  };

  const handleSaveConfirm = async () => {
    if (!user) {
      setAuthError("Authentication required to save projects");
      setShowSaveDialog(false);
      return;
    }
    
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
  
  const handleSignIn = () => {
    navigate("/auth", { state: { returnTo: "/calculator" } });
  };

  return (
    <div className="container mx-auto px-4 md:px-6">
      <CalculatorHeader />
      
      {demoMode && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800">
          <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-300">Demo Mode</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
            You're using the calculator in demo mode. Your calculations won't be saved.
            {!user && (
              <div className="mt-2 flex flex-wrap gap-2">
                <Button onClick={handleSignIn} size="sm" className="bg-carbon-600 hover:bg-carbon-700 text-white">
                  Sign In to Save
                </Button>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {authError && (
        <Alert className="mb-6 bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800">
          <ExclamationTriangleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-300">Authentication Required</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-400">
            {authError}
            <div className="mt-2 flex flex-wrap gap-2">
              <Button onClick={handleSignIn} size="sm" className="bg-carbon-600 hover:bg-carbon-700 text-white">
                Sign In
              </Button>
              <Button 
                onClick={() => setAuthError(null)} 
                size="sm" 
                variant="outline" 
                className="border-red-200 dark:border-red-800"
              >
                Continue in Demo Mode
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
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
          demoMode={demoMode}
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
