
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface AlternativesFilterProps {
  checked: boolean;
  onToggle: (checked: boolean) => void;
}

const AlternativesFilter: React.FC<AlternativesFilterProps> = ({
  checked,
  onToggle
}) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id="alternatives-only"
        checked={checked}
        onCheckedChange={(checked) => onToggle(!!checked)}
      />
      <Label 
        htmlFor="alternatives-only"
        className="text-sm cursor-pointer"
      >
        Show only alternative materials
      </Label>
    </div>
  );
};

export default AlternativesFilter;
