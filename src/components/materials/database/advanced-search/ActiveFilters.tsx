
import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ActiveFiltersProps {
  activeFilters: string[];
  onRemoveFilter: (filter: string) => void;
  onResetFilters: () => void;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({
  activeFilters,
  onRemoveFilter,
  onResetFilters
}) => {
  if (activeFilters.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 pt-2">
      {activeFilters.map(filter => {
        const [type, ...valueParts] = filter.split(':');
        const value = valueParts.join(':'); // Rejoin in case value contained colons
        
        return (
          <Badge key={filter} variant="secondary" className="flex items-center gap-1">
            {value}
            <button 
              onClick={() => onRemoveFilter(filter)} 
              className="ml-1 rounded-full hover:bg-muted"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {value} filter</span>
            </button>
          </Badge>
        );
      })}
      
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onResetFilters} 
        className="h-6 px-2 text-xs"
      >
        <RotateCcw className="h-3 w-3 mr-1" />
        Reset
      </Button>
    </div>
  );
};

export default ActiveFilters;
