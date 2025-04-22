
import { useState } from "react";
import { useCalculator } from "@/contexts/calculator";
import { useProjects } from "@/contexts/ProjectContext";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import CalculatorError from "./calculator/CalculatorError";
import CalculatorHeader from "./calculator/CalculatorHeader";
import CalculatorAlerts from "./calculator/CalculatorAlerts";
import CalculatorContainer from "./calculator/CalculatorContainer";

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
  } = calculatorContext;

  const isExistingProject = !!projects.find(
    p => p.name.toLowerCase() === projectName.toLowerCase()
  );

  const handleSaveClick = () => {
    setAuthError(null);
    console.log("Save clicked - Auth status:", !!user);
    
    if (!user) {
      setAuthError("Please log in to save your project");
      return;
    }
    
    if (!calculationInput || !calculationResult) {
      toast.error("Please complete your calculation before saving");
      return;
    }

    console.log("Opening save dialog with project name:", projectName);
    setShowSaveDialog(true);
  };

  const handleSaveConfirm = async () => {
    if (!user) {
      setAuthError("Authentication required to save projects");
      setShowSaveDialog(false);
      return;
    }
    
    setIsSaving(true);
    console.log("Saving project:", {
      name: projectName,
      calculationInput,
      calculationResult
    });
    
    try {
      const savedProject = await saveProject({
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
      
      console.log("Project saved successfully:", savedProject);
      toast.success("Project saved successfully!");
      navigate(`/projects`);
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
      setIsSaving(false);
      setShowSaveDialog(false);
    }
  };
  
  const handleSignIn = () => {
    navigate("/auth", { state: { returnTo: "/calculator" } });
  };

  return (
    <div className="container mx-auto px-4 md:px-6">
      <CalculatorHeader />
      
      <CalculatorAlerts 
        demoMode={demoMode} 
        authError={authError}
        onAuthErrorClear={() => setAuthError(null)}
        onSignIn={handleSignIn}
      />
      
      <CalculatorContainer
        projectName={projectName}
        setProjectName={setProjectName}
        authError={authError}
        setAuthError={setAuthError}
        isSaving={isSaving}
        setIsSaving={setIsSaving}
        showSaveDialog={showSaveDialog}
        setShowSaveDialog={setShowSaveDialog}
        demoMode={demoMode}
        isCalculating={isCalculating}
        setIsCalculating={setIsCalculating}
        onSaveConfirm={handleSaveConfirm}
        onSaveClick={handleSaveClick}
        onSignIn={handleSignIn}
        isExistingProject={isExistingProject}
        calculatorContext={calculatorContext}
      />
    </div>
  );
};

export default CarbonCalculator;
