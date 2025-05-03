
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
  };
}
