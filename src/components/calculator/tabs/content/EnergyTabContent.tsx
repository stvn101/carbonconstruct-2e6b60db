
import { TabsContent } from "@/components/ui/tabs";
import EnergyInputSection from "../../EnergyInputSection";
import { EnergyInput } from "@/lib/carbonCalculations";

interface EnergyTabContentProps {
  energyItems: EnergyInput[];
  onUpdateEnergy: (index: number, field: string, value: string | number) => void;
  onAddEnergy: () => void;
  onRemoveEnergy: (index: number) => void;
  onCalculate: () => void;
  onPrev: () => void;
  demoMode?: boolean;
}

const EnergyTabContent = ({
  energyItems,
  onUpdateEnergy,
  onAddEnergy,
  onRemoveEnergy,
  onCalculate,
  onPrev,
  demoMode = false
}: EnergyTabContentProps) => {
  return (
    <TabsContent value="energy">
      <EnergyInputSection 
        energyItems={energyItems}
        onUpdateEnergy={onUpdateEnergy}
        onAddEnergy={onAddEnergy}
        onRemoveEnergy={onRemoveEnergy}
        onCalculate={onCalculate}
        onPrev={onPrev}
        demoMode={demoMode}
      />
    </TabsContent>
  );
};

export default EnergyTabContent;
