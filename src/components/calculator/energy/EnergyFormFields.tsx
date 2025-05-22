
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { EnergyInput } from "@/lib/carbonExports";
import { ENERGY_FACTORS } from "@/lib/carbonData";
import { EnergyFactorKey } from "@/lib/carbonData";

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
  const energyTypes = Object.keys(ENERGY_FACTORS);
  
  return (
    <div className={`grid grid-cols-1 gap-3 items-end border p-3 md:p-4 rounded-lg ${error ? "border-destructive bg-destructive/10" : "border-border"}`}>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-3">
          <div>
            <label htmlFor={`energy-type-${index}`} className="block text-sm font-medium mb-1 text-foreground">
              Energy Type
            </label>
            <Select
              value={energy.type}
              onValueChange={(value) => onUpdate("type", value)}
            >
              <SelectTrigger id={`energy-type-${index}`} className="w-full">
                <SelectValue placeholder="Select energy type" />
              </SelectTrigger>
              <SelectContent>
                {energyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {ENERGY_FACTORS[type as EnergyFactorKey]?.name || type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor={`energy-amount-${index}`} className="block text-sm font-medium mb-1 text-foreground">
              Amount (kWh)
            </label>
            <Input
              id={`energy-amount-${index}`}
              type="number"
              min="0"
              max="10000"
              value={energy.amount || ""}
              onChange={(e) => onUpdate("amount", e.target.value)}
              className={error ? "border-destructive bg-destructive/5" : ""}
              aria-invalid={error ? "true" : "false"}
              aria-describedby={error ? `energy-error-${index}` : undefined}
            />
            {error && (
              <p id={`energy-error-${index}`} className="mt-1 text-xs text-destructive">
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
            className="h-9 w-9 min-h-[36px] min-w-[36px]"
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
