
import React from "react";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransportInput } from "@/lib/carbonTypes";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTransportValidation } from "@/hooks/useTransportValidation";
import TransportFormFields from "./transport/TransportFormFields";

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
  const { errors, validateField } = useTransportValidation();
  
  const handleInputChange = (index: number, field: keyof TransportInput, value: string) => {
    if (field === 'type' || validateField(index, field as 'distance' | 'weight', value)) {
      onUpdateTransport(index, field, value);
    }
  };
  
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-md md:text-lg font-medium flex items-center gap-2">
        <Truck className="h-4 w-4 md:h-5 md:w-5 text-carbon-600" />
        <span>Enter Transportation Details</span>
      </div>
      
      {transportItems.map((transport, index) => (
        <TransportFormFields
          key={`transport-${index}`}
          transport={transport}
          index={index}
          errors={errors[index]}
          onRemove={() => onRemoveTransport(index)}
          onUpdate={(field, value) => handleInputChange(index, field, String(value))}
        />
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
