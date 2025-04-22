import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MaterialInput, MATERIAL_FACTORS } from "@/lib/carbonCalculations";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useState, useEffect } from "react";
import { SkeletonContent } from "@/components/ui/skeleton-content";

const MAX_QUANTITY = 10000;

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
  
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };
  
  const handleQuantityChange = (index: number, value: string) => {
    const numValue = Number(value);
    
    if (value === "") {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
      onUpdateMaterial(index, "quantity", "");
      return;
    }
    
    if (!isNaN(numValue)) {
      if (numValue < 0) {
        setErrors(prev => ({ ...prev, [index]: "Quantity cannot be negative" }));
        onUpdateMaterial(index, "quantity", numValue);
      } else if (numValue > MAX_QUANTITY) {
        setErrors(prev => ({ ...prev, [index]: `Maximum quantity is ${MAX_QUANTITY} ${MATERIAL_FACTORS[materials[index].type].unit}` }));
        onUpdateMaterial(index, "quantity", numValue);
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[index];
          return newErrors;
        });
        onUpdateMaterial(index, "quantity", numValue);
      }
    } else {
    }
  };
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="text-md md:text-lg font-medium flex items-center gap-2">
          <Leaf className="h-4 w-4 md:h-5 md:w-5 text-carbon-600" />
          <span>Loading Construction Materials...</span>
        </div>
        
        {[1, 2].map((index) => (
          <div 
            key={`skeleton-${index}`}
            className="grid grid-cols-1 gap-3 items-end border border-carbon-100 p-3 md:p-4 rounded-lg"
          >
            <SkeletonContent lines={2} />
          </div>
        ))}
      </div>
    );
  }
  
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
              onChange={(e) => handleQuantityChange(index, e.target.value)}
              min={0}
              max={MAX_QUANTITY}
              onFocus={handleFocus}
              className={`mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm ${errors[index] ? 'border-destructive' : ''}`}
              aria-invalid={errors[index] ? "true" : "false"}
              aria-describedby={errors[index] ? `material-quantity-error-${index}` : undefined}
            />
            {errors[index] && (
              <p id={`material-quantity-error-${index}`} className="mt-1 text-xs text-destructive">
                {errors[index]}
              </p>
            )}
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
