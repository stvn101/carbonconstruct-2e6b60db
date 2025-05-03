import { TabsContent } from "@/components/ui/tabs";
import ResultsSection from "../../ResultsSection";
import { CalculationResult, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonExports";

interface ResultsTabContentProps {
  calculationResult: CalculationResult | null;
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
  onCalculate: () => void;
  onPrev: () => void;
  demoMode?: boolean;
}

const ResultsTabContent = ({
  calculationResult,
  materials,
  transport,
  energy,
  onCalculate,
  onPrev,
  demoMode = false
}: ResultsTabContentProps) => {
  return (
    <TabsContent value="results">
      <ResultsSection 
        calculationResult={calculationResult}
        materials={materials}
        transport={transport}
        energy={energy}
        onCalculate={onCalculate}
        onPrev={onPrev}
        demoMode={demoMode}
      />
    </TabsContent>
  );
};

export default ResultsTabContent;
