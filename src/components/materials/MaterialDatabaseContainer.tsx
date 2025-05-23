
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useRegion } from "@/contexts/RegionContext";
import { useMaterialCache } from "@/hooks/materialCache";
import { useMaterialData } from "@/hooks/useMaterialData";
import { useBackgroundMaterialRefresh } from "@/hooks/useBackgroundMaterialRefresh";
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";
import MaterialDatabaseContent from "./database/MaterialDatabaseContent";
import { toast } from "sonner";

const MaterialDatabaseContainer: React.FC = () => {
  // Get region context safely - default to Australia if not available
  let region = "Australia"; // Default value
  try {
    const { selectedRegion } = useRegion();
    region = selectedRegion;
  } catch (error) {
    console.log("RegionContext not available, using default region: Australia");
  }
  
  const [loadAttempts, setLoadAttempts] = React.useState(0);
  
  // Use the material cache hook for efficient data loading
  const { materials, loading, error, refreshCache, cacheStats } = useMaterialCache();
  
  // Set up background refresh of materials - DISABLED to prevent constant refreshing
  const { isRefreshing } = useBackgroundMaterialRefresh({
    enabled: false, // Explicitly disable background refresh
    onSuccess: () => {
      console.log("Background refresh completed successfully");
    },
    onError: (err) => {
      console.error("Background refresh failed:", err);
    }
  });
  
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
    materialsByRegion,
    allTags,
    baseOptions,
    materialCount,
    allRegions
  } = useMaterialData({
    searchTerm: "",
    selectedRegion: "Australia", // Always use Australia regardless of context
    selectedAlternative: "none",
    selectedTag: "all",
    materials
  });
  
  // Manual refresh handler with UX feedback that properly returns the Promise
  const handleManualRefresh = (): Promise<void> => {
    toast.info("Refreshing materials data...");
    return refreshCache()
      .then(() => {
        toast.success("Materials data refreshed successfully!");
      })
      .catch(err => {
        console.error("Manual refresh failed:", err);
        toast.error("Failed to refresh materials. Please try again later.");
        return Promise.reject(err); // Make sure to propagate the rejection
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
        className="min-h-screen content-top-spacing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <MaterialDatabaseContent
          searchTerm=""
          setSearchTerm={() => {}}
          selectedAlternative="none"
          setSelectedAlternative={() => {}}
          selectedTag="all"
          setSelectedTag={() => {}}
          materials={materials}
          filteredMaterials={[]}
          loading={loading || isRefreshing}
          error={error}
          refreshCache={handleManualRefresh}
          cacheStats={cacheStats}
          categoriesList={categoriesList}
          materialsByRegion={materialsByRegion}
          allTags={allTags}
          baseOptions={baseOptions}
          materialCount={materialCount}
          resetFilters={() => {}}
        />
      </motion.div>
    </ErrorBoundaryWrapper>
  );
};

export default MaterialDatabaseContainer;
