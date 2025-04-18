
import { useState } from "react";
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

export function useCalculator() {
  const [calculationInput, setCalculationInput] = useState<CalculationInput>(DEFAULT_CALCULATION_INPUT);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>("materials");

  const handleAddMaterial = () => {
    setCalculationInput(prev => ({
      ...prev,
      materials: [...prev.materials, { type: "concrete", quantity: 0 }]
    }));
  };

  const handleUpdateMaterial = (index: number, field: keyof MaterialInput, value: string | number) => {
    setCalculationInput(prev => {
      const updatedMaterials = [...prev.materials];
      if (field === "type") {
        updatedMaterials[index] = { ...updatedMaterials[index], [field]: value as Material };
      } else {
        updatedMaterials[index] = { ...updatedMaterials[index], [field]: Number(value) };
      }
      return { ...prev, materials: updatedMaterials };
    });
  };

  const handleRemoveMaterial = (index: number) => {
    setCalculationInput(prev => {
      const updatedMaterials = prev.materials.filter((_, i) => i !== index);
      return { ...prev, materials: updatedMaterials.length ? updatedMaterials : [{ type: "concrete", quantity: 0 }] };
    });
  };

  const handleAddTransport = () => {
    setCalculationInput(prev => ({
      ...prev,
      transport: [...prev.transport, { type: "truck", distance: 0, weight: 0 }]
    }));
  };

  const handleUpdateTransport = (index: number, field: keyof TransportInput, value: string | number) => {
    setCalculationInput(prev => {
      const updatedTransport = [...prev.transport];
      if (field === "type") {
        updatedTransport[index] = { ...updatedTransport[index], [field]: value as Transport };
      } else {
        updatedTransport[index] = { ...updatedTransport[index], [field]: Number(value) };
      }
      return { ...prev, transport: updatedTransport };
    });
  };

  const handleRemoveTransport = (index: number) => {
    setCalculationInput(prev => {
      const updatedTransport = prev.transport.filter((_, i) => i !== index);
      return { ...prev, transport: updatedTransport.length ? updatedTransport : [{ type: "truck", distance: 0, weight: 0 }] };
    });
  };

  const handleAddEnergy = () => {
    setCalculationInput(prev => ({
      ...prev,
      energy: [...prev.energy, { type: "electricity", amount: 0 }]
    }));
  };

  const handleUpdateEnergy = (index: number, field: keyof EnergyInput, value: string | number) => {
    setCalculationInput(prev => {
      const updatedEnergy = [...prev.energy];
      if (field === "type") {
        updatedEnergy[index] = { ...updatedEnergy[index], [field]: value as Energy };
      } else {
        updatedEnergy[index] = { ...updatedEnergy[index], [field]: Number(value) };
      }
      return { ...prev, energy: updatedEnergy };
    });
  };

  const handleRemoveEnergy = (index: number) => {
    setCalculationInput(prev => {
      const updatedEnergy = prev.energy.filter((_, i) => i !== index);
      return { ...prev, energy: updatedEnergy.length ? updatedEnergy : [{ type: "electricity", amount: 0 }] };
    });
  };

  const handleCalculate = () => {
    const result = calculateTotalEmissions(calculationInput);
    setCalculationResult(result);
  };

  const handleNextTab = () => {
    if (activeTab === "materials") {
      setActiveTab("transport");
    } else if (activeTab === "transport") {
      setActiveTab("energy");
    } else if (activeTab === "energy") {
      handleCalculate();
      setActiveTab("results");
    }
  };

  const handlePrevTab = () => {
    if (activeTab === "transport") {
      setActiveTab("materials");
    } else if (activeTab === "energy") {
      setActiveTab("transport");
    } else if (activeTab === "results") {
      setActiveTab("energy");
    }
  };

  return {
    calculationInput,
    setCalculationInput,
    calculationResult,
    setCalculationResult, // Added this missing property
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
  };
}
