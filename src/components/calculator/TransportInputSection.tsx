import React from "react";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransportInput } from "@/lib/carbonExports";
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
  demoMode?: boolean;
}

const TransportInputSection = ({
  transportItems,
  onUpdateTransport,
  onAddTransport,
  onRemoveTransport,
  onNext,
  onPrev,
  demoMode = false
}: TransportInputSectionProps) => {
  const isMobile = useIsMobile().isMobile;
  const { errors, validateField } = useTransportValidation();
  
  const handleInputChange = (index: number, field: keyof TransportInput, value: string) => {
    if (field === 'type' || validateField(index, field as 'distance' | 'weight', value)) {
      onUpdateTransport(index, field, value);
    }
  };
  
  const handlePrevButtonClick = () => {
    console.log("Transport: Previous button clicked");
    if (typeof onPrev === 'function') {
      onPrev();
    }
  };
  
  const handleNextButtonClick = () => {
    console.log("Transport: Next button clicked");
    if (typeof onNext === 'function') {
      onNext();
    }
  };
  
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-md md:text-lg font-medium flex items-center gap-2">
        <Truck className="h-4 w-4 md:h-5 md:w-5 text-carbon-600" />
        <span>Enter Transportation Details</span>
        {demoMode && (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Demo Mode</span>
        )}
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
            onClick={onAddTransport} 
            className="w-full sm:w-auto bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm mt-2 sm:mt-0"
          >
            Add Transport
          </Button>
        </div>
        <Button 
          type="button" 
          size={isMobile ? "sm" : "default"}
          onClick={handleNextButtonClick} 
          className="w-full sm:w-auto bg-carbon-600 hover:bg-carbon-700 text-white mt-2 sm:mt-0 text-xs md:text-sm"
        >
          Next: Energy
        </Button>
      </div>
    </div>
  );
};

export default TransportInputSection;
