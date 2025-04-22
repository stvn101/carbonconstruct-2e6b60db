
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { useCalculator } from "@/contexts/calculator";
import { useIsMobile } from "@/hooks/use-mobile";
import CalculatorTabTriggers from "./tabs/CalculatorTabTriggers";
import CalculatorTabContents from "./tabs/CalculatorTabContents";

interface CalculatorTabsProps {
  isMobile: boolean;
  activeTab: string;
  setActiveTab: (value: string) => void;
  onCalculate: () => void;
}

const CalculatorTabs = ({
  isMobile,
  activeTab,
  setActiveTab,
  onCalculate
}: CalculatorTabsProps) => {
  let calculatorContext;
  
  try {
    calculatorContext = useCalculator();
  } catch (error) {
    console.error("Error accessing calculator context:", error);
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-6">
          <CardTitle>Calculator Error</CardTitle>
          <CardDescription>
            There was an error loading the calculator. Please try refreshing the page.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const {
    calculationInput,
    calculationResult,
    handleAddMaterial,
    handleUpdateMaterial,
    handleRemoveMaterial,
    handleAddTransport,
    handleUpdateTransport,
    handleRemoveTransport,
    handleAddEnergy,
    handleUpdateEnergy,
    handleRemoveEnergy,
    handleNextTab,
    handlePrevTab
  } = calculatorContext;
      
  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-2 pb-4 md:pt-0 md:pb-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid ${isMobile ? 'grid-cols-2 gap-1 mb-4' : 'grid-cols-4 mb-6'} w-full bg-muted`}>
            <CalculatorTabTriggers isMobile={isMobile} />
          </TabsList>
          
          <CalculatorTabContents 
            calculationInput={calculationInput}
            calculationResult={calculationResult}
            onUpdateMaterial={handleUpdateMaterial}
            onAddMaterial={handleAddMaterial}
            onRemoveMaterial={handleRemoveMaterial}
            onUpdateTransport={handleUpdateTransport}
            onAddTransport={handleAddTransport}
            onRemoveTransport={handleRemoveTransport}
            onUpdateEnergy={handleUpdateEnergy}
            onAddEnergy={handleAddEnergy}
            onRemoveEnergy={handleRemoveEnergy}
            onCalculate={onCalculate}
            onPrevTab={handlePrevTab}
            onNextTab={handleNextTab}
          />
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CalculatorTabs;
