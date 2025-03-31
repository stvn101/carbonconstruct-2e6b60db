
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Energy, EnergyInput, ENERGY_FACTORS } from "@/lib/carbonCalculations";
import { useIsMobile } from "@/hooks/use-mobile";

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
            <Label htmlFor={`energy-amount-${index}`} className="text-xs md:text-sm">
              Amount ({ENERGY_FACTORS[energy.type].unit})
            </Label>
            <Input
              id={`energy-amount-${index}`}
              type="number"
              value={energy.amount}
              onChange={(e) => onUpdateEnergy(index, "amount", e.target.value)}
              min={0}
              className="mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm"
            />
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
