
import { useState } from 'react';
import { Error } from '@/types/project';

export function useCalculatorState() {
  const [projectName, setProjectName] = useState("New Carbon Project");
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [authError, setAuthError] = useState<Error | null>(null);
  const [savingError, setSavingError] = useState<Error | null>(null);
  const [projectsContextError, setProjectsContextError] = useState<Error | null>(null);
  
  return {
    projectName,
    setProjectName,
    isSaving, 
    setIsSaving,
    showSaveDialog, 
    setShowSaveDialog,
    authError, 
    setAuthError,
    savingError, 
    setSavingError,
    projectsContextError,
    setProjectsContextError
  };
}
