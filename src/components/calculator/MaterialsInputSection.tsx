
import React, { useState, useEffect } from "react";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MaterialInput } from "@/lib/carbonExports";
import { useIsMobile } from "@/hooks/use-mobile";
import { SkeletonContent } from "@/components/ui/skeleton-content";
import MaterialFormFields from "./materials/MaterialFormFields";
import { fetchMaterials } from "@/services/materialService";

const MAX_QUANTITY = 10000;

interface MaterialsInputSectionProps {
  materials: MaterialInput[];
  onUpdateMaterial: (index: number, field: keyof MaterialInput, value: string | number) => void;
  onAddMaterial: () => void;
  onRemoveMaterial: (index: number) => void;
  onNext: () => void;
  demoMode?: boolean;
}

const MaterialsInputSection = ({
  materials,
  onUpdateMaterial,
  onAddMaterial,
  onRemoveMaterial,
  onNext,
  demoMode = false
}: MaterialsInputSectionProps) => {
  const isMobile = useIsMobile().isMobile;
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [materialsCacheReady, setMaterialsCacheReady] = useState(false);
  
  // Ensure materials data is loaded and cached
  useEffect(() => {
    const loadMaterialsCache = async () => {
      try {
        console.log("MaterialsInputSection: Preloading materials cache");
        const materials = await fetchMaterials(false);
        console.log(`MaterialsInputSection: Successfully cached ${materials.length} materials`);
        setMaterialsCacheReady(true);
      } catch (error) {
        console.error("MaterialsInputSection: Failed to cache materials", error);
        // Even if caching fails, we should still allow the form to work
        setMaterialsCacheReady(true);
      } finally {
        // Simulate loading for better UX
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      }
    };

    loadMaterialsCache();
  }, []);

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

  const handleNextButtonClick = () => {
    console.log("Materials: Next button clicked, materials count:", materials.length);
    if (typeof onNext === 'function') {
      onNext();
    }
  };

  const handleAddMaterialClick = () => {
    console.log("Adding new material, current count:", materials.length);
    onAddMaterial();
  };

  if (isLoading || !materialsCacheReady) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="text-md md:text-lg font-medium flex items-center gap-2">
          <Leaf className="h-4 w-4 md:h-5 md:w-5 text-carbon-600" />
          <span>Loading Construction Materials...</span>
        </div>
        {[1, 2].map((index) => (
          <div key={`skeleton-${index}`} className="grid grid-cols-1 gap-3 items-end border border-carbon-100 dark:border-green-600 p-3 md:p-4 rounded-lg">
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
        {demoMode && (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Demo Mode</span>
        )}
      </div>
      
      {materials.length === 0 && (
        <div className="text-center py-4 text-muted-foreground">
          <p>No materials added yet. Click "Add Material" to get started.</p>
        </div>
      )}
      
      {materials.map((material, index) => (
        <MaterialFormFields
          key={`material-${index}`}
          material={material}
          index={index}
          error={errors[index]}
          onRemove={() => onRemoveMaterial(index)}
          onUpdate={(field, value) => {
            console.log(`Updating material ${index}, field ${String(field)}, value:`, value);
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
          onClick={handleAddMaterialClick} 
          className="w-full sm:w-auto bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm dark:border-green-600"
        >
          Add Material
        </Button>
        <Button 
          type="button" 
          size={isMobile ? "sm" : "default"}
          onClick={handleNextButtonClick}
          className="w-full sm:w-auto bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm dark:border-green-600"
          disabled={materials.length === 0}
        >
          Next: Transport
        </Button>
      </div>
    </div>
  );
};

export default MaterialsInputSection;
