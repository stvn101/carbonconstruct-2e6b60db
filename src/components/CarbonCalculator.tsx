
import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

// Import the new component sections
import MaterialsInputSection from "./calculator/MaterialsInputSection";
import TransportInputSection from "./calculator/TransportInputSection";
import EnergyInputSection from "./calculator/EnergyInputSection";
import ResultsSection from "./calculator/ResultsSection";

const DEFAULT_CALCULATION_INPUT: CalculationInput = {
  materials: [{ type: "concrete", quantity: 1000 }],
  transport: [{ type: "truck", distance: 100, weight: 1000 }],
  energy: [{ type: "electricity", amount: 500 }]
};

const CarbonCalculator = () => {
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

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Carbon Footprint Calculator</h1>
        <p className="text-lg text-muted-foreground mb-8">
          Calculate the carbon emissions of your construction projects with our precise calculator
          that accounts for materials, transportation, and energy use.
        </p>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Calculator className="h-6 w-6 text-carbon-600" />
              <CardTitle>Project Carbon Calculator</CardTitle>
            </div>
            <CardDescription>
              Enter the details of your construction project to calculate its carbon footprint.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 mb-6">
                <TabsTrigger 
                  value="materials" 
                  className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white"
                >
                  Materials
                </TabsTrigger>
                <TabsTrigger 
                  value="transport" 
                  className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white"
                >
                  Transport
                </TabsTrigger>
                <TabsTrigger 
                  value="energy" 
                  className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white"
                >
                  Energy
                </TabsTrigger>
                <TabsTrigger 
                  value="results" 
                  className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white"
                >
                  Results
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="materials">
                <MaterialsInputSection 
                  materials={calculationInput.materials}
                  onUpdateMaterial={handleUpdateMaterial}
                  onAddMaterial={handleAddMaterial}
                  onRemoveMaterial={handleRemoveMaterial}
                  onNext={handleNextTab}
                />
              </TabsContent>
              
              <TabsContent value="transport">
                <TransportInputSection 
                  transportItems={calculationInput.transport}
                  onUpdateTransport={handleUpdateTransport}
                  onAddTransport={handleAddTransport}
                  onRemoveTransport={handleRemoveTransport}
                  onNext={handleNextTab}
                  onPrev={handlePrevTab}
                />
              </TabsContent>
              
              <TabsContent value="energy">
                <EnergyInputSection 
                  energyItems={calculationInput.energy}
                  onUpdateEnergy={handleUpdateEnergy}
                  onAddEnergy={handleAddEnergy}
                  onRemoveEnergy={handleRemoveEnergy}
                  onCalculate={handleNextTab}
                  onPrev={handlePrevTab}
                />
              </TabsContent>
              
              <TabsContent value="results">
                <ResultsSection 
                  calculationResult={calculationResult}
                  materials={calculationInput.materials}
                  transport={calculationInput.transport}
                  energy={calculationInput.energy}
                  onCalculate={handleCalculate}
                  onPrev={handlePrevTab}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CarbonCalculator;
