
import { useState } from 'react';
import { useCalculator } from '@/contexts/calculator';
import { SavedProject } from '@/types/project';

export interface UseCalculatorActionsProps {
  demoMode?: boolean;
}

export function useCalculatorActions({ demoMode = false }: UseCalculatorActionsProps) {
  // State management
  const [projectName, setProjectName] = useState('');
  const [authError, setAuthError] = useState<Error | null>(null);
  const [savingError, setSavingError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [projectsContextError, setProjectsContextError] = useState<Error | null>(null);
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Clear save timeout utility
  const clearSaveTimeout = () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      setSaveTimeout(null);
    }
  };
  
  // Initialize with safer defaults
  let saveProject: ((project: any) => Promise<SavedProject>) | undefined;
  let projects: SavedProject[] = [];
  let hasProjectsContext = false;
  let error = false;
  let calculatorContext = null;
  let isCalculating = false;
  let setIsCalculating = () => {};

  // Safely check for calculator context first - it's critical
  try {
    calculatorContext = useCalculator();
    if (calculatorContext) {
      isCalculating = calculatorContext.isCalculating;
      setIsCalculating = calculatorContext.setIsCalculating;
    }
  } catch (e) {
    error = true;
    console.error("Error accessing calculator context:", e);
  }

  // Only try to access projects context if calculator context succeeded
  if (!error && !demoMode) {
    try {
      // Import ProjectContext directly rather than using dynamic require
      const { useProjects } = require('@/contexts/ProjectContext');
      if (useProjects) {
        try {
          const projectsContext = useProjects();
          if (projectsContext) {
            saveProject = projectsContext.saveProject;
            projects = projectsContext.projects || [];
            hasProjectsContext = true;
          }
        } catch (e) {
          console.warn('Error using ProjectContext:', e);
          hasProjectsContext = false;
          setProjectsContextError(e instanceof Error ? e : new Error('Error using ProjectContext'));
        }
      } else {
        console.warn('useProjects not available');
        hasProjectsContext = false;
      }
    } catch (e) {
      console.warn('ProjectContext module not available:', e);
      hasProjectsContext = false;
      setProjectsContextError(e instanceof Error ? e : new Error('ProjectContext module not available'));
    }
  }

  const isExistingProject = hasProjectsContext && projects.length > 0 && !!projects.find(
    p => p.name.toLowerCase() === projectName.toLowerCase()
  );

  // Handler for saving projects
  const handleSaveClick = () => {
    if (demoMode) {
      setAuthError(new Error('Please sign in to save projects'));
      return;
    }
    
    if (!hasProjectsContext) {
      setSavingError(new Error('Project saving is not available'));
      return;
    }
    
    setShowSaveDialog(true);
  };
  
  // Handler for confirming save
  const handleSaveConfirm = async () => {
    if (!calculatorContext?.calculationResult || !saveProject) {
      setSavingError(new Error('Unable to save project - missing data or save function'));
      return;
    }
    
    setIsSaving(true);
    try {
      await saveProject({
        name: projectName,
        materials: calculatorContext.calculationInput.materials,
        transport: calculatorContext.calculationInput.transport,
        energy: calculatorContext.calculationInput.energy,
        result: calculatorContext.calculationResult
      });
      
      setShowSaveDialog(false);
      setIsSaving(false);
    } catch (error) {
      setSavingError(error instanceof Error ? error : new Error('Failed to save project'));
      setIsSaving(false);
    }
  };
  
  // Handler for sign in
  const handleSignIn = () => {
    // This would redirect to sign in page or open sign in modal
    console.log('Sign in handler called');
    // Implement redirection or modal opening logic here
  };

  return {
    error: !calculatorContext || (projectsContextError && !demoMode), 
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
