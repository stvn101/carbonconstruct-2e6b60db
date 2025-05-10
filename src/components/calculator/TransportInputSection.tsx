
import React, { useState, useEffect } from "react";
import { Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransportInput } from "@/lib/carbonExports";
import { useIsMobile } from "@/hooks/use-mobile";
import { SkeletonContent } from "@/components/ui/skeleton-content";
import TransportFormFields from "./transport/TransportFormFields";

const MAX_DISTANCE = 20000;

interface TransportInputSectionProps {
  transport: TransportInput[];
  onUpdateTransport: (index: number, field: keyof TransportInput, value: string | number) => void;
  onAddTransport: () => void;
  onRemoveTransport: (index: number) => void;
  onNext: () => void;
  onBack: () => void;
  demoMode?: boolean;
}

const TransportInputSection = ({
  transport,
  onUpdateTransport,
  onAddTransport,
  onRemoveTransport,
  onNext,
  onBack,
  demoMode = false
}: TransportInputSectionProps) => {
  const isMobile = useIsMobile().isMobile;
  const [errors, setErrors] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const handleDistanceChange = (index: number, value: string) => {
    const numValue = Number(value);
    
    if (value === "") {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
      onUpdateTransport(index, "distance", "");
      return;
    }
    
    if (!isNaN(numValue)) {
      if (numValue < 0) {
        setErrors(prev => ({ ...prev, [index]: "Distance cannot be negative" }));
        onUpdateTransport(index, "distance", numValue);
      } else if (numValue > MAX_DISTANCE) {
        setErrors(prev => ({ ...prev, [index]: `Maximum distance is ${MAX_DISTANCE} km` }));
        onUpdateTransport(index, "distance", numValue);
      } else {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[index];
          return newErrors;
        });
        onUpdateTransport(index, "distance", numValue);
      }
    }
  };

  const handleNextButtonClick = () => {
    console.log("Transport: Next button clicked");
    if (typeof onNext === 'function') {
      onNext();
    }
  };

  const handleBackButtonClick = () => {
    console.log("Transport: Back button clicked");
    if (typeof onBack === 'function') {
      onBack();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <div className="text-md md:text-lg font-medium flex items-center gap-2">
          <Truck className="h-4 w-4 md:h-5 md:w-5 text-carbon-600" />
          <span>Loading Transport Options...</span>
        </div>
        {[1, 2].map((index) => (
          <div key={`skeleton-${index}`} className="grid grid-cols-1 gap-3 items-end border border-carbon-100 p-3 md:p-4 rounded-lg">
            <SkeletonContent lines={2} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="text-md md:text-lg font-medium flex items-center gap-2">
        <Truck className="h-4 w-4 md:h-5 md:w-5 text-carbon-600" />
        <span>Enter Transport Details</span>
        {demoMode && (
          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Demo Mode</span>
        )}
      </div>
      
      {transport.map((transportItem, index) => (
        <TransportFormFields
          key={`transport-${index}`}
          transport={transportItem}
          index={index}
          errors={errors[index]}
          onRemove={() => onRemoveTransport(index)}
          onUpdate={(field, value) => {
            if (field === "distance") {
              handleDistanceChange(index, String(value));
            } else {
              onUpdateTransport(index, field, value);
            }
          }}
        />
      ))}
      
      <div className="flex flex-col sm:flex-row sm:justify-between gap-2 mt-4">
        <Button 
          type="button" 
          size={isMobile ? "sm" : "default"}
          onClick={onBack}
          className="w-full sm:w-auto bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm"
        >
          Back: Materials
        </Button>
        <div className="flex items-center space-x-2">
          <Button 
            type="button" 
            size={isMobile ? "sm" : "default"}
            onClick={onAddTransport} 
            className="w-full sm:w-auto bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm"
          >
            Add Transport
          </Button>
          <Button 
            type="button" 
            size={isMobile ? "sm" : "default"}
            onClick={handleNextButtonClick}
            className="w-full sm:w-auto bg-carbon-600 hover:bg-carbon-700 text-white text-xs md:text-sm"
          >
            Next: Energy
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransportInputSection;
