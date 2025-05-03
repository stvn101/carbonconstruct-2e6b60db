
import React, { useEffect, useState, useMemo } from "react";
import { useRegion } from "@/contexts/RegionContext";
import { useMaterialData } from "@/hooks/useMaterialData";
import { useMaterialCache } from "@/hooks/useMaterialCache";
import DatabaseHeader from './DatabaseHeader';
import DatabaseFilterCard from './DatabaseFilterCard';
import DatabaseResultsCard from './DatabaseResultsCard';
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const MaterialDatabase = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedAlternative, setSelectedAlternative] = React.useState<string>("none");
  const [selectedTag, setSelectedTag] = React.useState<string>("all");
  const { selectedRegion } = useRegion();
  
  // Use the material cache hook for efficient data loading
  const { materials, loading, error, refreshCache, cacheStats } = useMaterialCache();
  
  // Default empty categories array
  const [categoriesList, setCategoriesList] = useState<string[]>([]);

  // Use the material data hook for organizing and categorizing data - prevent unnecessary recalculations
  const {
    filteredMaterials,
    materialsByRegion,
    allTags,
    baseOptions,
    materialCount,
    allRegions
  } = useMaterialData({
    searchTerm,
    selectedRegion: "Australia", // Always Australia
    selectedAlternative,
    selectedTag,
    materials // Pass materials directly to avoid dependency on context
  });
  
  // Extract categories from materials on load - only when materials change
  useEffect(() => {
    if (materials && materials.length > 0) {
      // Extract unique categories
      const uniqueCategories = Array.from(
        new Set(
          materials
            .map(m => m.category || 'Uncategorized')
            .filter(Boolean)
        )
      );
      
      setCategoriesList(uniqueCategories);
    }
  }, [materials]);
  
  // Make sure we have safe arrays to work with
  const safeTags = Array.isArray(allTags) ? allTags : [];
  const safeCategories = Array.isArray(categoriesList) ? categoriesList : [];
  const safeMaterials = Array.isArray(filteredMaterials) ? filteredMaterials : [];
  const safeBaseOptions = Array.isArray(baseOptions) ? baseOptions : [];

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedAlternative("none");
    setSelectedTag("all");
  };

  // Show loading state only on initial load
  if (loading && (!safeMaterials || safeMaterials.length === 0)) {
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
  
  // Show error state only when there's no data at all
  if (error && (!safeMaterials || safeMaterials.length === 0)) {
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
            cacheInfo={cacheStats}
          />
          
          {/* Cache refresh button */}
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshCache}
              className="text-xs flex items-center gap-1"
              disabled={loading}
            >
              <RefreshCcw className="h-3 w-3" />
              {loading ? 'Refreshing...' : 'Refresh Data'}
            </Button>
          </div>
          
          <DatabaseFilterCard
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedAlternative={selectedAlternative}
            setSelectedAlternative={setSelectedAlternative}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            allTags={safeTags}
            baseOptions={safeBaseOptions}
            categories={safeCategories}
            loading={loading && (!categoriesList || categoriesList.length === 0)}
          />
          
          <DatabaseResultsCard
            filteredMaterials={safeMaterials}
            resetFilters={resetFilters}
            materialCount={materialCount || 0}
            totalCount={materials ? materials.length : 0}
            loading={loading && safeMaterials.length > 0}
          />
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default MaterialDatabase;
