
import React from 'react';
import { Badge } from '@/components/ui/badge';

type RecyclabilityLevel = 'High' | 'Medium' | 'Low';

interface RecyclabilityFilterProps {
  selectedLevels: RecyclabilityLevel[];
  onToggleLevel: (level: RecyclabilityLevel) => void;
}

const RecyclabilityFilter: React.FC<RecyclabilityFilterProps> = ({
  selectedLevels,
  onToggleLevel
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Recyclability</h3>
      <div className="flex gap-2">
        {(['High', 'Medium', 'Low'] as RecyclabilityLevel[]).map((level) => (
          <Badge
            key={level}
            variant={selectedLevels.includes(level) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onToggleLevel(level)}
          >
            {level}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default RecyclabilityFilter;
