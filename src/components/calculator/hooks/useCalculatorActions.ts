
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
  if (!error) {
    try {
      // Use a safer approach than dynamic require
      const projectsModule = window.require ? window.require('@/contexts/ProjectContext') : null;
      
      if (projectsModule && projectsModule.useProjects) {
        const projectsContext = projectsModule.useProjects();
        saveProject = projectsContext.saveProject;
        projects = projectsContext.projects || [];
        hasProjectsContext = true;
      } else {
        console.warn('ProjectContext not available, running in standalone calculator mode');
        hasProjectsContext = false;
      }
    } catch (e) {
      console.warn('ProjectContext not available, running in standalone calculator mode:', e);
      hasProjectsContext = false;
      setProjectsContextError(e instanceof Error ? e : new Error('ProjectContext not available'));
    }
  }

  const isExistingProject = hasProjectsContext && projects.length > 0 && !!projects.find(
    p => p.name.toLowerCase() === projectName.toLowerCase()
  );

  // Setup calculator save hooks with all required dependencies
  const { handleSaveClick, handleSaveConfirm, handleSignIn } = useCalculatorSave({
    projectName,
    calculationInput: calculatorContext?.calculationInput,
    calculationResult: calculatorContext?.calculationResult,
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
