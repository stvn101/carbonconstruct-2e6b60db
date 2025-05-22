
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface RegionFilterProps {
  regions: string[];
  selectedRegions: string[];
  onToggleRegion: (region: string) => void;
}

const RegionFilter: React.FC<RegionFilterProps> = ({
  regions,
  selectedRegions,
  onToggleRegion
}) => {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Regions</h3>
      <div className="flex flex-wrap gap-2">
        {regions.map((region) => (
          <Badge
            key={region}
            variant={selectedRegions.includes(region) ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => onToggleRegion(region)}
          >
            {region}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default RegionFilter;
