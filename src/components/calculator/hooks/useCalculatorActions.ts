
import { useState } from 'react';
import { useCalculator } from '@/contexts/calculator';
import { useProjects } from '@/contexts/ProjectContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';

export interface UseCalculatorActionsProps {
  demoMode?: boolean;
  isPremiumUser?: boolean;
}

export function useCalculatorActions({ demoMode = false, isPremiumUser = false }: UseCalculatorActionsProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { saveProject, projects } = useProjects();
  const [projectName, setProjectName] = useState("New Carbon Project");
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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
      isSaving,
      setIsSaving,
      showSaveDialog,
      setShowSaveDialog,
      isCalculating,
      setIsCalculating,
      handleSaveClick: () => {},
      handleSaveConfirm: async () => {},
      handleSignIn: () => {},
      isExistingProject: false,
      calculatorContext: null
    };
  }

  const { calculationInput, calculationResult } = calculatorContext;

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

  // Optimized save function to improve performance
  const handleSaveConfirm = async () => {
    if (!user) {
      setAuthError("Authentication required to save projects");
      setShowSaveDialog(false);
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Prepare the project data before saving to minimize processing during DB operation
      const projectData = {
        name: projectName,
        description: "Carbon calculation project",
        materials: calculationInput.materials,
        transport: calculationInput.transport,
        energy: calculationInput.energy,
        result: calculationResult,
        tags: ["carbon", "calculation"],
        status: 'draft' as const, // Fix type error by using a const assertion
        total_emissions: calculationResult.totalEmissions || 0,
        premium_only: isPremiumUser
      };
      
      // Save the project with optimized data
      const savedProject = await saveProject(projectData);
      
      console.log("Project saved successfully:", savedProject);
      toast.success("Project saved successfully!");
      
      // Use setTimeout to allow the toast to be visible before navigation
      setTimeout(() => {
        navigate(`/projects`);
      }, 300);
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

  return {
    error: false,
    projectName,
    setProjectName,
    authError,
    setAuthError,
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
