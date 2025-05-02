
import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { showErrorToast } from '@/utils/errorHandling/simpleToastHandler';
import { CalculationInput, CalculationResult } from '@/lib/carbonCalculations';
import { useCalculatorState } from './useCalculatorState';
import { useCalculatorTimeout } from './useCalculatorTimeout';
import { useCalculatorProjects } from './useCalculatorProjects';

interface UseCalculatorSaveProps {
  projectName: string;
  calculationInput: CalculationInput | null;
  calculationResult: CalculationResult | null;
  setAuthError: (error: Error | null) => void;
  setSavingError: (error: Error | null) => void;
  setIsSaving: (isSaving: boolean) => void;
  setShowSaveDialog: (show: boolean) => void;
  hasProjectsContext: boolean;
  saveProject?: (project: any) => Promise<any>;
  saveTimeout: NodeJS.Timeout | null;
  setSaveTimeout: (timeout: NodeJS.Timeout | null) => void;
  clearSaveTimeout: () => void;
}

export function useCalculatorSave({
  projectName,
  calculationInput,
  calculationResult,
  setAuthError,
  setSavingError,
  setIsSaving,
  setShowSaveDialog,
  hasProjectsContext,
  saveProject,
  saveTimeout,
  setSaveTimeout,
  clearSaveTimeout
}: UseCalculatorSaveProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleSaveClick = useCallback(() => {
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

    if (!hasProjectsContext) {
      setAuthError(new Error("Project functionality is not available in this mode"));
      return;
    }
    
    if (!calculationInput || !calculationResult) {
      toast.error("Please complete your calculation before saving");
      return;
    }

    setShowSaveDialog(true);
  }, [user, calculationInput, calculationResult, hasProjectsContext, setAuthError, setSavingError, setShowSaveDialog]);

  // Simplified save function with proper error handling and timeout
  const handleSaveConfirm = useCallback(async () => {
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

    if (!hasProjectsContext || !saveProject) {
      setSavingError(new Error("Project saving is not available in this mode"));
      setShowSaveDialog(false);
      return;
    }
    
    setIsSaving(true);
    setSavingError(null);
    clearSaveTimeout();
    
    // Set a timeout to prevent hanging indefinitely
    const timeout = setTimeout(() => {
      console.error("Save operation timed out");
      setIsSaving(false);
      setSavingError(new Error("Save operation timed out. Please try again."));
      setShowSaveDialog(false);
      toast.error("Save operation timed out. Please try again.");
    }, 20000); // 20 second timeout
    
    setSaveTimeout(timeout);
    
    try {
      // Ensure we have a valid calculation result
      if (!calculationResult) {
        throw new Error("Missing calculation result. Please calculate before saving.");
      }
      
      // Prepare the project data
      const projectData = {
        name: projectName,
        description: "Carbon calculation project",
        materials: calculationInput?.materials,
        transport: calculationInput?.transport,
        energy: calculationInput?.energy,
        result: calculationResult,
        tags: ["carbon", "calculation"],
        status: 'draft' as const,
        total_emissions: calculationResult.totalEmissions || 0,
        premium_only: false
      };
      
      // Save the project - safety check already performed above
      const savedProject = await saveProject(projectData);
      
      console.log("Project saved successfully:", savedProject);
      
      // Clear timeout since operation completed successfully
      clearSaveTimeout();
      
      setIsSaving(false);
      setShowSaveDialog(false);
      toast.success("Project saved successfully!");
      
      // Navigate after a short delay
      setTimeout(() => {
        navigate(`/projects`);
      }, 300);
    } catch (error) {
      console.error("Error saving project:", error);
      
      // Clear timeout since operation completed (with error)
      clearSaveTimeout();
      
      if (error instanceof Error) {
        setSavingError(error);
      } else {
        setSavingError(new Error("Unknown error occurred while saving"));
      }
      
      setIsSaving(false);
      setShowSaveDialog(false);
      toast.error(`Failed to save project: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [
    user, projectName, calculationInput, calculationResult, navigate, saveProject, 
    clearSaveTimeout, hasProjectsContext, setAuthError, setSavingError, 
    setIsSaving, setShowSaveDialog, setSaveTimeout
  ]);

  const handleSignIn = useCallback(() => {
    navigate("/auth", { state: { returnTo: "/calculator" } });
  }, [navigate]);

  return {
    handleSaveClick,
    handleSaveConfirm,
    handleSignIn
  };
}
