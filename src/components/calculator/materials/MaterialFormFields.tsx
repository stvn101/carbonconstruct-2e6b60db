
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
  
  useEffect(() => {
    setIsLoading(true);
    fetchMaterials(false)
      .then(materials => {
        setDatabaseMaterials(materials || []);
        setIsLoading(false);
      })
      .catch(err => {
        console.warn("Background material fetch failed in MaterialFormFields:", err);
        setIsLoading(false);
      });
  }, []);

  // Generate material options dynamically from MATERIAL_FACTORS and database materials
  const materialOptions = useMemo(() => {
    try {
      const baseOptions = Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
        value: key,
        label: value.name || key
      }));
      
      // Add options from database materials
      const dbOptions = databaseMaterials.map(mat => ({
        value: `db-${mat.id}`,
        label: mat.name
      }));
      
      // Combine and remove duplicates
      const combinedOptions = [...baseOptions];
      
      // Add DB materials that don't already exist by name
      const existingLabels = new Set(baseOptions.map(opt => opt.label.toLowerCase()));
      
      dbOptions.forEach(option => {
        if (!existingLabels.has(option.label.toLowerCase())) {
          combinedOptions.push(option);
          existingLabels.add(option.label.toLowerCase());
        }
      });
      
      // Ensure we have at least the default options
      if (combinedOptions.length === 0) {
        console.warn("No material options found");
        return [
          { value: "concrete", label: "Concrete" },
          { value: "steel", label: "Steel" },
          { value: "timber", label: "Timber" },
          { value: "glass", label: "Glass" },
          { value: "brick", label: "Brick" },
          { value: "insulation", label: "Insulation" }
        ];
      }
      
      // Sort by label
      return combinedOptions.sort((a, b) => a.label.localeCompare(b.label));
    } catch (err) {
      console.error("Error loading material options:", err);
      return [
        { value: "concrete", label: "Concrete" },
        { value: "steel", label: "Steel" },
        { value: "timber", label: "Timber" },
        { value: "glass", label: "Glass" },
        { value: "brick", label: "Brick" },
        { value: "insulation", label: "Insulation" }
      ];
    }
  }, [databaseMaterials]);

  return (
    <div className="grid grid-cols-1 gap-3 items-end border border-gray-200 dark:border-gray-700 p-3 md:p-4 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor={`material-type-${index}`}>Material Type</Label>
          <Select
            value={material.type}
            onValueChange={(value) => onUpdate("type", value)}
            disabled={isLoading}
          >
            <SelectTrigger id={`material-type-${index}`}>
              <SelectValue placeholder={isLoading ? "Loading materials..." : "Select material"} />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {materialOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            className={error ? "border-red-500" : ""}
          />
        </div>
      </div>
      <div className="flex justify-end">
        <Button 
          type="button"
          variant="outline"
          size="sm"
          onClick={onRemove}
          className="text-xs"
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default MaterialFormFields;
