
import React from 'react';
import { AlertCircle, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MaterialInput, MATERIAL_FACTORS } from "@/lib/carbonCalculations";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const getInputValidationClass = () => {
    if (error) return 'input-invalid';
    if (material.quantity) return 'input-valid';
    return '';
  };

  return (
    <div className="grid grid-cols-1 gap-3 items-end border border-carbon-100 p-3 md:p-4 rounded-lg">
      <div className="w-full">
        <Label htmlFor={`material-type-${index}`} className="text-xs md:text-sm">Material Type</Label>
        <Select
          value={material.type}
          onValueChange={(value) => onUpdate("type", value)}
        >
          <SelectTrigger 
            id={`material-type-${index}`} 
            className="mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm"
          >
            <SelectValue placeholder="Select material" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(MATERIAL_FACTORS).map(([key, value]) => (
              <SelectItem key={key} value={key} className="text-xs md:text-sm">
                {value.name}
              </SelectItem>
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
          onChange={(e) => onUpdate("quantity", e.target.value)}
          onFocus={handleFocus}
          className={`mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm ${getInputValidationClass()}`}
          aria-invalid={!!error}
          aria-describedby={error ? `material-quantity-error-${index}` : undefined}
        />
        {error ? (
          <div className="validation-message error" id={`material-quantity-error-${index}`}>
            <AlertCircle className="h-3 w-3" />
            <span>{error}</span>
          </div>
        ) : material.quantity ? (
          <div className="validation-message success">
            <CheckCircle className="h-3 w-3" />
            <span>Valid quantity entered</span>
          </div>
        ) : null}
      </div>
      
      <div className="w-full flex justify-end">
        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="w-full sm:w-auto hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300 text-xs md:text-sm"
          type="button"
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default MaterialFormFields;
