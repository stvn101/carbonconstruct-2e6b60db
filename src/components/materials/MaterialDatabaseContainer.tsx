
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRegion } from "@/contexts/RegionContext";
import { useMaterialCache } from "@/hooks/useMaterialCache";
import { useMaterialData } from "@/hooks/useMaterialData";
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";
import MaterialDatabaseContent from "./database/MaterialDatabaseContent";
import { toast } from "sonner";

const MaterialDatabaseContainer: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedAlternative, setSelectedAlternative] = React.useState<string>("none");
  const [selectedTag, setSelectedTag] = React.useState<string>("all");
  const { selectedRegion } = useRegion();
  const [loadAttempts, setLoadAttempts] = React.useState(0);
  
  // Add console debug for initial render
  useEffect(() => {
    console.log("MaterialDatabaseContainer rendered");
  }, []);
  
  // Use the material cache hook for efficient data loading
  const { materials, loading, error, refreshCache, cacheStats } = useMaterialCache();
  
  // Log materials when they change
  useEffect(() => {
    console.log("Materials changed:", { 
      count: materials?.length || 0, 
      hasError: !!error,
      isLoading: loading
    });
    
    // Auto-retry if we have an error and no materials, with limit on retries
    if (error && (!materials || materials.length === 0) && loadAttempts < 3) {
      console.log(`Auto-retrying material load due to error (attempt ${loadAttempts + 1})`);
      
      const retryTimer = setTimeout(() => {
        setLoadAttempts(prev => prev + 1);
        refreshCache().catch(err => {
          console.error("Auto-retry failed:", err);
        });
      }, 5000 * Math.pow(2, loadAttempts)); // Exponential backoff
      
      return () => clearTimeout(retryTimer);
    }
  }, [materials, error, loading, refreshCache, loadAttempts]);
  
  // Use the material data hook for organizing and categorizing data
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
    materials
  });
  
  // Filters and state management
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedAlternative("none");
    setSelectedTag("all");
  };
  
  // Manual refresh handler with UX feedback
  const handleManualRefresh = (): Promise<void> => {
    toast.info("Refreshing materials data...");
    return refreshCache()
      .then(() => {
        toast.success("Materials data refreshed successfully!");
      })
      .catch(err => {
        console.error("Manual refresh failed:", err);
        toast.error("Failed to refresh materials. Please try again later.");
      });
  };
  
  // Extract categories from materials
  const categoriesList = React.useMemo(() => {
    if (!materials || materials.length === 0) return [];
    
    return Array.from(
      new Set(
        materials
          .map(m => m.category || 'Uncategorized')
          .filter(Boolean)
      )
    ).sort();
  }, [materials]);

  // Show toast if materials are empty but not loading
  useEffect(() => {
    if (!loading && (!materials || materials.length === 0)) {
      // Only show toast once we've tried multiple times
      if (loadAttempts > 1) {
        toast.error("No materials data available. Please refresh to try again.", {
          id: "no-materials-data",
          duration: 5000,
          action: {
            label: "Refresh",
            onClick: handleManualRefresh
          }
        });
      }
    }
  }, [loading, materials, loadAttempts]);

  return (
    <ErrorBoundaryWrapper feature="Material Database">
      <motion.div
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <MaterialDatabaseContent
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedAlternative={selectedAlternative}
          setSelectedAlternative={setSelectedAlternative}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          materials={materials}
          filteredMaterials={filteredMaterials}
          loading={loading}
          error={error}
          refreshCache={handleManualRefresh}
          cacheStats={cacheStats}
          categoriesList={categoriesList}
          materialsByRegion={materialsByRegion}
          allTags={allTags}
          baseOptions={baseOptions}
          materialCount={materialCount}
          resetFilters={resetFilters}
        />
      </motion.div>
    </ErrorBoundaryWrapper>
  );
};

export default MaterialDatabaseContainer;
