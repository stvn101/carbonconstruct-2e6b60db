
import { useState } from 'react';
import { useCalculator } from '@/contexts/calculator';
import { useCalculatorState } from './useCalculatorState';
import { useCalculatorSave } from './useCalculatorSave';
import { useCalculatorTimeout } from './useCalculatorTimeout';
import { SavedProject } from '@/types/project';

export interface UseCalculatorActionsProps {
  demoMode?: boolean;
}

export function useCalculatorActions({ demoMode = false }: UseCalculatorActionsProps) {
  // Use our smaller, focused hooks
  const calculatorState = useCalculatorState();
  const { 
    projectName, setProjectName,
    authError, setAuthError,
    savingError, setSavingError,
    isSaving, setIsSaving,
    showSaveDialog, setShowSaveDialog,
    projectsContextError, setProjectsContextError
  } = calculatorState;
  
  const { saveTimeout, setSaveTimeout, clearSaveTimeout } = useCalculatorTimeout();
  
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

  const isExistingProject = hasProjectsContext && projects.length > 0 && !!projects.find(
    p => p.name.toLowerCase() === projectName.toLowerCase()
  );

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
  
  // Setup calculator save hooks with all required dependencies
  const { handleSaveClick, handleSaveConfirm, handleSignIn } = useCalculatorSave({
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
  });

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
