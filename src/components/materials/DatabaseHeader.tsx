
import React from 'react';
import { Database } from 'lucide-react';
import RegionStats from './RegionStats';
import { MaterialsByRegion } from '@/lib/materialTypes';

interface DatabaseHeaderProps {
  globalRegion: string;
  materialsByRegion: MaterialsByRegion;
}

const DatabaseHeader = ({ globalRegion, materialsByRegion }: DatabaseHeaderProps) => {
  const getHeaderDescription = () => {
    switch(globalRegion) {
      case "National":
        return "Comprehensive database of construction materials with carbon coefficients across Australia";
      case "Queensland":
        return "Explore Queensland's construction materials with region-specific carbon coefficients";
      case "New South Wales":
        return "Discover New South Wales construction materials and their carbon impact";
      case "Victoria":
        return "View Victoria's construction materials and their carbon performance";
      case "Western Australia":
        return "Analyze Western Australia's construction materials and carbon coefficients";
      case "South Australia":
        return "Explore South Australia's sustainable construction material database";
      case "Tasmania":
        return "Tasmania's construction materials with detailed carbon insights";
      case "Northern Territory":
        return "Northern Territory construction materials and their environmental footprint";
      case "Australian Capital Territory":
        return "ACT's comprehensive construction materials carbon database";
      default:
        return "Explore our comprehensive database of construction materials with accurate carbon coefficients";
    }
  };

  return (
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-carbon-100">
          <Database className="h-6 w-6 text-carbon-700" />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-2">
        {globalRegion === "National" 
          ? "Material Database" 
          : `${globalRegion} Material Database`}
      </h1>
      <p className="text-lg text-muted-foreground">
        {getHeaderDescription()}
      </p>
      
      {materialsByRegion && Object.keys(materialsByRegion).length > 0 && (
        <RegionStats materialsByRegion={materialsByRegion} />
      )}
    </div>
  );
};

export default DatabaseHeader;
