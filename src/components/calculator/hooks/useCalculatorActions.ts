
import { useState } from 'react';
import { useCalculator } from '@/contexts/calculator';
import { useProjects } from '@/contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { showErrorToast } from '@/utils/errorHandling/simpleToastHandler';

export interface UseCalculatorActionsProps {
  demoMode?: boolean;
}

export function useCalculatorActions({ demoMode = false }: UseCalculatorActionsProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { saveProject, projects } = useProjects();
  const [projectName, setProjectName] = useState("New Carbon Project");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [savingError, setSavingError] = useState<Error | null>(null);

  // Access calculator context
  let calculatorContext;
  try {
    calculatorContext = useCalculator();
  } catch (error) {
    console.error("Error accessing calculator context:", error);
    return {
      error: true,
      projectName,
      setProjectName,
      authError,
      setAuthError,
      savingError,
      setSavingError,
      isSaving,
      setIsSaving,
      showSaveDialog,
      setShowSaveDialog,
      isCalculating: false,
      setIsCalculating: () => {},
      handleSaveClick: () => {},
      handleSaveConfirm: async () => {},
      handleSignIn: () => {},
      isExistingProject: false,
      calculatorContext: null
    };
  }

  const { calculationInput, calculationResult, isCalculating, setIsCalculating } = calculatorContext;

  const isExistingProject = !!projects.find(
    p => p.name.toLowerCase() === projectName.toLowerCase()
  );

  const handleSaveClick = () => {
    setAuthError(null);
    setSavingError(null);
    
    if (!navigator.onLine) {
      showErrorToast("You're offline. Please connect to the internet to save projects.");
      return;
    }
    
    if (!user) {
      setAuthError(new Error("Please log in to save your project"));
      return;
    }
    
    if (!calculationInput || !calculationResult) {
      toast.error("Please complete your calculation before saving");
      return;
    }

    setShowSaveDialog(true);
  };

  // Simplified save function
  const handleSaveConfirm = async () => {
    if (!user) {
      setAuthError(new Error("Authentication required to save projects"));
      setShowSaveDialog(false);
      return;
    }
    
    if (!navigator.onLine) {
      showErrorToast("You're offline. Please connect to the internet to save projects.");
      setShowSaveDialog(false);
      return;
    }
    
    setIsSaving(true);
    setSavingError(null);
    
    try {
      // Ensure we have a valid calculation result
      if (!calculationResult) {
        throw new Error("Missing calculation result. Please calculate before saving.");
      }
      
      // Prepare the project data
      const projectData = {
        name: projectName,
        description: "Carbon calculation project",
        materials: calculationInput.materials,
        transport: calculationInput.transport,
        energy: calculationInput.energy,
        result: calculationResult,
        tags: ["carbon", "calculation"],
        status: 'draft' as const,
        total_emissions: calculationResult.totalEmissions || 0,
        premium_only: false // Adding the missing field
      };
      
      // Save the project
      const savedProject = await saveProject(projectData);
      
      console.log("Project saved successfully:", savedProject);
      toast.success("Project saved successfully!");
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate(`/projects`);
      }, 300);
    } catch (error) {
      console.error("Error saving project:", error);
      
      if (error instanceof Error) {
        setSavingError(error);
      } else {
        setSavingError(new Error("Unknown error occurred while saving"));
      }
      
      setIsSaving(false);
      setShowSaveDialog(false);
    }
  };
  
  const handleSignIn = () => {
    navigate("/auth", { state: { returnTo: "/calculator" } });
  };

  return {
    error: false,
    projectName,
    setProjectName,
    authError,
    setAuthError,
    savingError,
    setSavingError,
    isSaving,
    setIsSaving,
    showSaveDialog,
    setShowSaveDialog,
    isCalculating,
    setIsCalculating,
    handleSaveClick,
    handleSaveConfirm,
    handleSignIn,
    isExistingProject,
    calculatorContext
  };
}
