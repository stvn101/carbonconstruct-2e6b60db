
import React from "react";
import { Badge } from "@/components/ui/badge";

interface RegionStatsProps {
  materialsByRegion: Record<string, number>;
}

const RegionStats: React.FC<RegionStatsProps> = ({ materialsByRegion }) => {
  return (
    <div className="flex flex-wrap justify-center mt-4 gap-2">
      {Object.entries(materialsByRegion).map(([region, count]) => (
        <Badge 
          key={region} 
          variant="outline"
          className={`px-3 py-1 ${region === 'Australia' ? 'bg-carbon-100' : ''}`}
        >
          {region}: {count} materials
        </Badge>
      ))}
    </div>
  );
};

export default RegionStats;
