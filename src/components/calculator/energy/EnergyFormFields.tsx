
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EnergyInput, ENERGY_FACTORS, Energy } from "@/lib/carbonExports";

interface EnergyFormFieldsProps {
  energy: EnergyInput;
  index: number;
  error?: string;
  onRemove: () => void;
  onUpdate: (field: keyof EnergyInput, value: string | number) => void;
}

const EnergyFormFields: React.FC<EnergyFormFieldsProps> = ({
  energy,
  index,
  error,
  onRemove,
  onUpdate
}) => {
  const energyTypes = Object.keys(ENERGY_FACTORS) as Energy[];
  
  return (
    <div className={`grid grid-cols-1 gap-3 items-end border p-3 md:p-4 rounded-lg ${error ? "border-red-300 bg-red-50" : "border-carbon-100"}`}>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-3">
          <div>
            <label htmlFor={`energy-type-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              Energy Type
            </label>
            <Select
              value={energy.type}
              onValueChange={(value) => onUpdate("type", value as Energy)}
            >
              <SelectTrigger id={`energy-type-${index}`}>
                <SelectValue placeholder="Select energy type" />
              </SelectTrigger>
              <SelectContent>
                {energyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {ENERGY_FACTORS[type]?.name || type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor={`energy-amount-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              Amount (kWh)
            </label>
            <Input
              id={`energy-amount-${index}`}
              type="number"
              min="0"
              max="10000"
              value={energy.amount}
              onChange={(e) => onUpdate("amount", e.target.value)}
              className={error ? "border-red-300 bg-red-50" : ""}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? `energy-error-${index}` : undefined}
            />
            {error && (
              <p id={`energy-error-${index}`} className="mt-1 text-xs text-red-600">
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
            aria-label="Remove energy"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnergyFormFields;
