
import React, { useState, useEffect } from "react";
import { useRegion } from "@/contexts/RegionContext";
import { useMaterialFiltering } from "@/hooks/useMaterialFiltering";
import DatabaseHeader from './DatabaseHeader';
import DatabaseFilterCard from './DatabaseFilterCard';
import DatabaseResultsCard from './DatabaseResultsCard';
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";
import { AlertCircle, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pagination";
import { getCacheMetadata } from "@/services/materialCache";

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
    categories,
    baseOptions,
    materialCount,
    totalMaterials,
    loading,
    error,
    pagination,
    handlePaginationChange,
    refreshCache,
    isCategoriesLoading
  } = useMaterialFiltering({
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

  // Calculate total pages for pagination
  const totalPages = Math.ceil(materialCount / (pagination?.pageSize || 50));

  console.log("Materials data loaded:", {
    count: filteredMaterials?.length || 0,
    totalCount: materialCount,
    tags: allTags,
    categories
  });

  // Cache info state
  const [cacheInfo, setCacheInfo] = useState<{
    lastUpdated: Date | null;
    itemCount: number | null;
  }>({
    lastUpdated: null,
    itemCount: null
  });

  // Load cache info
  useEffect(() => {
    const loadCacheInfo = async () => {
      try {
        const metadata = await getCacheMetadata();
        if (metadata) {
          setCacheInfo({
            lastUpdated: new Date(metadata.lastUpdated),
            itemCount: metadata.count
          });
        }
      } catch (err) {
        console.warn("Failed to load cache info:", err);
      }
    };
    
    loadCacheInfo();
  }, [filteredMaterials]);

  if (loading && filteredMaterials.length === 0) {
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
  
  if (error && filteredMaterials.length === 0) {
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
            cacheInfo={cacheInfo}
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
            allTags={allTags || []}
            baseOptions={baseOptions || []}
            categories={categories || []}
            loading={isCategoriesLoading}
          />
          
          <DatabaseResultsCard
            filteredMaterials={filteredMaterials || []}
            resetFilters={resetFilters}
            materialCount={materialCount || 0}
            totalCount={totalMaterials || 0}
            loading={loading && filteredMaterials.length > 0}
          />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination
                currentPage={pagination.page}
                totalPages={totalPages}
                onPageChange={handlePaginationChange}
                siblingCount={1}
              />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundaryWrapper>
  );
};

export default MaterialDatabase;
