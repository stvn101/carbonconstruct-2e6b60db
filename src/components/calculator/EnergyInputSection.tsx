
import { Zap, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Energy, EnergyInput, ENERGY_FACTORS } from "@/lib/carbonCalculations";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

// Define the maximum energy amount allowed per NCC 2025 regulations
const MAX_ENERGY_AMOUNT = 10000; // 10,000 kWh

interface EnergyInputSectionProps {
  energyItems: EnergyInput[];
  onUpdateEnergy: (index: number, field: keyof EnergyInput, value: string | number) => void;
  onAddEnergy: () => void;
  onRemoveEnergy: (index: number) => void;
  onCalculate: () => void;
  onPrev: () => void;
}

const EnergyInputSection = ({
  energyItems,
  onUpdateEnergy,
  onAddEnergy,
  onRemoveEnergy,
  onCalculate,
  onPrev
}: EnergyInputSectionProps) => {
  const isMobile = useIsMobile();
  
  const [errors, setErrors] = useState<Record<number, string>>({});
  
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };
  
  const handleAmountChange = (index: number, value: string) => {
    const numValue = Number(value);
    
    if (value === "") {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
      onUpdateEnergy(index, "amount", "");
      return;
    }
    
    if (!isNaN(numValue)) {
      if (numValue < 0) {
        setErrors(prev => ({ ...prev, [index]: "Amount cannot be negative" }));
        onUpdateEnergy(index, "amount", numValue);
      } else if (numValue > MAX_ENERGY_AMOUNT) {
        // Maximum value error
        setErrors(prev => ({ 
          ...prev, 
          [index]: `Maximum amount is ${MAX_ENERGY_AMOUNT.toLocaleString()} ${ENERGY_FACTORS[energyItems[index].type].unit}` 
        }));
        onUpdateEnergy(index, "amount", numValue);
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[index];
          return newErrors;
        });
        onUpdateEnergy(index, "amount", numValue);
      }
    }
  };
  
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-md md:text-lg font-medium flex items-center gap-2">
        <Zap className="h-4 w-4 md:h-5 md:w-5 text-carbon-600" />
        <span>Enter Energy Consumption</span>
      </div>
      
      {energyItems.map((energy, index) => (
        <div key={`energy-${index}`} className="grid grid-cols-1 gap-3 items-end border border-carbon-100 p-3 md:p-4 rounded-lg">
          <div className="w-full">
            <Label htmlFor={`energy-type-${index}`} className="text-xs md:text-sm">Energy Type</Label>
            <Select
              value={energy.type}
              onValueChange={(value) => onUpdateEnergy(index, "type", value)}
            >
              <SelectTrigger id={`energy-type-${index}`} className="mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm">
                <SelectValue placeholder="Select energy type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ENERGY_FACTORS).map(([key, value]) => (
                  <SelectItem key={key} value={key} className="text-xs md:text-sm">{value.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full">
            <div className="flex items-center space-x-1">
              <Label htmlFor={`energy-amount-${index}`} className="text-xs md:text-sm">
                Amount ({ENERGY_FACTORS[energy.type].unit})
              </Label>
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
                <TooltipContent side="top" className="max-w-xs">
                  The unit "{ENERGY_FACTORS[energy.type].unit}" represents the measurement unit used for this energy type.
                </TooltipContent>
              </Tooltip>
            </div>
            <Input
              id={`energy-amount-${index}`}
              type="number"
              value={energy.amount === 0 ? '' : energy.amount}
              onChange={(e) => handleAmountChange(index, e.target.value)}
              min={0}
              max={MAX_ENERGY_AMOUNT}
              onFocus={handleFocus}
              className={`mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm ${errors[index] ? 'border-destructive' : ''}`}
              aria-invalid={errors[index] ? "true" : "false"}
              aria-describedby={errors[index] ? `energy-amount-error-${index}` : undefined}
            />
            {errors[index] && (
              <p id={`energy-amount-error-${index}`} className="mt-1 text-xs text-destructive">
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
              onClick={() => onRemoveEnergy(index)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      
      <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:justify-between">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            type="button" 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={onPrev} 
            className="hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300 text-xs md:text-sm"
          >
            Previous
          </Button>
          <Button 
            type="button" 
            size={isMobile ? "sm" : "default"}
            onClick={onAddEnergy} 
            className="bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm"
          >
            Add Energy
          </Button>
        </div>
        <Button 
          type="button" 
          size={isMobile ? "sm" : "default"}
          onClick={onCalculate} 
          className="bg-carbon-600 hover:bg-carbon-700 text-white mt-2 sm:mt-0 text-xs md:text-sm"
        >
          Calculate Results
        </Button>
      </div>
    </div>
  );
};

export default EnergyInputSection;
