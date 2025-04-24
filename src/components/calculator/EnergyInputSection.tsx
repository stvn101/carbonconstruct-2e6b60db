
import React, { useState } from "react";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EnergyInput } from "@/lib/carbonCalculations";
import { useIsMobile } from "@/hooks/use-mobile";
import EnergyFormFields from "./energy/EnergyFormFields";

const MAX_ENERGY_AMOUNT = 10000;

interface EnergyInputSectionProps {
  energyItems: EnergyInput[];
  onUpdateEnergy: (index: number, field: keyof EnergyInput, value: string | number) => void;
  onAddEnergy: () => void;
  onRemoveEnergy: (index: number) => void;
  onCalculate: () => void;
  onPrev: () => void;
  demoMode?: boolean;
}

const EnergyInputSection = ({
  energyItems,
  onUpdateEnergy,
  onAddEnergy,
  onRemoveEnergy,
  onCalculate,
  onPrev,
  demoMode = false
}: EnergyInputSectionProps) => {
  const isMobile = useIsMobile().isMobile;
  const [errors, setErrors] = useState<Record<number, string>>({});

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
        setErrors(prev => ({ 
          ...prev, 
          [index]: `Maximum amount is ${MAX_ENERGY_AMOUNT.toLocaleString()} units` 
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

  const handlePrevButtonClick = () => {
    console.log("Energy: Previous button clicked");
    if (typeof onPrev === 'function') {
      onPrev();
    }
  };
  
  const handleCalculateButtonClick = () => {
    console.log("Energy: Calculate button clicked");
    if (typeof onCalculate === 'function') {
      onCalculate();
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-md md:text-lg font-medium flex items-center gap-2">
        <Zap className="h-4 w-4 md:h-5 md:w-5 text-carbon-600" />
        <span>Enter Energy Consumption</span>
        {demoMode && (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Demo Mode</span>
        )}
      </div>
      
      {energyItems.map((energy, index) => (
        <EnergyFormFields
          key={`energy-${index}`}
          energy={energy}
          index={index}
          error={errors[index]}
          onRemove={() => onRemoveEnergy(index)}
          onUpdate={(field, value) => {
            if (field === "amount") {
              handleAmountChange(index, String(value));
            } else {
              onUpdateEnergy(index, field, value);
            }
          }}
        />
      ))}
      
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button 
            type="button" 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={handlePrevButtonClick} 
            className="w-full sm:w-auto hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300 text-xs md:text-sm"
          >
            Previous
          </Button>
          <Button 
            type="button" 
            size={isMobile ? "sm" : "default"}
            onClick={onAddEnergy} 
            className="w-full sm:w-auto bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm mt-2 sm:mt-0"
          >
            Add Energy
          </Button>
        </div>
        <Button 
          type="button" 
          size={isMobile ? "sm" : "default"}
          onClick={handleCalculateButtonClick} 
          className="w-full sm:w-auto bg-carbon-600 hover:bg-carbon-700 text-white mt-2 sm:mt-0 text-xs md:text-sm"
        >
          Calculate Results
        </Button>
      </div>
    </div>
  );
};

export default EnergyInputSection;
