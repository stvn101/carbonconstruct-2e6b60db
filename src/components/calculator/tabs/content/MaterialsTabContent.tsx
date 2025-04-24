
import { TabsContent } from "@/components/ui/tabs";
import MaterialsInputSection from "../../MaterialsInputSection";
import { MaterialInput } from "@/lib/carbonCalculations";

interface MaterialsTabContentProps {
  materials: MaterialInput[];
  onUpdateMaterial: (index: number, field: string, value: string | number) => void;
  onAddMaterial: () => void;
  onRemoveMaterial: (index: number) => void;
  onNext: () => void;
  demoMode?: boolean;
}

const MaterialsTabContent = ({
  materials,
  onUpdateMaterial,
  onAddMaterial,
  onRemoveMaterial,
  onNext,
  demoMode = false
}: MaterialsTabContentProps) => {
  return (
    <TabsContent value="materials">
      <MaterialsInputSection 
        materials={materials}
        onUpdateMaterial={onUpdateMaterial}
        onAddMaterial={onAddMaterial}
        onRemoveMaterial={onRemoveMaterial}
        onNext={onNext}
        demoMode={demoMode}
      />
    </TabsContent>
  );
};

export default MaterialsTabContent;
