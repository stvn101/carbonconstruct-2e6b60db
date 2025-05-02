
import React, { createContext, useMemo } from "react";
import { CalculatorContextType } from "./types";
import { useCalculatorState } from "./hooks/useCalculatorState";
import { useCalculatorOperations } from "./hooks/useCalculatorOperations";
import { useCalculatorNavigation } from "./hooks/useCalculatorNavigation";
import { useCalculatorInputHandlers } from "./hooks/useCalculatorInputHandlers";

export const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core state management
  const {
    calculationInput,
    setCalculationInput,
    calculationResult,
    setCalculationResult,
    activeTab,
    setActiveTab,
    isCalculating,
    setIsCalculating,
    validationErrors,
    calculationError,
    setCalculationError,
    setValidationErrors,
  } = useCalculatorState();
  
  // Calculator input handlers
  const inputHandlers = useCalculatorInputHandlers({
    setCalculationInput
  });

  // Calculator operations
  const { handleCalculate, resetCalculationErrors } = useCalculatorOperations({
    calculationInput,
    setCalculationResult,
    setCalculationError,
    setValidationErrors,
    setIsCalculating,
    setActiveTab,
  });

  // Tab navigation
  const { handleNextTab, handlePrevTab } = useCalculatorNavigation({
    activeTab,
    setActiveTab,
    calculationInput,
    setCalculationResult,
    setCalculationError,
    setIsCalculating,
  });

  // Create memoized context value
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
    handleAddMaterial: inputHandlers.handleAddMaterial,
    handleUpdateMaterial: inputHandlers.handleUpdateMaterial,
    handleRemoveMaterial: inputHandlers.handleRemoveMaterial,
    handleAddTransport: inputHandlers.handleAddTransport,
    handleUpdateTransport: inputHandlers.handleUpdateTransport,
    handleRemoveTransport: inputHandlers.handleRemoveTransport,
    handleAddEnergy: inputHandlers.handleAddEnergy,
    handleUpdateEnergy: inputHandlers.handleUpdateEnergy,
    handleRemoveEnergy: inputHandlers.handleRemoveEnergy,
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
    handlePrevTab,
    inputHandlers
  ]);

  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
    </CalculatorContext.Provider>
  );
};
