
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import { TRANSPORT_FACTORS } from "@/lib/carbonCalculations";
import { TransportInput } from "@/lib/carbonTypes";
import { TransportFieldError } from "@/hooks/useTransportValidation";
import { useIsMobile } from "@/hooks/use-mobile";

interface TransportFormFieldsProps {
  transport: TransportInput;
  index: number;
  errors?: TransportFieldError;
  onRemove: () => void;
  onUpdate: (field: keyof TransportInput, value: string | number) => void;
}

const TransportFormFields: React.FC<TransportFormFieldsProps> = ({
  transport,
  index,
  errors,
  onRemove,
  onUpdate
}) => {
  const isMobile = useIsMobile();
  
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const getInputValidationClass = (field: keyof TransportFieldError) => {
    if (errors?.[field]) return 'input-invalid';
    if (transport[field] && !errors?.[field]) return 'input-valid';
    return '';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start border border-carbon-100 p-3 md:p-4 rounded-lg">
      <div className="w-full flex flex-col">
        <Label htmlFor={`transport-type-${index}`} className="text-xs md:text-sm mb-1.5">Transport Type</Label>
        <Select
          value={transport.type}
          onValueChange={(value) => onUpdate("type", value)}
        >
          <SelectTrigger 
            id={`transport-type-${index}`}
            name={`transport-type-${index}`}
            className="border-carbon-200 focus:ring-carbon-500 text-xs md:text-sm h-10"
          >
            <SelectValue placeholder="Select transport" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800">
            {Object.entries(TRANSPORT_FACTORS).map(([key, value]) => (
              <SelectItem key={key} value={key} className="text-xs md:text-sm">
                {value.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="w-full">
        <Label htmlFor={`transport-distance-${index}`} className="text-xs md:text-sm mb-1.5 block">
          Distance (km)
        </Label>
        <Input
          id={`transport-distance-${index}`}
          name={`transport-distance-${index}`}
          type="number"
          value={transport.distance === 0 ? '' : transport.distance}
          onChange={(e) => onUpdate("distance", e.target.value)}
          onFocus={handleFocus}
          className={`text-xs md:text-sm ${getInputValidationClass('distance')}`}
          aria-invalid={!!errors?.distance}
          aria-describedby={errors?.distance ? `transport-distance-error-${index}` : undefined}
        />
        {errors?.distance ? (
          <div className="validation-message error" id={`transport-distance-error-${index}`}>
            <AlertCircle className="h-3 w-3" />
            <span>{errors.distance}</span>
          </div>
        ) : transport.distance ? (
          <div className="validation-message success">
            <CheckCircle className="h-3 w-3" />
            <span>Valid distance entered</span>
          </div>
        ) : null}
      </div>
      
      <div className="w-full sm:col-span-2">
        <Label htmlFor={`transport-weight-${index}`} className="text-xs md:text-sm mb-1.5 block">
          Weight (kg)
        </Label>
        <Input
          id={`transport-weight-${index}`}
          name={`transport-weight-${index}`}
          type="number"
          value={transport.weight === 0 ? '' : transport.weight}
          onChange={(e) => onUpdate("weight", e.target.value)}
          onFocus={handleFocus}
          className={`text-xs md:text-sm ${getInputValidationClass('weight')}`}
          aria-invalid={!!errors?.weight}
          aria-describedby={errors?.weight ? `transport-weight-error-${index}` : undefined}
        />
        {errors?.weight ? (
          <div className="validation-message error" id={`transport-weight-error-${index}`}>
            <AlertCircle className="h-3 w-3" />
            <span>{errors.weight}</span>
          </div>
        ) : transport.weight ? (
          <div className="validation-message success">
            <CheckCircle className="h-3 w-3" />
            <span>Valid weight entered</span>
          </div>
        ) : null}
      </div>
      
      <div className="w-full sm:col-span-2 flex justify-end">
        <Button
          variant="outline"
          size={isMobile ? "sm" : "default"}
          className="w-full sm:w-auto hover:bg-carbon-100 hover:text-carbon-800 border-carbon-300 text-xs md:text-sm"
          type="button"
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default TransportFormFields;
