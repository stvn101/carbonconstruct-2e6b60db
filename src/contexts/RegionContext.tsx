
import React, { createContext, useContext, useState, ReactNode } from "react";

// Modify the type to be more specific to Australian regions
type Region = "National" | "New South Wales" | "Victoria" | "Queensland" | "Western Australia" | "South Australia" | "Tasmania" | "Northern Territory" | "Australian Capital Territory";

interface RegionContextType {
  selectedRegion: Region;
  setSelectedRegion: (region: Region) => void;
  regions: Region[];
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

// Updated regions list to include specific Australian states and territories
export const regions: Region[] = [
  "National", 
  "New South Wales", 
  "Victoria", 
  "Queensland", 
  "Western Australia", 
  "South Australia", 
  "Tasmania", 
  "Northern Territory", 
  "Australian Capital Territory"
];

export function RegionProvider({ children }: { children: ReactNode }) {
  // Default to National as the initial region
  const [selectedRegion, setSelectedRegion] = useState<Region>("National");

  return (
    <RegionContext.Provider
      value={{
        selectedRegion,
        setSelectedRegion,
        regions
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  
  if (context === undefined) {
    throw new Error("useRegion must be used within a RegionProvider");
  }
  
  return context;
}
