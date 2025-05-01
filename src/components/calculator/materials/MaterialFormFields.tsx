
import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MaterialInput, MATERIAL_FACTORS } from "@/lib/carbonCalculations";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetchMaterials } from "@/services/materialService";
import { ExtendedMaterialData } from "@/lib/materials/materialTypes";

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
  const [materials, setMaterials] = useState<ExtendedMaterialData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadMaterials = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const fetchedMaterials = await fetchMaterials();
        setMaterials(fetchedMaterials);
      } catch (err) {
        console.error("Failed to load materials:", err);
        setLoadError("Failed to load materials. Using defaults.");
        // If error, use fallback static materials
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMaterials();
  }, []);
  
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const getInputValidationClass = () => {
    if (error) return 'input-invalid';
    if (material.quantity) return 'input-valid';
    return '';
  };
  
  // Get the current material unit
  const getMaterialUnit = () => {
    // First try to find in dynamic materials
    const dynamicMaterial = materials.find(m => m.name.toLowerCase() === material.type.toLowerCase());
    if (dynamicMaterial) {
      return dynamicMaterial.unit || 'kg';
    }
    // Fall back to static materials
    return MATERIAL_FACTORS[material.type]?.unit || 'kg';
  };

  return (
    <div className="grid grid-cols-1 gap-3 items-end border border-carbon-100 p-3 md:p-4 rounded-lg">
      <div className="w-full">
        <Label htmlFor={`material-type-${index}`} className="text-xs md:text-sm">Material Type</Label>
        <Select
          value={material.type}
          onValueChange={(value) => onUpdate("type", value)}
          name={`material-type-select-${index}`}
        >
          <SelectTrigger 
            id={`material-type-${index}`}
            name={`material-type-${index}`}
            className="mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm"
            aria-label="Select material type"
          >
            <SelectValue placeholder={
              isLoading 
                ? "Loading materials..." 
                : loadError 
                  ? "Select material (using fallback data)" 
                  : "Select material"
            } />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800">
            {isLoading ? (
              <div className="px-2 py-4 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">Loading materials...</span>
              </div>
            ) : materials && materials.length > 0 ? (
              // Show database materials if available
              materials.map((material, i) => (
                <SelectItem key={`db-${i}`} value={material.name} className="text-xs md:text-sm">
                  {material.name}
                </SelectItem>
              ))
            ) : (
              // Fallback to static materials
              Object.entries(MATERIAL_FACTORS).map(([key, value]) => (
                <SelectItem key={key} value={key} className="text-xs md:text-sm">
                  {value.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        {loadError && (
          <div className="text-xs text-amber-600 mt-1 flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            {loadError}
          </div>
        )}
      </div>
      
      <div className="w-full">
        <Label htmlFor={`material-quantity-${index}`} className="text-xs md:text-sm">
          Quantity ({getMaterialUnit()})
        </Label>
        <Input
          id={`material-quantity-${index}`}
          name={`material-quantity-${index}`}
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
          aria-label={`Remove material ${index + 1}`}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default MaterialFormFields;
