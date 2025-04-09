
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transport, TransportInput, TRANSPORT_FACTORS } from "@/lib/carbonCalculations";
import { useIsMobile } from "@/hooks/use-mobile";

interface TransportInputSectionProps {
  transportItems: TransportInput[];
  onUpdateTransport: (index: number, field: keyof TransportInput, value: string | number) => void;
  onAddTransport: () => void;
  onRemoveTransport: (index: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

const TransportInputSection = ({
  transportItems,
  onUpdateTransport,
  onAddTransport,
  onRemoveTransport,
  onNext,
  onPrev
}: TransportInputSectionProps) => {
  const isMobile = useIsMobile();
  
  // Handle focus to select all text when clicking on input
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };
  
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-md md:text-lg font-medium flex items-center gap-2">
        <Truck className="h-4 w-4 md:h-5 md:w-5 text-carbon-600" />
        <span>Enter Transportation Details</span>
      </div>
      
      {transportItems.map((transport, index) => (
        <div key={`transport-${index}`} className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end border border-carbon-100 p-3 md:p-4 rounded-lg">
          <div className="w-full">
            <Label htmlFor={`transport-type-${index}`} className="text-xs md:text-sm">Transport Type</Label>
            <Select
              value={transport.type}
              onValueChange={(value) => onUpdateTransport(index, "type", value)}
            >
              <SelectTrigger id={`transport-type-${index}`} className="mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm">
                <SelectValue placeholder="Select transport" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TRANSPORT_FACTORS).map(([key, value]) => (
                  <SelectItem key={key} value={key} className="text-xs md:text-sm">{value.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full">
            <Label htmlFor={`transport-distance-${index}`} className="text-xs md:text-sm">Distance (km)</Label>
            <Input
              id={`transport-distance-${index}`}
              type="number"
              value={transport.distance === 0 ? '' : transport.distance}
              onChange={(e) => onUpdateTransport(index, "distance", e.target.value === '' ? 0 : e.target.value)}
              min={0}
              onFocus={handleFocus}
              className="mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm"
            />
          </div>
          
          <div className="w-full sm:col-span-2">
            <Label htmlFor={`transport-weight-${index}`} className="text-xs md:text-sm">Weight (kg)</Label>
            <Input
              id={`transport-weight-${index}`}
              type="number"
              value={transport.weight === 0 ? '' : transport.weight}
              onChange={(e) => onUpdateTransport(index, "weight", e.target.value === '' ? 0 : e.target.value)}
              min={0}
              onFocus={handleFocus}
              className="mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm"
            />
          </div>
          
          <div className="w-full sm:col-span-2 flex justify-end">
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              className="w-full sm:w-auto hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300 text-xs md:text-sm"
              type="button"
              onClick={() => onRemoveTransport(index)}
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
            onClick={onAddTransport} 
            className="bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm"
          >
            Add Transport
          </Button>
        </div>
        <Button 
          type="button" 
          size={isMobile ? "sm" : "default"}
          onClick={onNext} 
          className="bg-carbon-600 hover:bg-carbon-700 text-white mt-2 sm:mt-0 text-xs md:text-sm"
        >
          Next: Energy
        </Button>
      </div>
    </div>
  );
};

export default TransportInputSection;
