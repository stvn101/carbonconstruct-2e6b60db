
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { TransportInput } from '@/lib/carbonExports';

export interface TransportFormFieldsProps {
  index: number;
  item: TransportInput;
  onUpdate: (field: string, value: any) => void;
  onRemove: () => void;
  errors?: string;
}

const TransportFormFields: React.FC<TransportFormFieldsProps> = ({
  index,
  item,
  onUpdate,
  onRemove,
  errors
}) => {
  // Ensure we have valid values for select fields
  const transportMode = item.mode || item.type || 'truck';
  
  // Debug what we're rendering
  console.log(`Rendering transport form fields for item ${index}:`, item);

  return (
    <Card className="border border-gray-200 dark:border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between py-3 bg-gray-50 dark:bg-gray-800">
        <h3 className="font-medium">Transport #{index + 1}</h3>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onRemove} 
          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Remove transport item</span>
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`transport-mode-${index}`}>Transport Mode</Label>
            <Select
              value={transportMode}
              onValueChange={(value) => {
                onUpdate('mode', value);
                // Also update type for backward compatibility
                onUpdate('type', value);
              }}
            >
              <SelectTrigger id={`transport-mode-${index}`}>
                <SelectValue placeholder="Select transport mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="rail">Rail</SelectItem>
                <SelectItem value="ship">Ship</SelectItem>
                <SelectItem value="air">Air Freight</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`transport-distance-${index}`}>Distance (km)</Label>
            <Input
              id={`transport-distance-${index}`}
              type="number"
              min="0"
              step="0.01"
              value={item.distance || ''}
              onChange={(e) => onUpdate('distance', parseFloat(e.target.value))}
              placeholder="Enter distance"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`transport-weight-${index}`}>Weight (kg)</Label>
            <Input
              id={`transport-weight-${index}`}
              type="number"
              min="0"
              step="0.01"
              value={item.weight || ''}
              onChange={(e) => onUpdate('weight', parseFloat(e.target.value))}
              placeholder="Enter weight"
            />
          </div>
        </div>
        
        {errors && (
          <div className="text-sm text-destructive">
            {errors}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransportFormFields;
