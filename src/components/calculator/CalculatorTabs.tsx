
import { Calculator } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList } from "@/components/ui/tabs";
import { useCalculator } from "@/contexts/CalculatorContext";
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
  // Wrap in a try-catch without using context directly in the component body
  const renderContent = () => {
    try {
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
      } = useCalculator();
      
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
    } catch (error) {
      console.error("Error in CalculatorTabs:", error);
      // Fallback UI in case the context is not available
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
  };

  // Render once without additional try-catch
  return renderContent();
};

export default CalculatorTabs;
