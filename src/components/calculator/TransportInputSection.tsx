
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Transport, TransportInput, TRANSPORT_FACTORS } from "@/lib/carbonCalculations";
import { useIsMobile } from "@/hooks/use-mobile";
import React, { useState } from "react";

// Define the maximum values allowed per NCC 2025 regulations
const MAX_DISTANCE = 10000; // 10,000 km
const MAX_WEIGHT = 10000;   // 10,000 kg

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
  
  const [errors, setErrors] = useState<Record<number, Record<string, string>>>({});
  
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };
  
  const handleInputChange = (index: number, field: keyof TransportInput, value: string) => {
    const numValue = Number(value);
    
    if (value === "") {
      setErrors(prev => {
        const newErrors = { ...prev };
        if (newErrors[index]) {
          delete newErrors[index][field];
          if (Object.keys(newErrors[index]).length === 0) {
            delete newErrors[index];
          }
        }
        return newErrors;
      });
      onUpdateTransport(index, field, "");
      return;
    }
    
    if (!isNaN(numValue)) {
      if (numValue < 0) {
        // Negative value error
        setErrors(prev => {
          const newErrors = { ...prev };
          if (!newErrors[index]) {
            newErrors[index] = {};
          }
          newErrors[index][field] = `${field === 'distance' ? 'Distance' : 'Weight'} cannot be negative`;
          return newErrors;
        });
        onUpdateTransport(index, field, numValue);
      } else if ((field === 'distance' && numValue > MAX_DISTANCE) || 
                (field === 'weight' && numValue > MAX_WEIGHT)) {
        // Maximum value error
        setErrors(prev => {
          const newErrors = { ...prev };
          if (!newErrors[index]) {
            newErrors[index] = {};
          }
          const maxValue = field === 'distance' ? MAX_DISTANCE : MAX_WEIGHT;
          const unit = field === 'distance' ? 'km' : 'kg';
          newErrors[index][field] = `Maximum ${field} is ${maxValue.toLocaleString()} ${unit}`;
          return newErrors;
        });
        onUpdateTransport(index, field, numValue);
      } else {
        // Valid value
        setErrors(prev => {
          const newErrors = { ...prev };
          if (newErrors[index] && newErrors[index][field]) {
            delete newErrors[index][field];
            if (Object.keys(newErrors[index]).length === 0) {
              delete newErrors[index];
            }
          }
          return newErrors;
        });
        onUpdateTransport(index, field, numValue);
      }
    }
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
              onChange={(e) => handleInputChange(index, "distance", e.target.value)}
              min={0}
              max={MAX_DISTANCE}
              onFocus={handleFocus}
              className={`mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm ${errors[index]?.distance ? 'border-destructive' : ''}`}
              aria-invalid={errors[index]?.distance ? "true" : "false"}
              aria-describedby={errors[index]?.distance ? `transport-distance-error-${index}` : undefined}
            />
            {errors[index]?.distance && (
              <p id={`transport-distance-error-${index}`} className="mt-1 text-xs text-destructive">
                {errors[index].distance}
              </p>
            )}
          </div>
          
          <div className="w-full sm:col-span-2">
            <Label htmlFor={`transport-weight-${index}`} className="text-xs md:text-sm">Weight (kg)</Label>
            <Input
              id={`transport-weight-${index}`}
              type="number"
              value={transport.weight === 0 ? '' : transport.weight}
              onChange={(e) => handleInputChange(index, "weight", e.target.value)}
              min={0}
              max={MAX_WEIGHT}
              onFocus={handleFocus}
              className={`mt-1 border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm ${errors[index]?.weight ? 'border-destructive' : ''}`}
              aria-invalid={errors[index]?.weight ? "true" : "false"}
              aria-describedby={errors[index]?.weight ? `transport-weight-error-${index}` : undefined}
            />
            {errors[index]?.weight && (
              <p id={`transport-weight-error-${index}`} className="mt-1 text-xs text-destructive">
                {errors[index].weight}
              </p>
            )}
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
