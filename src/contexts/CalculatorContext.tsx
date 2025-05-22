
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MaterialInput, TransportInput, EnergyInput } from '@/lib/carbonExports';

interface CalculationResult {
  totalCO2: number;
  breakdownByCategory: Record<string, number>;
  breakdownByMaterial: Record<string, number>;
  sustainabilityScore: number;
}

interface CalculatorContextType {
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  calculationResult: CalculationResult | null;
  projectName: string;
  setMaterials: (materials: MaterialInput[]) => void;
  setTransport: (transport: TransportInput[]) => void;
  setEnergy: (energy: EnergyInput[]) => void;
  setCalculationResult: (result: CalculationResult | null) => void;
  setProjectName: (name: string) => void;
}

const defaultCalculationResult: CalculationResult = {
  totalCO2: 0,
  breakdownByCategory: {},
  breakdownByMaterial: {},
  sustainabilityScore: 0
};

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [materials, setMaterials] = useState<MaterialInput[]>([]);
  const [transport, setTransport] = useState<TransportInput[]>([]);
  const [energy, setEnergy] = useState<EnergyInput[]>([]);
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [projectName, setProjectName] = useState('New Construction Project');

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedMaterials = localStorage.getItem('carbonCalculator.materials');
      const storedTransport = localStorage.getItem('carbonCalculator.transport');
      const storedEnergy = localStorage.getItem('carbonCalculator.energy');
      const storedResult = localStorage.getItem('carbonCalculator.result');
      const storedProjectName = localStorage.getItem('carbonCalculator.projectName');
      
      if (storedMaterials) setMaterials(JSON.parse(storedMaterials));
      if (storedTransport) setTransport(JSON.parse(storedTransport));
      if (storedEnergy) setEnergy(JSON.parse(storedEnergy));
      if (storedResult) setCalculationResult(JSON.parse(storedResult));
      if (storedProjectName) setProjectName(storedProjectName);
    } catch (error) {
      console.error("Error loading calculator data from localStorage:", error);
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (materials.length > 0) localStorage.setItem('carbonCalculator.materials', JSON.stringify(materials));
    if (transport.length > 0) localStorage.setItem('carbonCalculator.transport', JSON.stringify(transport));
    if (energy.length > 0) localStorage.setItem('carbonCalculator.energy', JSON.stringify(energy));
    if (calculationResult) localStorage.setItem('carbonCalculator.result', JSON.stringify(calculationResult));
    localStorage.setItem('carbonCalculator.projectName', projectName);
  }, [materials, transport, energy, calculationResult, projectName]);

  const value = {
    materials,
    transport, 
    energy,
    calculationResult,
    projectName,
    setMaterials,
    setTransport,
    setEnergy,
    setCalculationResult,
    setProjectName
  };

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = () => {
  const context = useContext(CalculatorContext);
  if (context === undefined) {
    console.warn('useCalculator must be used within a CalculatorProvider');
    return {
      materials: [],
      transport: [],
      energy: [],
      calculationResult: defaultCalculationResult,
      projectName: 'New Project',
      setMaterials: () => {},
      setTransport: () => {},
      setEnergy: () => {},
      setCalculationResult: () => {},
      setProjectName: () => {}
    };
  }
  return context;
};
