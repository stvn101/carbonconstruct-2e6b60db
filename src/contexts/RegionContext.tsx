
import React, { createContext, useContext, useState, ReactNode } from "react";

type Region = "Australia" | "North America" | "Asia" | "Europe" | "Global";

interface RegionContextType {
  selectedRegion: Region;
  setSelectedRegion: (region: Region) => void;
  regions: Region[];
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

export const regions: Region[] = ["Australia", "North America", "Asia", "Europe", "Global"];

export function RegionProvider({ children }: { children: ReactNode }) {
  // Default to Australia as per your request
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
