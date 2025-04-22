
import React, { createContext, useContext, useState, ReactNode } from "react";

// Restrict region to only "Australia" for now
type Region = "Australia";

interface RegionContextType {
  selectedRegion: Region;
  setSelectedRegion: (region: Region) => void;
  regions: Region[];
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

// Regions array now only contains Australia
export const regions: Region[] = [
  "Australia"
];

export function RegionProvider({ children }: { children: ReactNode }) {
  // Default and only region is Australia
  const [selectedRegion, setSelectedRegion] = useState<Region>("Australia");

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
