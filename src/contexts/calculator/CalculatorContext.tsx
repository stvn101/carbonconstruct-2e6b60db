
import React, { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { CalculationInput, CalculationResult, calculateTotalEmissions } from "@/lib/carbonCalculations";
import { CalculatorContextType } from "./types";
import {
  handleAddMaterial,
  handleUpdateMaterial,
  handleRemoveMaterial,
  handleAddTransport,
  handleUpdateTransport,
  handleRemoveTransport,
  handleAddEnergy,
  handleUpdateEnergy,
  handleRemoveEnergy
} from "@/utils/calculatorHandlers";
import { validateCalculationInput } from "@/utils/calculatorValidation";
import { toast } from "sonner";
import { MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonTypes";
import { showErrorToast } from "@/utils/errorHandling/simpleToastHandler";

const DEFAULT_CALCULATION_INPUT: CalculationInput = {
  materials: [{ type: "concrete", quantity: 1000 }],
  transport: [{ type: "truck", distance: 100, weight: 1000 }],
  energy: [{ type: "electricity", amount: 500 }]
};

export const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [calculationInput, setCalculationInput] = useState<CalculationInput>(DEFAULT_CALCULATION_INPUT);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'materials' | 'transport' | 'energy' | 'results'>('materials');
  const [isCalculating, setIsCalculating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Array<{field: string, message: string}>>([]);
  const [calculationError, setCalculationError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("Active tab changed to:", activeTab);
    
    // When switching to results tab, preemptively validate inputs
    if (activeTab === 'results' && !calculationResult) {
      const errors = validateCalculationInput(calculationInput);
      setValidationErrors(errors);
    }
  }, [activeTab, calculationInput, calculationResult]);

  // Helper function to check if inputs have valid values
  const hasValidInputs = useCallback(() => {
    const hasValidMaterials = calculationInput.materials?.some(m => Number(m.quantity) > 0) || false;
    const hasValidTransport = calculationInput.transport?.some(t => Number(t.distance) > 0 && Number(t.weight) > 0) || false;
    const hasValidEnergy = calculationInput.energy?.some(e => Number(e.amount) > 0) || false;
    
    if (!hasValidMaterials && !hasValidTransport && !hasValidEnergy) {
      return {
        valid: false,
        reason: "You need to add at least one valid material, transport, or energy input with values greater than zero."
      };
    }
    
    return { valid: true, reason: "" };
  }, [calculationInput]);

  // Check for extreme values that might cause calculation issues
  const checkForExtremeValues = useCallback(() => {
    const MAX_SAFE_VALUE = 1e12; // 1 trillion as a reasonable upper limit
    
    // Check materials
    for (const material of calculationInput.materials || []) {
      if (material.quantity > MAX_SAFE_VALUE) {
        return {
          valid: false,
          reason: `Material quantity for ${material.type} is extremely large and may cause calculation issues.`
        };
      }
    }
    
    // Check transport
    for (const item of calculationInput.transport || []) {
      if (item.distance > MAX_SAFE_VALUE) {
        return {
          valid: false,
          reason: `Transport distance for ${item.type} is extremely large and may cause calculation issues.`
        };
      }
      if (item.weight > MAX_SAFE_VALUE) {
        return {
          valid: false,
          reason: `Transport weight for ${item.type} is extremely large and may cause calculation issues.`
        };
      }
    }
    
    // Check energy
    for (const item of calculationInput.energy || []) {
      if (item.amount > MAX_SAFE_VALUE) {
        return {
          valid: false,
          reason: `Energy amount for ${item.type} is extremely large and may cause calculation issues.`
        };
      }
    }
    
    return { valid: true, reason: "" };
  }, [calculationInput]);

  const handleCalculate = useCallback(() => {
    try {
      console.log("Starting calculation with input:", calculationInput);
      setCalculationError(null);
      setIsCalculating(true);
      
      // Network connectivity check
      if (!navigator.onLine) {
        const offlineError = new Error("You're offline. Cannot perform calculations.");
        setCalculationError(offlineError);
        toast.error(offlineError.message);
        setIsCalculating(false);
        return;
      }
      
      // Input validation check
      const inputStatus = hasValidInputs();
      if (!inputStatus.valid) {
        const inputError = new Error(inputStatus.reason);
        setCalculationError(inputError);
        toast.error(inputError.message);
        setIsCalculating(false);
        return;
      }
      
      // Check for extreme values
      const extremeValueCheck = checkForExtremeValues();
      if (!extremeValueCheck.valid) {
        const valueError = new Error(extremeValueCheck.reason);
        setCalculationError(valueError);
        toast.error(valueError.message);
        setIsCalculating(false);
        return;
      }
      
      // Structure validation
      const errors = validateCalculationInput(calculationInput);
      if (errors.length > 0) {
        const validationError = new Error(errors[0].message);
        setValidationErrors(errors);
        setCalculationError(validationError);
        toast.error(validationError.message);
        setIsCalculating(false);
        return;
      }
      
      // Clear previous errors
      setValidationErrors([]);
      
      // Debug logs to track the calculation flow
      console.log("Materials for calculation:", calculationInput.materials);
      console.log("Transport for calculation:", calculationInput.transport);
      console.log("Energy for calculation:", calculationInput.energy);
      
      // Perform the calculation with a small delay to allow UI to update
      setTimeout(() => {
        try {
          // Guard against missing sections
          const safeInput = {
            materials: calculationInput.materials || [],
            transport: calculationInput.transport || [],
            energy: calculationInput.energy || []
          };
          
          const result = calculateTotalEmissions(safeInput);
          console.log('Calculation completed with result:', result);
          
          // Validate the result
          if (result.totalEmissions === undefined || result.totalEmissions === null) {
            throw new Error("Calculation produced invalid emissions total");
          }
          
          if (result.totalEmissions === 0 && 
              Object.keys(result.breakdownByMaterial || {}).length === 0 &&
              Object.keys(result.breakdownByTransport || {}).length === 0 &&
              Object.keys(result.breakdownByEnergy || {}).length === 0) {
            const emptyResultWarning = new Error("Calculation produced no emissions data. Please check your inputs.");
            console.warn(emptyResultWarning.message);
            showErrorToast(emptyResultWarning.message);
            // Still set the result - empty is valid, just warn
            setCalculationResult(result);
          } else {
            toast.success("Calculation completed successfully!");
            setCalculationResult(result);
          }
          setActiveTab("results");
        } catch (error) {
          console.error("Error during calculation:", error);
          
          // Classify and handle specific calculation errors
          let errorMessage = "Failed to calculate emissions.";
          
          if (error instanceof Error) {
            if (error.message.includes("type") || error.message.includes("undefined")) {
              errorMessage = "Invalid input types in calculation. Please check your data.";
            } else if (error.message.includes("overflow") || error.message.includes("infinity")) {
              errorMessage = "Calculation overflow. Values are too large.";
            } else {
              errorMessage = `Calculation error: ${error.message}`;
            }
            setCalculationError(error);
          } else {
            setCalculationError(new Error(errorMessage));
          }
          
          toast.error(errorMessage);
        } finally {
          setIsCalculating(false);
        }
      }, 500);
    } catch (error) {
      // Handle any unexpected errors in the outer try/catch
      console.error("Unexpected error in calculation process:", error);
      
      let errorMessage = "An unexpected error occurred.";
      if (error instanceof Error) {
        errorMessage = `Unexpected error: ${error.message}`;
        setCalculationError(error);
      } else {
        setCalculationError(new Error(errorMessage));
      }
      
      toast.error(errorMessage);
      setIsCalculating(false);
    }
  }, [calculationInput, hasValidInputs, checkForExtremeValues]);

  const handleNextTab = useCallback(() => {
    try {
      if (activeTab === "materials") {
        setActiveTab("transport");
      }
      else if (activeTab === "transport") {
        setActiveTab("energy");
      }
      else if (activeTab === "energy") {
        // When moving from energy to results, trigger calculation
        setIsCalculating(true);
        
        // Slight delay to allow UI to update before heavy calculation
        setTimeout(() => {
          try {
            // Guard against missing sections
            const safeInput = {
              materials: calculationInput.materials || [],
              transport: calculationInput.transport || [],
              energy: calculationInput.energy || []
            };
            
            const result = calculateTotalEmissions(safeInput);
            setCalculationResult(result);
            setActiveTab("results");
          } catch (error) {
            console.error("Error during calculation on tab change:", error);
            let errorMessage = "Failed to calculate emissions.";
            
            if (error instanceof Error) {
              errorMessage = `Calculation error: ${error.message}`;
              setCalculationError(error);
            } else {
              setCalculationError(new Error(errorMessage));
            }
            
            toast.error(errorMessage);
          } finally {
            setIsCalculating(false);
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error during tab navigation:", error);
      
      if (error instanceof Error) {
        toast.error(`Navigation error: ${error.message}`);
        setCalculationError(error);
      } else {
        toast.error("An unexpected error occurred during navigation.");
        setCalculationError(new Error("Navigation error"));
      }
    }
  }, [activeTab, calculationInput]);

  const handlePrevTab = useCallback(() => {
    try {
      if (activeTab === "transport") {
        setActiveTab("materials");
      }
      else if (activeTab === "energy") {
        setActiveTab("transport");
      }
      else if (activeTab === "results") {
        setActiveTab("energy");
      }
    } catch (error) {
      console.error("Error during tab navigation:", error);
      toast.error("An error occurred while navigating to the previous tab.");
    }
  }, [activeTab]);

  const resetCalculationErrors = useCallback(() => {
    setCalculationError(null);
    setValidationErrors([]);
  }, []);

  const contextValue = useMemo(() => ({
    calculationInput,
    setCalculationInput,
    calculationResult,
    setCalculationResult,
    activeTab,
    setActiveTab,
    validationErrors,
    calculationError,
    isCalculating,
    setIsCalculating,
    resetCalculationErrors,
    handleAddMaterial: () => setCalculationInput(current => handleAddMaterial(current)),
    handleUpdateMaterial: (index: number, field: keyof MaterialInput, value: any) => 
      setCalculationInput(current => handleUpdateMaterial(current, index, field, value)),
    handleRemoveMaterial: (index: number) => 
      setCalculationInput(current => handleRemoveMaterial(current, index)),
    handleAddTransport: () => setCalculationInput(current => handleAddTransport(current)),
    handleUpdateTransport: (index: number, field: keyof TransportInput, value: any) => 
      setCalculationInput(current => handleUpdateTransport(current, index, field, value)),
    handleRemoveTransport: (index: number) => 
      setCalculationInput(current => handleRemoveTransport(current, index)),
    handleAddEnergy: () => setCalculationInput(current => handleAddEnergy(current)),
    handleUpdateEnergy: (index: number, field: keyof EnergyInput, value: any) => 
      setCalculationInput(current => handleUpdateEnergy(current, index, field, value)),
    handleRemoveEnergy: (index: number) => 
      setCalculationInput(current => handleRemoveEnergy(current, index)),
    handleCalculate,
    handleNextTab,
    handlePrevTab
  }), [
    calculationInput, 
    calculationResult, 
    activeTab, 
    isCalculating, 
    validationErrors,
    calculationError,
    resetCalculationErrors, 
    handleCalculate, 
    handleNextTab, 
    handlePrevTab
  ]);

  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
    </CalculatorContext.Provider>
  );
};
