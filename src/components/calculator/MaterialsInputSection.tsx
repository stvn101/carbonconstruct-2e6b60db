
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Material, MaterialInput, MATERIAL_FACTORS } from "@/lib/carbonCalculations";
import { useIsMobile } from "@/hooks/use-mobile";

interface MaterialsInputSectionProps {
  materials: MaterialInput[];
  onUpdateMaterial: (index: number, field: keyof MaterialInput, value: string | number) => void;
  onAddMaterial: () => void;
  onRemoveMaterial: (index: number) => void;
  onNext: () => void;
}

const MaterialsInputSection = ({
  materials,
  onUpdateMaterial,
  onAddMaterial,
  onRemoveMaterial,
  onNext
}: MaterialsInputSectionProps) => {
  const isMobile = useIsMobile();
  
  // Handle focus to select all text when clicking on input
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };
  
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-md md:text-lg font-medium flex items-center gap-2">
        <Leaf className="h-4 w-4 md:h-5 md:w-5 text-carbon-600" />
        <span>Enter Construction Materials</span>
      </div>
      
      {materials.map((material, index) => (
        <div key={`material-${index}`} className="grid grid-cols-1 gap-3 items-end border border-carbon-100 p-3 md:p-4 rounded-lg">
          <div className="w-full">
            <Label htmlFor={`material-type-${index}`} className="text-xs md:text-sm">Material Type</Label>
            <Select
              value={material.type}
              onValueChange={(value) => onUpdateMaterial(index, "type", value)}
            >
              <SelectTrigger id={`material-type-${index}`} className="mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm">
                <SelectValue placeholder="Select material" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MATERIAL_FACTORS).map(([key, value]) => (
                  <SelectItem key={key} value={key} className="text-xs md:text-sm">{value.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full">
            <Label htmlFor={`material-quantity-${index}`} className="text-xs md:text-sm">
              Quantity ({MATERIAL_FACTORS[material.type].unit})
            </Label>
            <Input
              id={`material-quantity-${index}`}
              type="number"
              value={material.quantity === 0 ? '' : material.quantity}
              onChange={(e) => onUpdateMaterial(index, "quantity", e.target.value === '' ? 0 : e.target.value)}
              min={0}
              onFocus={handleFocus}
              className="mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm"
            />
          </div>
          
          <div className="w-full flex justify-end">
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="w-full sm:w-auto hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300 text-xs md:text-sm"
              type="button"
              onClick={() => onRemoveMaterial(index)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
        <Button 
          type="button" 
          size={isMobile ? "sm" : "default"}
          onClick={onAddMaterial} 
          className="bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm"
        >
          Add Material
        </Button>
        <Button 
          type="button" 
          size={isMobile ? "sm" : "default"}
          onClick={onNext} 
          className="bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm"
        >
          Next: Transport
        </Button>
      </div>
    </div>
  );
};

export default MaterialsInputSection;
