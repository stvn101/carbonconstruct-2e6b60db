
import { Calculator } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { CalculationInput, CalculationResult } from "@/lib/carbonCalculations";
import CalculatorTabTriggers from "./tabs/CalculatorTabTriggers";
import CalculatorTabContents from "./tabs/CalculatorTabContents";

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
            <CalculatorTabTriggers isMobile={isMobile} />
          </TabsList>
          
          <CalculatorTabContents 
            calculationInput={calculationInput}
            calculationResult={calculationResult}
            onUpdateMaterial={onUpdateMaterial}
            onAddMaterial={onAddMaterial}
            onRemoveMaterial={onRemoveMaterial}
            onUpdateTransport={onUpdateTransport}
            onAddTransport={onAddTransport}
            onRemoveTransport={onRemoveTransport}
            onUpdateEnergy={onUpdateEnergy}
            onAddEnergy={onAddEnergy}
            onRemoveEnergy={onRemoveEnergy}
            onCalculate={onCalculate}
            onPrevTab={onPrevTab}
            onNextTab={onNextTab}
          />
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CalculatorTabs;
