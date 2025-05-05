
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import DatabaseHeader from '../DatabaseHeader';
import DatabaseFilterCard from '../DatabaseFilterCard';
import DatabaseResultsCard from '../DatabaseResultsCard';
import MaterialLoadingState from './MaterialLoadingState';
import MaterialErrorState from './MaterialErrorState';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface MaterialDatabaseContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedAlternative: string;
  setSelectedAlternative: (alternative: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  materials: any[];
  filteredMaterials: any[];
  loading: boolean;
  error: Error | null;
  refreshCache: () => Promise<void>;
  cacheStats: {
    lastUpdated: Date | null;
    itemCount: number | null;
  };
  categoriesList: string[];
  materialsByRegion: Record<string, number>;
  allTags: string[];
  baseOptions: Array<{id: string, name: string}>;
  materialCount: number;
  resetFilters: () => void;
}

const MaterialDatabaseContent: React.FC<MaterialDatabaseContentProps> = ({
  searchTerm,
  setSearchTerm,
  selectedAlternative,
  setSelectedAlternative,
  selectedTag,
  setSelectedTag,
  materials,
  filteredMaterials,
  loading,
  error,
  refreshCache,
  cacheStats,
  categoriesList,
  materialsByRegion,
  allTags,
  baseOptions,
  materialCount,
  resetFilters
}) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [loadTimeout, setLoadTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Handle manual refresh
  const handleRefresh = async () => {
    // Show loading indicator
    toast.loading("Refreshing materials...", { id: "materials-refresh" });
    
    try {
      // Call refresh function
      await refreshCache();
      toast.dismiss("materials-refresh");
      toast.success("Materials refreshed successfully!");
    } catch (err) {
      toast.dismiss("materials-refresh");
      toast.error("Failed to refresh materials.");
      console.error("Refresh error:", err);
    }
  };

  // Set timeout to prevent eternal loading state
  useEffect(() => {
    if (loading && !loadTimeout) {
      const timeout = setTimeout(() => {
        if (materials.length === 0) {
          toast.error("Loading materials timed out. Please try refreshing manually.");
          setIsInitialLoad(false);
        }
      }, 20000); // 20 seconds timeout
      
      setLoadTimeout(timeout);
      
      return () => {
        clearTimeout(timeout);
        setLoadTimeout(null);
      };
    }
    
    return () => {
      if (loadTimeout) {
        clearTimeout(loadTimeout);
        setLoadTimeout(null);
      }
    };
  }, [loading, materials.length, loadTimeout]);
  
  // Mark initial load as complete once materials are loaded
  useEffect(() => {
    if (materials && materials.length > 0 && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [materials, isInitialLoad]);

  // Make sure we have safe arrays to work with
  const safeTags = Array.isArray(allTags) ? allTags : [];
  const safeCategories = Array.isArray(categoriesList) ? categoriesList : [];
  const safeMaterials = Array.isArray(filteredMaterials) ? filteredMaterials : [];
  const safeBaseOptions = Array.isArray(baseOptions) ? baseOptions : [];

  // Show loading state only on initial load
  if ((loading || isInitialLoad) && (!safeMaterials || safeMaterials.length === 0)) {
    return <MaterialLoadingState handleRefresh={handleRefresh} />;
  }
  
  // Show error state only when there's no data at all
  if (error && (!safeMaterials || safeMaterials.length === 0)) {
    return <MaterialErrorState error={error} handleRefresh={handleRefresh} />;
  }

  return (
    <div className="container mx-auto px-4 py-8 content-top-spacing pt-24">
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
            onClick={handleRefresh}
            className="text-xs flex items-center gap-1"
            disabled={loading}
          >
            <RefreshCw className={`h-3 w-3 ${loading ? 'animate-spin' : ''}`} />
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

        {/* Fallback when materials don't load properly */}
        {!loading && safeMaterials.length === 0 && materials.length === 0 && (
          <div className="mt-8 p-6 border rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
            <h3 className="text-lg font-medium mb-2">No materials loaded</h3>
            <p className="mb-4">Try refreshing the materials database using the button below.</p>
            <Button
              onClick={handleRefresh}
              className="bg-carbon-600 hover:bg-carbon-700 text-white"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Materials
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaterialDatabaseContent;
