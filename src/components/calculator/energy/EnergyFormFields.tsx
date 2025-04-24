
import React from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { EnergyInput, ENERGY_FACTORS } from "@/lib/carbonCalculations";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();
  
  return (
    <div className="grid grid-cols-1 gap-3 items-end border border-carbon-100 p-3 md:p-4 rounded-lg">
      <div className="w-full">
        <Label htmlFor={`energy-type-${index}`} className="text-xs md:text-sm">Energy Type</Label>
        <Select
          value={energy.type}
          onValueChange={(value) => onUpdate("type", value)}
        >
          <SelectTrigger 
            id={`energy-type-${index}`}
            name={`energy-type-${index}`}
            className="mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm"
          >
            <SelectValue placeholder="Select energy type" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800">
            {Object.entries(ENERGY_FACTORS).map(([key, value]) => (
              <SelectItem key={key} value={key} className="text-xs md:text-sm">
                {value.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full">
        <div className="flex items-center space-x-1">
          <Label htmlFor={`energy-amount-${index}`} className="text-xs md:text-sm">
            Amount ({ENERGY_FACTORS[energy.type].unit})
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`Information about unit ${ENERGY_FACTORS[energy.type].unit}`}
                  className="text-carbon-500 hover:text-carbon-700"
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs bg-white dark:bg-gray-800">
                The unit "{ENERGY_FACTORS[energy.type].unit}" represents the measurement unit used for this energy type.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id={`energy-amount-${index}`}
          name={`energy-amount-${index}`}
          type="number"
          value={energy.amount === 0 ? '' : energy.amount}
          onChange={(e) => onUpdate("amount", e.target.value)}
          className={`mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm ${
            error ? 'border-destructive' : ''
          }`}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `energy-amount-error-${index}` : undefined}
        />
        {error && (
          <p 
            id={`energy-amount-error-${index}`} 
            className="mt-1 text-xs text-destructive flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" /> {error}
          </p>
        )}
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

export default EnergyFormFields;
