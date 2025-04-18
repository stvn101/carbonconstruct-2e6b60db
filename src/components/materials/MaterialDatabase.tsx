
import React, { useState, useEffect } from "react";
import { useRegion } from "@/contexts/RegionContext";
import { useMaterialData } from "@/hooks/useMaterialData";
import DatabaseHeader from './DatabaseHeader';
import DatabaseFilterCard from './DatabaseFilterCard';
import DatabaseResultsCard from './DatabaseResultsCard';

const MaterialDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedAlternative, setSelectedAlternative] = useState<string>("none");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const { selectedRegion: globalRegion } = useRegion();
  
  const {
    filteredMaterials,
    materialsByRegion,
    allTags,
    allRegions,
    baseOptions,
    materialCount
  } = useMaterialData({
    searchTerm,
    selectedRegion,
    selectedAlternative,
    selectedTag
  });
  
  // Set the default filter to the global region
  useEffect(() => {
    if (globalRegion !== "National") {
      setSelectedRegion(globalRegion);
    }
  }, [globalRegion]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRegion(globalRegion !== "National" ? globalRegion : "all");
    setSelectedAlternative("none");
    setSelectedTag("all");
  };

  return (
    <div className="container mx-auto px-4 py-8 content-top-spacing">
      <div className="max-w-5xl mx-auto">
        <DatabaseHeader 
          globalRegion={globalRegion}
          materialsByRegion={materialsByRegion}
        />
        
        <DatabaseFilterCard
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedRegion={selectedRegion}
          setSelectedRegion={setSelectedRegion}
          selectedAlternative={selectedAlternative}
          setSelectedAlternative={setSelectedAlternative}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          allTags={allTags}
          allRegions={allRegions}
          baseOptions={baseOptions}
        />
        
        <DatabaseResultsCard
          filteredMaterials={filteredMaterials}
          resetFilters={resetFilters}
          materialCount={materialCount}
        />
      </div>
    </div>
  );
};

export default MaterialDatabase;
