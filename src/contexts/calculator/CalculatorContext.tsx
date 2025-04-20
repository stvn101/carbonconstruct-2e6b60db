
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
import { MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonTypes";

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
  const [error, setError] = useState<Error | null>(null);

  const handleCalculate = useCallback(() => {
    try {
      if (!calculationInput?.materials?.length || !calculationInput?.transport?.length || !calculationInput?.energy?.length) {
        throw new Error("Please fill in all required fields");
      }
      const result = calculateTotalEmissions(calculationInput);
      setCalculationResult(result);
      setError(null);
    } catch (error) {
      setError(error as Error);
      console.error("Error calculating emissions:", error);
    }
  }, [calculationInput]);

  const handleNextTab = useCallback(() => {
    if (activeTab === "materials") setActiveTab("transport");
    else if (activeTab === "transport") setActiveTab("energy");
    else if (activeTab === "energy") {
      handleCalculate();
      setActiveTab("results");
    }
  }, [activeTab, handleCalculate]);

  const handlePrevTab = useCallback(() => {
    if (activeTab === "transport") setActiveTab("materials");
    else if (activeTab === "energy") setActiveTab("transport");
    else if (activeTab === "results") setActiveTab("energy");
  }, [activeTab]);

  const contextValue = useMemo(() => ({
    calculationInput,
    setCalculationInput,
    calculationResult,
    setCalculationResult,
    activeTab,
    setActiveTab,
    error,
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
  }), [calculationInput, calculationResult, activeTab, error, handleCalculate, handleNextTab, handlePrevTab]);

  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
    </CalculatorContext.Provider>
  );
};
