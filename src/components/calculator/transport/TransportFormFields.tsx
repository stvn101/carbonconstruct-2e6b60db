
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TransportInput } from "@/lib/carbonExports";
import { TRANSPORT_FACTORS } from "@/lib/carbonData";
import { TransportFactorKey } from "@/lib/carbonData";

interface TransportFormFieldsProps {
  transport: TransportInput;
  index: number;
  errors?: string;
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
  const transportTypes = Object.keys(TRANSPORT_FACTORS);
  
  return (
    <div className={`grid grid-cols-1 gap-3 items-end border p-3 md:p-4 rounded-lg ${errors ? "border-red-300 bg-red-50" : "border-carbon-100"}`}>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-3">
          {/* Transport Type */}
          <div>
            <label htmlFor={`transport-type-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              Transport Type
            </label>
            <Select
              value={transport.type}
              onValueChange={(value) => onUpdate("type", value)}
            >
              <SelectTrigger id={`transport-type-${index}`}>
                <SelectValue placeholder="Select transport type" />
              </SelectTrigger>
              <SelectContent>
                {transportTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {TRANSPORT_FACTORS[type as TransportFactorKey]?.name || type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Distance */}
          <div>
            <label htmlFor={`transport-distance-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              Distance (km)
            </label>
            <Input
              id={`transport-distance-${index}`}
              type="number"
              min="0"
              max="20000"
              value={transport.distance}
              onChange={(e) => onUpdate("distance", e.target.value)}
              className={errors ? "border-red-300 bg-red-50" : ""}
              aria-invalid={errors ? "true" : "false"}
              aria-describedby={errors ? `transport-error-${index}` : undefined}
            />
          </div>
          
          {/* Weight */}
          <div>
            <label htmlFor={`transport-weight-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <Input
              id={`transport-weight-${index}`}
              type="number"
              min="0"
              max="100000"
              value={transport.weight || ""}
              onChange={(e) => onUpdate("weight", e.target.value)}
              className={errors ? "border-red-300 bg-red-50" : ""}
            />
          </div>
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
      {errors && (
        <p id={`transport-error-${index}`} className="mt-1 text-xs text-red-600">
          {errors}
        </p>
      )}
    </div>
  );
};

export default TransportFormFields;
