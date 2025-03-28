
import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Leaf, Truck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CalculatorResults from "@/components/CalculatorResults";
import {
  CalculationInput,
  CalculationResult,
  Material,
  MaterialInput,
  Transport,
  TransportInput,
  Energy,
  EnergyInput,
  MATERIAL_FACTORS,
  TRANSPORT_FACTORS,
  ENERGY_FACTORS,
  calculateTotalEmissions
} from "@/lib/carbonCalculations";

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
                <TabsTrigger value="materials" className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  <span className="hidden sm:inline">Materials</span>
                </TabsTrigger>
                <TabsTrigger value="transport" className="flex items-center gap-2">
                  <Truck className="h-4 w-4" />
                  <span className="hidden sm:inline">Transport</span>
                </TabsTrigger>
                <TabsTrigger value="energy" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  <span className="hidden sm:inline">Energy</span>
                </TabsTrigger>
                <TabsTrigger value="results" className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  <span className="hidden sm:inline">Results</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="materials">
                <div className="space-y-6">
                  <div className="text-lg font-medium">Enter Construction Materials</div>
                  
                  {calculationInput.materials.map((material, index) => (
                    <div key={`material-${index}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-5">
                        <Label htmlFor={`material-type-${index}`}>Material Type</Label>
                        <Select
                          value={material.type}
                          onValueChange={(value) => handleUpdateMaterial(index, "type", value)}
                        >
                          <SelectTrigger id={`material-type-${index}`}>
                            <SelectValue placeholder="Select material" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(MATERIAL_FACTORS).map(([key, value]) => (
                              <SelectItem key={key} value={key}>{value.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-5">
                        <Label htmlFor={`material-quantity-${index}`}>
                          Quantity ({MATERIAL_FACTORS[material.type].unit})
                        </Label>
                        <Input
                          id={`material-quantity-${index}`}
                          type="number"
                          value={material.quantity}
                          onChange={(e) => handleUpdateMaterial(index, "quantity", e.target.value)}
                          min={0}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          type="button"
                          onClick={() => handleRemoveMaterial(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between">
                    <Button type="button" onClick={handleAddMaterial}>
                      Add Material
                    </Button>
                    <Button type="button" onClick={handleNextTab}>
                      Next: Transport
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="transport">
                <div className="space-y-6">
                  <div className="text-lg font-medium">Enter Transportation Details</div>
                  
                  {calculationInput.transport.map((transport, index) => (
                    <div key={`transport-${index}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-3">
                        <Label htmlFor={`transport-type-${index}`}>Transport Type</Label>
                        <Select
                          value={transport.type}
                          onValueChange={(value) => handleUpdateTransport(index, "type", value)}
                        >
                          <SelectTrigger id={`transport-type-${index}`}>
                            <SelectValue placeholder="Select transport" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(TRANSPORT_FACTORS).map(([key, value]) => (
                              <SelectItem key={key} value={key}>{value.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-3">
                        <Label htmlFor={`transport-distance-${index}`}>Distance (km)</Label>
                        <Input
                          id={`transport-distance-${index}`}
                          type="number"
                          value={transport.distance}
                          onChange={(e) => handleUpdateTransport(index, "distance", e.target.value)}
                          min={0}
                        />
                      </div>
                      
                      <div className="md:col-span-4">
                        <Label htmlFor={`transport-weight-${index}`}>Weight (kg)</Label>
                        <Input
                          id={`transport-weight-${index}`}
                          type="number"
                          value={transport.weight}
                          onChange={(e) => handleUpdateTransport(index, "weight", e.target.value)}
                          min={0}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          type="button"
                          onClick={() => handleRemoveTransport(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between">
                    <div className="space-x-2">
                      <Button type="button" variant="outline" onClick={handlePrevTab}>
                        Previous
                      </Button>
                      <Button type="button" onClick={handleAddTransport}>
                        Add Transport
                      </Button>
                    </div>
                    <Button type="button" onClick={handleNextTab}>
                      Next: Energy
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="energy">
                <div className="space-y-6">
                  <div className="text-lg font-medium">Enter Energy Consumption</div>
                  
                  {calculationInput.energy.map((energy, index) => (
                    <div key={`energy-${index}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                      <div className="md:col-span-5">
                        <Label htmlFor={`energy-type-${index}`}>Energy Type</Label>
                        <Select
                          value={energy.type}
                          onValueChange={(value) => handleUpdateEnergy(index, "type", value)}
                        >
                          <SelectTrigger id={`energy-type-${index}`}>
                            <SelectValue placeholder="Select energy type" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(ENERGY_FACTORS).map(([key, value]) => (
                              <SelectItem key={key} value={key}>{value.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="md:col-span-5">
                        <Label htmlFor={`energy-amount-${index}`}>
                          Amount ({ENERGY_FACTORS[energy.type].unit})
                        </Label>
                        <Input
                          id={`energy-amount-${index}`}
                          type="number"
                          value={energy.amount}
                          onChange={(e) => handleUpdateEnergy(index, "amount", e.target.value)}
                          min={0}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <Button
                          variant="outline"
                          className="w-full"
                          type="button"
                          onClick={() => handleRemoveEnergy(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between">
                    <div className="space-x-2">
                      <Button type="button" variant="outline" onClick={handlePrevTab}>
                        Previous
                      </Button>
                      <Button type="button" onClick={handleAddEnergy}>
                        Add Energy
                      </Button>
                    </div>
                    <Button type="button" onClick={handleNextTab}>
                      Calculate Results
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="results">
                {calculationResult ? (
                  <CalculatorResults result={calculationResult} materials={calculationInput.materials} transport={calculationInput.transport} energy={calculationInput.energy} />
                ) : (
                  <div className="space-y-6 text-center py-10">
                    <p className="text-lg">Click the calculate button to see results.</p>
                    <Button type="button" size="lg" onClick={handleCalculate}>
                      Calculate Now
                    </Button>
                  </div>
                )}
                
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={handlePrevTab}>
                    Previous: Energy
                  </Button>
                  <Button type="button" onClick={handleCalculate}>
                    Recalculate
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CarbonCalculator;
