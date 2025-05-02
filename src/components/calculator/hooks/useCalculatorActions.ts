
import { useState, useCallback, useEffect } from 'react';
import { useCalculator } from '@/contexts/calculator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { showErrorToast } from '@/utils/errorHandling/simpleToastHandler';
import { SavedProject } from '@/contexts/ProjectContext';

export interface UseCalculatorActionsProps {
  demoMode?: boolean;
}

export function useCalculatorActions({ demoMode = false }: UseCalculatorActionsProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projectName, setProjectName] = useState("New Carbon Project");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [savingError, setSavingError] = useState<Error | null>(null);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [projectsContextError, setProjectsContextError] = useState<Error | null>(null);
  
  // Try to get projects context if available
  let saveProject: ((project: any) => Promise<SavedProject>) | undefined;
  let projects: SavedProject[] = [];
  let hasProjectsContext = true;

  try {
    // Try to dynamically import to avoid context errors if not in provider
    const { useProjects } = require('@/contexts/ProjectContext');
    const projectsContext = useProjects();
    saveProject = projectsContext.saveProject;
    projects = projectsContext.projects || [];
  } catch (error) {
    console.warn('ProjectContext not available, running in standalone calculator mode:', error);
    hasProjectsContext = false;
    setProjectsContextError(error instanceof Error ? error : new Error('ProjectContext not available'));
  }

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

  const isExistingProject = hasProjectsContext && projects.length > 0 && !!projects.find(
    p => p.name.toLowerCase() === projectName.toLowerCase()
  );

  const clearSaveTimeout = useCallback(() => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      setSaveTimeout(null);
    }
  }, [saveTimeout]);

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
  }, [user, calculationInput, calculationResult, hasProjectsContext]);

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
        materials: calculationInput.materials,
        transport: calculationInput.transport,
        energy: calculationInput.energy,
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
  }, [user, projectName, calculationInput, calculationResult, navigate, saveProject, 
      clearSaveTimeout, hasProjectsContext]);
  
  const handleSignIn = useCallback(() => {
    navigate("/auth", { state: { returnTo: "/calculator" } });
  }, [navigate]);

  // Clean up timeouts when component unmounts
  useEffect(() => {
    return () => {
      clearSaveTimeout();
    };
  }, [clearSaveTimeout]);

  return {
    error: projectsContextError && !demoMode, // Only treat as error if not in demo mode
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
