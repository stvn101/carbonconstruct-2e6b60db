
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transport, TransportInput, TRANSPORT_FACTORS } from "@/lib/carbonCalculations";

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
  return (
    <div className="space-y-6">
      <div className="text-lg font-medium flex items-center gap-2">
        <Truck className="h-5 w-5 text-carbon-600" />
        <span>Enter Transportation Details</span>
      </div>
      
      {transportItems.map((transport, index) => (
        <div key={`transport-${index}`} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border border-carbon-100 p-4 rounded-lg">
          <div className="md:col-span-3">
            <Label htmlFor={`transport-type-${index}`}>Transport Type</Label>
            <Select
              value={transport.type}
              onValueChange={(value) => onUpdateTransport(index, "type", value)}
            >
              <SelectTrigger id={`transport-type-${index}`} className="border-carbon-200 focus:ring-carbon-500">
                <SelectValue placeholder="Select transport" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TRANSPORT_FACTORS).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="md:col-span-3">
            <Label htmlFor={`transport-distance-${index}`}>Distance (km)</Label>
            <Input
              id={`transport-distance-${index}`}
              type="number"
              value={transport.distance}
              onChange={(e) => onUpdateTransport(index, "distance", e.target.value)}
              min={0}
              className="border-carbon-200 focus:ring-carbon-500"
            />
          </div>
          
          <div className="md:col-span-4">
            <Label htmlFor={`transport-weight-${index}`}>Weight (kg)</Label>
            <Input
              id={`transport-weight-${index}`}
              type="number"
              value={transport.weight}
              onChange={(e) => onUpdateTransport(index, "weight", e.target.value)}
              min={0}
              className="border-carbon-200 focus:ring-carbon-500"
            />
          </div>
          
          <div className="md:col-span-2">
            <Button
              variant="outline"
              className="w-full hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300"
              type="button"
              onClick={() => onRemoveTransport(index)}
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
            onClick={onAddTransport} 
            className="bg-carbon-600 hover:bg-carbon-700 text-white"
          >
            Add Transport
          </Button>
        </div>
        <Button 
          type="button" 
          onClick={onNext} 
          className="bg-carbon-600 hover:bg-carbon-700 text-white"
        >
          Next: Energy
        </Button>
      </div>
    </div>
  );
};

export default TransportInputSection;
