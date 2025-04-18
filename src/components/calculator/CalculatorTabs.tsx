
import { Calculator } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MaterialsInputSection from "./MaterialsInputSection";
import TransportInputSection from "./TransportInputSection";
import EnergyInputSection from "./EnergyInputSection";
import ResultsSection from "./ResultsSection";
import { CalculationInput, CalculationResult } from "@/lib/carbonCalculations";

interface CalculatorTabsProps {
  isMobile: boolean;
  activeTab: string;
  setActiveTab: (value: string) => void;
  calculationInput: CalculationInput;
  calculationResult: CalculationResult | null;
  onUpdateMaterial: (index: number, field: string, value: string | number) => void;
  onAddMaterial: () => void;
  onRemoveMaterial: (index: number) => void;
  onUpdateTransport: (index: number, field: string, value: string | number) => void;
  onAddTransport: () => void;
  onRemoveTransport: (index: number) => void;
  onUpdateEnergy: (index: number, field: string, value: string | number) => void;
  onAddEnergy: () => void;
  onRemoveEnergy: (index: number) => void;
  onCalculate: () => void;
  onPrevTab: () => void;
  onNextTab: () => void;
}

const CalculatorTabs = ({
  isMobile,
  activeTab,
  setActiveTab,
  calculationInput,
  calculationResult,
  onUpdateMaterial,
  onAddMaterial,
  onRemoveMaterial,
  onUpdateTransport,
  onAddTransport,
  onRemoveTransport,
  onUpdateEnergy,
  onAddEnergy,
  onRemoveEnergy,
  onCalculate,
  onPrevTab,
  onNextTab
}: CalculatorTabsProps) => {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2 md:pb-6">
        <div className="flex items-center gap-2 md:gap-3">
          <Calculator className="h-5 w-5 md:h-6 md:w-6 text-carbon-600 dark:text-carbon-400" />
          <CardTitle className="text-lg md:text-2xl text-foreground">Project Carbon Calculator</CardTitle>
        </div>
        <CardDescription className="text-xs md:text-sm mt-1 text-muted-foreground">
          Enter the details of your construction project to calculate its carbon footprint.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-4 md:pt-0 md:pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid ${isMobile ? 'grid-cols-2 gap-1 mb-4' : 'grid-cols-4 mb-6'} w-full bg-muted`}>
            {isMobile ? (
              <>
                <div className="col-span-2 flex space-x-1">
                  <TabsTrigger 
                    value="materials" 
                    className="flex-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-xs md:text-sm py-1.5 text-foreground"
                  >
                    Materials
                  </TabsTrigger>
                  <TabsTrigger 
                    value="transport" 
                    className="flex-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-xs md:text-sm py-1.5 text-foreground"
                  >
                    Transport
                  </TabsTrigger>
                </div>
                <div className="col-span-2 flex space-x-1 mt-1">
                  <TabsTrigger 
                    value="energy" 
                    className="flex-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-xs md:text-sm py-1.5 text-foreground"
                  >
                    Energy
                  </TabsTrigger>
                  <TabsTrigger 
                    value="results" 
                    className="flex-1 data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-xs md:text-sm py-1.5 text-foreground"
                  >
                    Results
                  </TabsTrigger>
                </div>
              </>
            ) : (
              <>
                <TabsTrigger 
                  value="materials" 
                  className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-foreground"
                >
                  Materials
                </TabsTrigger>
                <TabsTrigger 
                  value="transport" 
                  className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-foreground"
                >
                  Transport
                </TabsTrigger>
                <TabsTrigger 
                  value="energy" 
                  className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-foreground"
                >
                  Energy
                </TabsTrigger>
                <TabsTrigger 
                  value="results" 
                  className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white text-foreground"
                >
                  Results
                </TabsTrigger>
              </>
            )}
          </TabsList>
          
          <TabsContent value="materials">
            <MaterialsInputSection 
              materials={calculationInput.materials}
              onUpdateMaterial={onUpdateMaterial}
              onAddMaterial={onAddMaterial}
              onRemoveMaterial={onRemoveMaterial}
              onNext={onNextTab}
            />
          </TabsContent>
          
          <TabsContent value="transport">
            <TransportInputSection 
              transportItems={calculationInput.transport}
              onUpdateTransport={onUpdateTransport}
              onAddTransport={onAddTransport}
              onRemoveTransport={onRemoveTransport}
              onNext={onNextTab}
              onPrev={onPrevTab}
            />
          </TabsContent>
          
          <TabsContent value="energy">
            <EnergyInputSection 
              energyItems={calculationInput.energy}
              onUpdateEnergy={onUpdateEnergy}
              onAddEnergy={onAddEnergy}
              onRemoveEnergy={onRemoveEnergy}
              onCalculate={onNextTab}
              onPrev={onPrevTab}
            />
          </TabsContent>
          
          <TabsContent value="results">
            <ResultsSection 
              calculationResult={calculationResult}
              materials={calculationInput.materials}
              transport={calculationInput.transport}
              energy={calculationInput.energy}
              onCalculate={onCalculate}
              onPrev={onPrevTab}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CalculatorTabs;
