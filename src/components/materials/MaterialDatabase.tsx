
import React, { useState, useEffect } from "react";
import { useRegion } from "@/contexts/RegionContext";
import { useMaterialData } from "@/hooks/useMaterialData";
import DatabaseHeader from './DatabaseHeader';
import DatabaseFilterCard from './DatabaseFilterCard';
import DatabaseResultsCard from './DatabaseResultsCard';
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";
import { AlertCircle, Loader2 } from "lucide-react";

const MaterialDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlternative, setSelectedAlternative] = useState<string>("none");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const { selectedRegion } = useRegion();
  
  // Setup data using our hook - always use Australia as the region
  const {
    filteredMaterials,
    materialsByRegion,
    allTags,
    baseOptions,
    materialCount,
    loading,
    error
  } = useMaterialData({
    searchTerm,
    selectedRegion: "Australia", // Always Australia
    selectedAlternative,
    selectedTag
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedAlternative("none");
    setSelectedTag("all");
  };

  console.log("Materials data loaded:", {
    count: filteredMaterials?.length || 0,
    tags: allTags
  });

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 content-top-spacing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-carbon-600" />
            <h2 className="text-2xl font-bold">Loading Material Database...</h2>
            <p className="text-muted-foreground">Fetching materials from database</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 content-top-spacing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center bg-red-50 p-6 rounded-lg border border-red-200">
            <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-red-700">Error Loading Materials</h2>
            <p className="text-red-600 mt-2">
              {error.message || "Failed to load material data. Please try again later."}
            </p>
            <button 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
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
            globalRegion="Australia"
            materialsByRegion={materialsByRegion || {}}
          />
          
          <DatabaseFilterCard
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedAlternative={selectedAlternative}
            setSelectedAlternative={setSelectedAlternative}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            allTags={allTags || []}
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
