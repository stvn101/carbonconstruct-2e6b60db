
import React, { useState, useEffect } from "react";
import { useRegion } from "@/contexts/RegionContext";
import { useMaterialData } from "@/hooks/useMaterialData";
import DatabaseHeader from './DatabaseHeader';
import DatabaseFilterCard from './DatabaseFilterCard';
import DatabaseResultsCard from './DatabaseResultsCard';
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";

const MaterialDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedAlternative, setSelectedAlternative] = useState<string>("none");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const { selectedRegion: globalRegion } = useRegion();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Setup data using our hook
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
    if (globalRegion && globalRegion !== "National" && selectedRegion === "all") {
      setSelectedRegion(globalRegion);
    }
    // Mark component as loaded after initial render
    setIsLoaded(true);
  }, [globalRegion]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRegion(globalRegion && globalRegion !== "National" ? globalRegion : "all");
    setSelectedAlternative("none");
    setSelectedTag("all");
  };

  console.log("Materials data loaded:", {
    count: filteredMaterials?.length || 0,
    regions: allRegions,
    tags: allTags
  });

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8 content-top-spacing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Loading Material Database...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundaryWrapper feature="Material Database">
      <div className="container mx-auto px-4 py-8 content-top-spacing">
        <div className="max-w-5xl mx-auto">
          <DatabaseHeader 
            globalRegion={globalRegion || "National"}
            materialsByRegion={materialsByRegion || {}}
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
            allTags={allTags || []}
            allRegions={allRegions || []} 
            baseOptions={baseOptions || []}
          />
          
          <DatabaseResultsCard
            filteredMaterials={filteredMaterials || []}
            resetFilters={resetFilters}
            materialCount={materialCount || 0}
          />
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default MaterialDatabase;
