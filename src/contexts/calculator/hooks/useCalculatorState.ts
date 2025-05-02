
import { useState, useEffect, useCallback } from "react";
import { CalculationInput, CalculationResult } from "@/lib/carbonCalculations";
import { validateCalculationInput } from "@/utils/calculatorValidation";

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

  // Effect for tab changes
  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
    
    // When switching to results tab, preemptively validate inputs
    if (activeTab === 'results' && !calculationResult) {
      const errors = validateCalculationInput(calculationInput);
      setValidationErrors(errors);
    }
  }, [activeTab, calculationInput, calculationResult]);

  return {
    calculationInput,
    setCalculationInput,
    calculationResult,
    setCalculationResult,
    activeTab,
    setActiveTab,
    isCalculating,
    setIsCalculating,
    validationErrors,
    setValidationErrors,
    calculationError,
    setCalculationError,
  };
}
