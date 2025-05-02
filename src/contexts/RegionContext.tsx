
import React, { createContext, useContext, ReactNode } from "react";

// Define Australia as the only region since NCC is Australia-wide
type Region = "Australia";

interface RegionContextType {
  selectedRegion: Region;
  setSelectedRegion: (region: Region) => void;
  regions: Region[];
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

// Only Australia is available as a region
export const regions: Region[] = ["Australia"];

export function RegionProvider({ children }: { children: ReactNode }) {
  // Set Australia as the fixed region
  const selectedRegion: Region = "Australia";
  
  // No-op function since we don't allow changing the region anymore
  const setSelectedRegion = (region: Region) => {
    console.log("Region is fixed to Australia");
  };

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
