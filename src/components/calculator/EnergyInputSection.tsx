
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Energy, EnergyInput, ENERGY_FACTORS } from "@/lib/carbonCalculations";

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
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium flex items-center gap-2">
        <Zap className="h-5 w-5 text-carbon-600" />
        <span>Enter Energy Consumption</span>
      </div>
      
      {energyItems.map((energy, index) => (
        <div key={`energy-${index}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border border-carbon-100 p-4 rounded-lg">
          <div className="md:col-span-5">
            <Label htmlFor={`energy-type-${index}`}>Energy Type</Label>
            <Select
              value={energy.type}
              onValueChange={(value) => onUpdateEnergy(index, "type", value)}
            >
              <SelectTrigger id={`energy-type-${index}`} className="border-carbon-200 focus:ring-carbon-500">
                <SelectValue placeholder="Select energy type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ENERGY_FACTORS).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-5">
            <Label htmlFor={`energy-amount-${index}`}>
              Amount ({ENERGY_FACTORS[energy.type].unit})
            </Label>
            <Input
              id={`energy-amount-${index}`}
              type="number"
              value={energy.amount}
              onChange={(e) => onUpdateEnergy(index, "amount", e.target.value)}
              min={0}
              className="border-carbon-200 focus:ring-carbon-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <Button
              variant="outline"
              className="w-full hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300"
              type="button"
              onClick={() => onRemoveEnergy(index)}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
      
      <div className="flex justify-between">
        <div className="space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onPrev} 
            className="hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300"
          >
            Previous
          </Button>
          <Button 
            type="button" 
            onClick={onAddEnergy} 
            className="bg-carbon-600 hover:bg-carbon-700 text-white"
          >
            Add Energy
          </Button>
        </div>
        <Button 
          type="button" 
          onClick={onCalculate} 
          className="bg-carbon-600 hover:bg-carbon-700 text-white"
        >
          Calculate Results
        </Button>
      </div>
    </div>
  );
};

export default EnergyInputSection;
