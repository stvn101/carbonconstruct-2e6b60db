
import React from "react";
import { MapPin } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useRegion } from "@/contexts/RegionContext";
import { Badge } from "@/components/ui/badge";

const RegionSelector = () => {
  const { selectedRegion, setSelectedRegion, regions } = useRegion();
  
  return (
    <div className="flex items-center space-x-2">
      <MapPin className="h-4 w-4 text-muted-foreground" />
      <Select value={selectedRegion} onValueChange={(value) => setSelectedRegion(value as any)}>
        <SelectTrigger className="w-auto border-none shadow-none h-8 pl-0 focus:ring-0">
          <SelectValue placeholder="Select region">
            <Badge variant="outline" className="font-normal">
              {selectedRegion}
            </Badge>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end">
          {regions.map((region) => (
            <SelectItem 
              key={region} 
              value={region}
              className={region === "National" ? "font-medium text-carbon-600" : ""}
            >
              🇦🇺 {region}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RegionSelector;
