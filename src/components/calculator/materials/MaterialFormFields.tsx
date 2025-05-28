
import React, { useMemo, useEffect } from "react";
import { MaterialInput } from "@/lib/carbonExports";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle } from "lucide-react";
import { MATERIAL_FACTORS } from "@/lib/carbonData";
import { fetchMaterials } from "@/services/materialService";
import { useState } from "react";

interface MaterialFormFieldsProps {
  material: MaterialInput;
  index: number;
  error?: string;
  onRemove: () => void;
  onUpdate: (field: keyof MaterialInput, value: any) => void;
}

const MaterialFormFields: React.FC<MaterialFormFieldsProps> = ({
  material,
  index,
  error,
  onRemove,
  onUpdate
}) => {
  const [databaseMaterials, setDatabaseMaterials] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load materials from database on component mount
  useEffect(() => {
    const loadMaterials = async () => {
      setIsLoading(true);
      try {
        const materials = await fetchMaterials(false);
        console.log(`MaterialFormFields: Loaded ${materials.length} materials from database`);
        setDatabaseMaterials(materials || []);
      } catch (err) {
        console.warn("Failed to fetch materials in MaterialFormFields:", err);
        setDatabaseMaterials([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadMaterials();
  }, []);

  // Generate material options dynamically from MATERIAL_FACTORS and database materials
  const materialOptions = useMemo(() => {
    try {
      // Start with default options from carbon factors
      const baseOptions = Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
        value: key,
        label: value.name || key,
        source: 'factors'
      }));
      
      // Add options from database materials
      const dbOptions = databaseMaterials.map(mat => ({
        value: `db-${mat.id}`,
        label: mat.name || mat.material || "Unknown Material",
        source: 'database'
      }));
      
      // Combine all options
      const allOptions = [...baseOptions, ...dbOptions];
      
      // Remove duplicates based on label (case insensitive)
      const uniqueOptions = allOptions.filter((option, index, arr) => 
        arr.findIndex(opt => opt.label.toLowerCase() === option.label.toLowerCase()) === index
      );
      
      console.log(`MaterialFormFields: Generated ${uniqueOptions.length} material options (${baseOptions.length} from factors, ${dbOptions.length} from database)`);
      
      // Ensure we have at least the default options if nothing else loaded
      if (uniqueOptions.length === 0) {
        console.warn("No material options found, using fallback options");
        return [
          { value: "concrete", label: "Concrete", source: 'fallback' },
          { value: "steel", label: "Steel", source: 'fallback' },
          { value: "timber", label: "Timber", source: 'fallback' },
          { value: "glass", label: "Glass", source: 'fallback' },
          { value: "brick", label: "Brick", source: 'fallback' },
          { value: "insulation", label: "Insulation", source: 'fallback' }
        ];
      }
      
      // Sort by label for better UX
      return uniqueOptions.sort((a, b) => a.label.localeCompare(b.label));
    } catch (err) {
      console.error("Error generating material options:", err);
      // Return fallback options
      return [
        { value: "concrete", label: "Concrete", source: 'fallback' },
        { value: "steel", label: "Steel", source: 'fallback' },
        { value: "timber", label: "Timber", source: 'fallback' },
        { value: "glass", label: "Glass", source: 'fallback' },
        { value: "brick", label: "Brick", source: 'fallback' },
        { value: "insulation", label: "Insulation", source: 'fallback' }
      ];
    }
  }, [databaseMaterials]);

  const handleMaterialChange = (value: string) => {
    console.log(`Material selection changed to: ${value}`);
    onUpdate("type", value);
    
    // Also update the name field to match the selection
    const selectedOption = materialOptions.find(opt => opt.value === value);
    if (selectedOption) {
      onUpdate("name", selectedOption.label);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-3 items-end border border-gray-200 dark:border-green-600 p-3 md:p-4 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={`material-type-${index}`}>Material Type</Label>
          <Select
            value={material.type}
            onValueChange={handleMaterialChange}
            disabled={isLoading}
          >
            <SelectTrigger id={`material-type-${index}`} className="dark:border-green-600">
              <SelectValue placeholder={isLoading ? "Loading materials..." : "Select material"} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px] overflow-y-auto dark:border-green-600 dark:bg-gray-800">
              {materialOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                  {option.source === 'database' && <span className="text-xs text-green-600 ml-2">(DB)</span>}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {isLoading && (
            <p className="text-xs text-muted-foreground">Loading materials from database...</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor={`material-quantity-${index}`}>
            Quantity (kg)
            {error && (
              <span className="text-red-500 text-xs ml-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> {error}
              </span>
            )}
          </Label>
          <Input
            id={`material-quantity-${index}`}
            type="number"
            value={material.quantity || ""}
            onChange={(e) => onUpdate("quantity", e.target.value)}
            placeholder="Enter quantity in kg"
            className={`dark:border-green-600 ${error ? "border-red-500" : ""}`}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button 
          type="button"
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="text-xs dark:border-green-600"
        >
          Remove
        </Button>
      </div>
    </div>
  );
}

export default MaterialFormFields;
