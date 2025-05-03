
import { useState, useCallback } from "react";
import { CalculationInput, CalculationResult } from "@/lib/carbonCalculations";

// Default calculation input with initial values
const DEFAULT_CALCULATION_INPUT: CalculationInput = {
  materials: [{ type: "concrete", quantity: 1000 }],
  transport: [{ type: "truck", distance: 100, weight: 1000 }],
  energy: [{ type: "electricity", amount: 500 }]
};

export function useCalculatorState() {
  // Core state
  const [calculationInput, setCalculationInput] = useState<CalculationInput>(DEFAULT_CALCULATION_INPUT);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'materials' | 'transport' | 'energy' | 'results'>('materials');
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Array<{field: string, message: string}>>([]);
  const [calculationError, setCalculationError] = useState<Error | null>(null);
  
  // Project saving related state
  const [projectName, setProjectName] = useState<string>('');
  const [authError, setAuthError] = useState<Error | null>(null);
  const [savingError, setSavingError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showSaveDialog, setShowSaveDialog] = useState<boolean>(false);
  const [projectsContextError, setProjectsContextError] = useState<Error | null>(null);

  // Use useCallback to stabilize functions to prevent render loops
  const stableSetActiveTab = useCallback((tab: 'materials' | 'transport' | 'energy' | 'results') => {
    setActiveTab(tab);
  }, []);

  const stableSetCalculationInput = useCallback((input: CalculationInput | ((prevInput: CalculationInput) => CalculationInput)) => {
    setCalculationInput(input);
  }, []);

  const stableSetCalculationResult = useCallback((result: CalculationResult | null) => {
    setCalculationResult(result);
  }, []);

  const stableSetIsCalculating = useCallback((calculating: boolean) => {
    setIsCalculating(calculating);
  }, []);

  const stableSetValidationErrors = useCallback((errors: Array<{field: string, message: string}>) => {
    setValidationErrors(errors);
  }, []);

  const stableSetCalculationError = useCallback((error: Error | null) => {
    setCalculationError(error);
  }, []);

  const stableSetProjectName = useCallback((name: string) => {
    setProjectName(name);
  }, []);

  const stableSetAuthError = useCallback((error: Error | null) => {
    setAuthError(error);
  }, []);

  const stableSetSavingError = useCallback((error: Error | null) => {
    setSavingError(error);
  }, []);

  const stableSetIsSaving = useCallback((saving: boolean) => {
    setIsSaving(saving);
  }, []);

  const stableSetShowSaveDialog = useCallback((show: boolean) => {
    setShowSaveDialog(show);
  }, []);

  const stableSetProjectsContextError = useCallback((error: Error | null) => {
    setProjectsContextError(error);
  }, []);

  return {
    calculationInput,
    setCalculationInput: stableSetCalculationInput,
    calculationResult,
    setCalculationResult: stableSetCalculationResult,
    activeTab,
    setActiveTab: stableSetActiveTab,
    isCalculating,
    setIsCalculating: stableSetIsCalculating,
    validationErrors,
    setValidationErrors: stableSetValidationErrors,
    calculationError,
    setCalculationError: stableSetCalculationError,
    
    // Project saving related state
    projectName,
    setProjectName: stableSetProjectName,
    authError,
    setAuthError: stableSetAuthError,
    savingError,
    setSavingError: stableSetSavingError,
    isSaving, 
    setIsSaving: stableSetIsSaving,
    showSaveDialog,
    setShowSaveDialog: stableSetShowSaveDialog,
    projectsContextError,
    setProjectsContextError: stableSetProjectsContextError
  };
}
