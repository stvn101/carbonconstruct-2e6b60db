
import React, { useState, useEffect } from "react";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaterialInput } from "@/lib/carbonCalculations";
import { useIsMobile } from "@/hooks/use-mobile";
import { SkeletonContent } from "@/components/ui/skeleton-content";
import MaterialFormFields from "./materials/MaterialFormFields";

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
        setErrors(prev => ({ ...prev, [index]: `Maximum quantity is ${MAX_QUANTITY} kg` }));
        onUpdateMaterial(index, "quantity", numValue);
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[index];
          return newErrors;
        });
        onUpdateMaterial(index, "quantity", numValue);
      }
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
          <div key={`skeleton-${index}`} className="grid grid-cols-1 gap-3 items-end border border-carbon-100 p-3 md:p-4 rounded-lg">
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
        <MaterialFormFields
          key={`material-${index}`}
          material={material}
          index={index}
          error={errors[index]}
          onRemove={() => onRemoveMaterial(index)}
          onUpdate={(field, value) => {
            if (field === "quantity") {
              handleQuantityChange(index, String(value));
            } else {
              onUpdateMaterial(index, field, value);
            }
          }}
        />
      ))}
      
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
        <Button 
          type="button" 
          size={isMobile ? "sm" : "default"}
          onClick={onAddMaterial} 
          className="w-full sm:w-auto bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm"
        >
          Add Material
        </Button>
        <Button 
          type="button" 
          size={isMobile ? "sm" : "default"}
          onClick={onNext} 
          className="w-full sm:w-auto bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm"
        >
          Next: Transport
        </Button>
      </div>
    </div>
  );
};

export default MaterialsInputSection;
