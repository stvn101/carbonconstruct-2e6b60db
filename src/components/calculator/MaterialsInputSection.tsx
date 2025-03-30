
import { useState } from "react";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Material, MaterialInput, MATERIAL_FACTORS } from "@/lib/carbonCalculations";

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
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium flex items-center gap-2">
        <Leaf className="h-5 w-5 text-carbon-600" />
        <span>Enter Construction Materials</span>
      </div>
      
      {materials.map((material, index) => (
        <div key={`material-${index}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border border-carbon-100 p-4 rounded-lg">
          <div className="md:col-span-5">
            <Label htmlFor={`material-type-${index}`}>Material Type</Label>
            <Select
              value={material.type}
              onValueChange={(value) => onUpdateMaterial(index, "type", value)}
            >
              <SelectTrigger id={`material-type-${index}`} className="border-carbon-200 focus:ring-carbon-500">
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
              onChange={(e) => onUpdateMaterial(index, "quantity", e.target.value)}
              min={0}
              className="border-carbon-200 focus:ring-carbon-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <Button
              variant="outline"
              className="w-full hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300"
              type="button"
              onClick={() => onRemoveMaterial(index)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          onClick={onAddMaterial} 
          className="bg-carbon-600 hover:bg-carbon-700 text-white"
        >
          Add Material
        </Button>
        <Button 
          type="button" 
          onClick={onNext} 
          className="bg-carbon-600 hover:bg-carbon-700 text-white"
        >
          Next: Transport
        </Button>
      </div>
    </div>
  );
};

export default MaterialsInputSection;
