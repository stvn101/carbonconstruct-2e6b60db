
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
import { useIsMobile } from "@/hooks/use-mobile";

const RegionSelector = () => {
  // Get region context or use defaults if not available
  let selectedRegion = "Australia";
  let regions = ["Australia"];
  let setSelectedRegion = (value: string) => {
    console.log("Region selection is fixed to Australia");
  };

  try {
    const regionContext = useRegion();
    selectedRegion = regionContext.selectedRegion;
    regions = regionContext.regions;
    setSelectedRegion = regionContext.setSelectedRegion;
  } catch (error) {
    console.log("RegionContext not available, using default values");
  }
  
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center gap-1">
      {!isMobile && <MapPin className="h-4 w-4 text-muted-foreground" />}
      <Select 
        value={selectedRegion} 
        onValueChange={(value) => setSelectedRegion(value as any)}
      >
        <SelectTrigger className="w-auto border-none shadow-none h-8 pl-0 pr-1 focus:ring-0">
          <SelectValue>
            <Badge variant="outline" className="font-normal text-xs">
              {isMobile ? "🇦🇺" : selectedRegion}
            </Badge>
          </SelectValue>
        </SelectTrigger>
        <SelectContent align="end" className="w-52 z-50">
          {regions.map((region) => (
            <SelectItem 
              key={region} 
              value={region}
              className="font-medium text-carbon-600"
            >
              <span className="inline-flex items-center">
                🇦🇺 {region}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RegionSelector;
