
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
  
  /**
   * Check if user is authenticated and handle auth errors
   */
  const checkAuthentication = useCallback(() => {
    if (!user) {
      setAuthError(new Error("Authentication required to save projects"));
      setShowSaveDialog(false);
      return false;
    }
    return true;
  }, [user, setAuthError, setShowSaveDialog]);
  
  /**
   * Check if user is online and handle offline state
   */
  const checkOnlineStatus = useCallback(() => {
    if (!navigator.onLine) {
      showErrorToast("You're offline. Please connect to the internet to save projects.");
      setShowSaveDialog(false);
      return false;
    }
    return true;
  }, [setShowSaveDialog]);
  
  /**
   * Verify project context availability
   */
  const verifyProjectContext = useCallback(() => {
    if (!hasProjectsContext || !saveProject) {
      setSavingError(new Error("Project saving is not available in this mode"));
      setShowSaveDialog(false);
      return false;
    }
    return true;
  }, [hasProjectsContext, saveProject, setSavingError, setShowSaveDialog]);
  
  /**
   * Set up save timeout to prevent hanging operations
   */
  const setupSaveTimeout = useCallback(() => {
    clearSaveTimeout();
    
    const timeout = setTimeout(() => {
      console.error("Save operation timed out");
      setIsSaving(false);
      setSavingError(new Error("Save operation timed out. Please try again."));
      setShowSaveDialog(false);
      toast.error("Save operation timed out. Please try again.");
    }, 20000); // 20 second timeout
    
    setSaveTimeout(timeout);
  }, [clearSaveTimeout, setSaveTimeout, setIsSaving, setSavingError, setShowSaveDialog]);
  
  /**
   * Prepare project data for saving
   */
  const prepareProjectData = useCallback(() => {
    if (!calculationResult) {
      throw new Error("Missing calculation result. Please calculate before saving.");
    }
    
    return {
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
  }, [projectName, calculationInput, calculationResult]);
  
  /**
   * Handle successful save operation
   */
  const handleSaveSuccess = useCallback((savedProject: any) => {
    console.log("Project saved successfully:", savedProject);
    
    clearSaveTimeout();
    setIsSaving(false);
    setShowSaveDialog(false);
    toast.success("Project saved successfully!");
    
    // Navigate after a short delay
    setTimeout(() => {
      navigate(`/projects`);
    }, 300);
  }, [clearSaveTimeout, setIsSaving, setShowSaveDialog, navigate]);
  
  /**
   * Handle save error
   */
  const handleSaveError = useCallback((error: unknown) => {
    console.error("Error saving project:", error);
    
    clearSaveTimeout();
    
    if (error instanceof Error) {
      setSavingError(error);
    } else {
      setSavingError(new Error("Unknown error occurred while saving"));
    }
    
    setIsSaving(false);
    setShowSaveDialog(false);
    toast.error(`Failed to save project: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }, [clearSaveTimeout, setSavingError, setIsSaving, setShowSaveDialog]);

  /**
   * Handle save button click
   */
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

  /**
   * Handle save confirmation
   */
  const handleSaveConfirm = useCallback(async () => {
    // Perform validation checks
    if (!checkAuthentication()) return;
    if (!checkOnlineStatus()) return;
    if (!verifyProjectContext()) return;
    
    // Start saving process
    setIsSaving(true);
    setSavingError(null);
    setupSaveTimeout();
    
    try {
      // Prepare and save the project data
      const projectData = prepareProjectData();
      const savedProject = await saveProject!(projectData);
      handleSaveSuccess(savedProject);
    } catch (error) {
      handleSaveError(error);
    }
  }, [
    checkAuthentication,
    checkOnlineStatus,
    verifyProjectContext,
    setIsSaving,
    setSavingError,
    setupSaveTimeout,
    prepareProjectData,
    saveProject,
    handleSaveSuccess,
    handleSaveError
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
