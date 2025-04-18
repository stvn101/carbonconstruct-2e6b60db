
import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react";
import {
  CalculationInput,
  CalculationResult,
  Material,
  MaterialInput,
  Transport,
  TransportInput,
  Energy,
  EnergyInput,
  calculateTotalEmissions
} from "@/lib/carbonCalculations";

const DEFAULT_CALCULATION_INPUT: CalculationInput = {
  materials: [{ type: "concrete", quantity: 1000 }],
  transport: [{ type: "truck", distance: 100, weight: 1000 }],
  energy: [{ type: "electricity", amount: 500 }]
};

type CalculatorContextType = {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult | null;
  activeTab: string;
  setActiveTab: (value: string) => void;
  handleAddMaterial: () => void;
  handleUpdateMaterial: (index: number, field: keyof MaterialInput, value: string | number) => void;
  handleRemoveMaterial: (index: number) => void;
  handleAddTransport: () => void;
  handleUpdateTransport: (index: number, field: keyof TransportInput, value: string | number) => void;
  handleRemoveTransport: (index: number) => void;
  handleAddEnergy: () => void;
  handleUpdateEnergy: (index: number, field: keyof EnergyInput, value: string | number) => void;
  handleRemoveEnergy: (index: number) => void;
  handleCalculate: () => void;
  handleNextTab: () => void;
  handlePrevTab: () => void;
  setCalculationInput: (input: CalculationInput) => void;
  setCalculationResult: (result: CalculationResult | null) => void;
};

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [calculationInput, setCalculationInput] = useState<CalculationInput>(DEFAULT_CALCULATION_INPUT);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>("materials");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("CalculatorProvider initialized");
    setIsInitialized(true);
    return () => {
      console.log("CalculatorProvider unmounted");
      setIsInitialized(false);
    };
  }, []);

  // Memoize these handlers to prevent unnecessary re-renders
  const handleAddMaterial = useCallback(() => {
    setCalculationInput(prev => ({
      ...prev,
      materials: [...prev.materials, { type: "concrete", quantity: 0 }]
    }));
  }, []);

  const handleUpdateMaterial = useCallback((index: number, field: keyof MaterialInput, value: string | number) => {
    setCalculationInput(prev => {
      const updatedMaterials = [...prev.materials];
      if (field === "type") {
        updatedMaterials[index] = { ...updatedMaterials[index], [field]: value as Material };
      } else {
        updatedMaterials[index] = { ...updatedMaterials[index], [field]: Number(value) };
      }
      return { ...prev, materials: updatedMaterials };
    });
  }, []);

  const handleRemoveMaterial = useCallback((index: number) => {
    setCalculationInput(prev => {
      const updatedMaterials = prev.materials.filter((_, i) => i !== index);
      return { ...prev, materials: updatedMaterials.length ? updatedMaterials : [{ type: "concrete", quantity: 0 }] };
    });
  }, []);

  const handleAddTransport = useCallback(() => {
    setCalculationInput(prev => ({
      ...prev,
      transport: [...prev.transport, { type: "truck", distance: 0, weight: 0 }]
    }));
  }, []);

  const handleUpdateTransport = useCallback((index: number, field: keyof TransportInput, value: string | number) => {
    setCalculationInput(prev => {
      const updatedTransport = [...prev.transport];
      if (field === "type") {
        updatedTransport[index] = { ...updatedTransport[index], [field]: value as Transport };
      } else {
        updatedTransport[index] = { ...updatedTransport[index], [field]: Number(value) };
      }
      return { ...prev, transport: updatedTransport };
    });
  }, []);

  const handleRemoveTransport = useCallback((index: number) => {
    setCalculationInput(prev => {
      const updatedTransport = prev.transport.filter((_, i) => i !== index);
      return { ...prev, transport: updatedTransport.length ? updatedTransport : [{ type: "truck", distance: 0, weight: 0 }] };
    });
  }, []);

  const handleAddEnergy = useCallback(() => {
    setCalculationInput(prev => ({
      ...prev,
      energy: [...prev.energy, { type: "electricity", amount: 0 }]
    }));
  }, []);

  const handleUpdateEnergy = useCallback((index: number, field: keyof EnergyInput, value: string | number) => {
    setCalculationInput(prev => {
      const updatedEnergy = [...prev.energy];
      if (field === "type") {
        updatedEnergy[index] = { ...updatedEnergy[index], [field]: value as Energy };
      } else {
        updatedEnergy[index] = { ...updatedEnergy[index], [field]: Number(value) };
      }
      return { ...prev, energy: updatedEnergy };
    });
  }, []);

  const handleRemoveEnergy = useCallback((index: number) => {
    setCalculationInput(prev => {
      const updatedEnergy = prev.energy.filter((_, i) => i !== index);
      return { ...prev, energy: updatedEnergy.length ? updatedEnergy : [{ type: "electricity", amount: 0 }] };
    });
  }, []);

  // Wrap calculation in a safe handler with timeout prevention
  const handleCalculate = useCallback(() => {
    try {
      console.log("Calculating emissions with input:", calculationInput);
      // Prevent calculation if inputs are invalid
      if (!calculationInput?.materials?.length || !calculationInput?.transport?.length || !calculationInput?.energy?.length) {
        console.warn("Invalid calculation input, skipping calculation");
        return;
      }
      
      const result = calculateTotalEmissions(calculationInput);
      console.log("Calculation result:", result);
      setCalculationResult(result);
    } catch (error) {
      console.error("Error calculating emissions:", error);
    }
  }, [calculationInput]);

  const handleNextTab = useCallback(() => {
    if (activeTab === "materials") {
      setActiveTab("transport");
    } else if (activeTab === "transport") {
      setActiveTab("energy");
    } else if (activeTab === "energy") {
      handleCalculate();
      setActiveTab("results");
    }
  }, [activeTab, handleCalculate]);

  const handlePrevTab = useCallback(() => {
    if (activeTab === "transport") {
      setActiveTab("materials");
    } else if (activeTab === "energy") {
      setActiveTab("transport");
    } else if (activeTab === "results") {
      setActiveTab("energy");
    }
  }, [activeTab]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    calculationInput,
    setCalculationInput,
    calculationResult,
    setCalculationResult,
    activeTab,
    setActiveTab,
    handleAddMaterial,
    handleUpdateMaterial,
    handleRemoveMaterial,
    handleAddTransport,
    handleUpdateTransport,
    handleRemoveTransport,
    handleAddEnergy,
    handleUpdateEnergy,
    handleRemoveEnergy,
    handleCalculate,
    handleNextTab,
    handlePrevTab
  }), [
    calculationInput, calculationResult, activeTab,
    handleAddMaterial, handleUpdateMaterial, handleRemoveMaterial,
    handleAddTransport, handleUpdateTransport, handleRemoveTransport,
    handleAddEnergy, handleUpdateEnergy, handleRemoveEnergy,
    handleCalculate, handleNextTab, handlePrevTab
  ]);

  return (
    <CalculatorContext.Provider value={contextValue}>
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  
  if (context === undefined) {
    console.warn('useCalculator hook called outside of CalculatorProvider');
    throw new Error("useCalculator must be used within a CalculatorProvider");
  }
  
  return context;
};

export default CalculatorContext;
