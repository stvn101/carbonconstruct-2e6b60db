
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { TransportInput, TRANSPORT_FACTORS, Transport } from "@/lib/carbonExports";

interface TransportFormFieldsProps {
  transport: TransportInput;
  index: number;
  errors?: Record<string, string>;
  onRemove: () => void;
  onUpdate: (field: keyof TransportInput, value: string | number) => void;
}

const TransportFormFields: React.FC<TransportFormFieldsProps> = ({
  transport,
  index,
  errors = {},
  onRemove,
  onUpdate
}) => {
  const transportTypes = Object.keys(TRANSPORT_FACTORS) as Transport[];
  
  const hasErrors = Object.keys(errors).length > 0;
  
  return (
    <div className={`grid grid-cols-1 gap-3 border p-3 md:p-4 rounded-lg ${hasErrors ? "border-red-300 bg-red-50" : "border-carbon-100"}`}>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
        <div>
          <label htmlFor={`transport-type-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Transport Type
          </label>
          <Select
            value={transport.type}
            onValueChange={(value) => onUpdate("type", value as Transport)}
          >
            <SelectTrigger id={`transport-type-${index}`}>
              <SelectValue placeholder="Select transport type" />
            </SelectTrigger>
            <SelectContent>
              {transportTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {TRANSPORT_FACTORS[type]?.name || type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="self-end">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="h-9 w-9"
            aria-label="Remove transport"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor={`transport-distance-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Distance (km)
          </label>
          <Input
            id={`transport-distance-${index}`}
            type="number"
            min="0"
            value={transport.distance}
            onChange={(e) => onUpdate("distance", e.target.value)}
            className={errors.distance ? "border-red-300 bg-red-50" : ""}
            aria-invalid={errors.distance ? "true" : "false"}
            aria-describedby={errors.distance ? `transport-distance-error-${index}` : undefined}
          />
          {errors.distance && (
            <p id={`transport-distance-error-${index}`} className="mt-1 text-xs text-red-600">
              {errors.distance}
            </p>
          )}
        </div>
        
        <div>
          <label htmlFor={`transport-weight-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
            Weight (kg)
          </label>
          <Input
            id={`transport-weight-${index}`}
            type="number"
            min="0"
            value={transport.weight}
            onChange={(e) => onUpdate("weight", e.target.value)}
            className={errors.weight ? "border-red-300 bg-red-50" : ""}
            aria-invalid={errors.weight ? "true" : "false"}
            aria-describedby={errors.weight ? `transport-weight-error-${index}` : undefined}
          />
          {errors.weight && (
            <p id={`transport-weight-error-${index}`} className="mt-1 text-xs text-red-600">
              {errors.weight}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransportFormFields;
