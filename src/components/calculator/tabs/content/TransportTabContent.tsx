
import { TabsContent } from "@/components/ui/tabs";
import TransportInputSection from "../../TransportInputSection";
import { TransportInput } from "@/lib/carbonCalculations";

interface TransportTabContentProps {
  transportItems: TransportInput[];
  onUpdateTransport: (index: number, field: string, value: string | number) => void;
  onAddTransport: () => void;
  onRemoveTransport: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
  demoMode?: boolean;
}

const TransportTabContent = ({
  transportItems,
  onUpdateTransport,
  onAddTransport,
  onRemoveTransport,
  onNext,
  onPrev,
  demoMode = false
}: TransportTabContentProps) => {
  return (
    <TabsContent value="transport">
      <TransportInputSection 
        transportItems={transportItems}
        onUpdateTransport={onUpdateTransport}
        onAddTransport={onAddTransport}
        onRemoveTransport={onRemoveTransport}
        onNext={onNext}
        onPrev={onPrev}
        demoMode={demoMode}
      />
    </TabsContent>
  );
};

export default TransportTabContent;
