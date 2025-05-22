
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
  activeTab: string;
  isCalculating: boolean;
  setMaterials: (materials: MaterialInput[]) => void;
  setTransport: (transport: TransportInput[]) => void;
  setEnergy: (energy: EnergyInput[]) => void;
  setCalculationResult: (result: CalculationResult | null) => void;
  setProjectName: (name: string) => void;
  setActiveTab: (tab: string) => void;
  setIsCalculating: (isCalculating: boolean) => void;
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
  const [activeTab, setActiveTab] = useState('materials');
  const [isCalculating, setIsCalculating] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const storedMaterials = localStorage.getItem('carbonCalculator.materials');
      const storedTransport = localStorage.getItem('carbonCalculator.transport');
      const storedEnergy = localStorage.getItem('carbonCalculator.energy');
      const storedResult = localStorage.getItem('carbonCalculator.result');
      const storedProjectName = localStorage.getItem('carbonCalculator.projectName');
      const storedActiveTab = localStorage.getItem('carbonCalculator.activeTab');
      
      if (storedMaterials) setMaterials(JSON.parse(storedMaterials));
      if (storedTransport) setTransport(JSON.parse(storedTransport));
      if (storedEnergy) setEnergy(JSON.parse(storedEnergy));
      if (storedResult) setCalculationResult(JSON.parse(storedResult));
      if (storedProjectName) setProjectName(storedProjectName);
      if (storedActiveTab) setActiveTab(storedActiveTab);
      
      // Initialize with default transport item if none exists
      if (!storedTransport || JSON.parse(storedTransport).length === 0) {
        console.log("Initializing with a default transport item");
        setTransport([{
          mode: "truck",
          distance: 0,
          weight: 0,
          carbonFootprint: 0.1,
          type: "truck"
        }]);
      }
      
      // Initialize with default material if none exists
      if (!storedMaterials || JSON.parse(storedMaterials).length === 0) {
        console.log("Initializing with a default material");
        setMaterials([{
          name: "Concrete",
          type: "concrete",
          quantity: 1000,
          unit: "kg",
          carbonFootprint: 0.12
        }]);
      }
    } catch (error) {
      console.error("Error loading calculator data from localStorage:", error);
    }
  }, []);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      if (materials.length > 0) localStorage.setItem('carbonCalculator.materials', JSON.stringify(materials));
      if (transport.length > 0) localStorage.setItem('carbonCalculator.transport', JSON.stringify(transport));
      if (energy.length > 0) localStorage.setItem('carbonCalculator.energy', JSON.stringify(energy));
      if (calculationResult) localStorage.setItem('carbonCalculator.result', JSON.stringify(calculationResult));
      localStorage.setItem('carbonCalculator.projectName', projectName);
      localStorage.setItem('carbonCalculator.activeTab', activeTab);
    } catch (error) {
      console.error("Error saving calculator data to localStorage:", error);
    }
  }, [materials, transport, energy, calculationResult, projectName, activeTab]);

  const value = {
    materials,
    transport, 
    energy,
    calculationResult,
    projectName,
    activeTab,
    isCalculating,
    setMaterials,
    setTransport,
    setEnergy,
    setCalculationResult,
    setProjectName,
    setActiveTab,
    setIsCalculating
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
      activeTab: 'materials',
      isCalculating: false,
      setMaterials: () => {},
      setTransport: () => {},
      setEnergy: () => {},
      setCalculationResult: () => {},
      setProjectName: () => {},
      setActiveTab: () => {},
      setIsCalculating: () => {}
    };
  }
  return context;
};
