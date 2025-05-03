
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaterialInput, MATERIAL_FACTORS, Material } from "@/lib/carbonExports";

interface MaterialFormFieldsProps {
  material: MaterialInput;
  index: number;
  error?: string;
  onRemove: () => void;
  onUpdate: (field: keyof MaterialInput, value: string | number) => void;
}

const MaterialFormFields: React.FC<MaterialFormFieldsProps> = ({
  material,
  index,
  error,
  onRemove,
  onUpdate
}) => {
  const materialTypes = Object.keys(MATERIAL_FACTORS) as Material[];
  
  const getUnitLabel = (materialType: Material) => {
    if (!materialType) return "kg";
    
    const factor = MATERIAL_FACTORS[materialType];
    if (!factor) return "kg";
    
    return factor.unit || "kg";
  };
  
  return (
    <div className={`grid grid-cols-1 gap-3 items-end border p-3 md:p-4 rounded-lg ${error ? "border-red-300 bg-red-50" : "border-carbon-100"}`}>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-3">
          <div>
            <label htmlFor={`material-type-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              Material Type
            </label>
            <Select
              value={material.type}
              onValueChange={(value) => onUpdate("type", value as Material)}
            >
              <SelectTrigger id={`material-type-${index}`}>
                <SelectValue placeholder="Select material type" />
              </SelectTrigger>
              <SelectContent>
                {materialTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {MATERIAL_FACTORS[type]?.name || type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor={`material-quantity-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              {`Quantity (${getUnitLabel(material.type)})`}
            </label>
            <Input
              id={`material-quantity-${index}`}
              type="number"
              min="0"
              max="10000"
              value={material.quantity}
              onChange={(e) => onUpdate("quantity", e.target.value)}
              className={error ? "border-red-300 bg-red-50" : ""}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? `material-error-${index}` : undefined}
            />
            {error && (
              <p id={`material-error-${index}`} className="mt-1 text-xs text-red-600">
                {error}
              </p>
            )}
          </div>
        </div>
        
        <div className="self-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-9 w-9"
            aria-label="Remove material"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MaterialFormFields;
