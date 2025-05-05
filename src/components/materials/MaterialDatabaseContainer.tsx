
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
    
    // Auto-retry if we have an error and no materials
    if (error && (!materials || materials.length === 0)) {
      console.log("Auto-retrying material load due to error");
      const retryTimer = setTimeout(() => {
        refreshCache().catch(err => {
          console.error("Auto-retry failed:", err);
        });
      }, 5000);
      
      return () => clearTimeout(retryTimer);
    }
  }, [materials, error, loading, refreshCache]);
  
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
      toast.error("No materials data available. Please refresh to try again.", {
        id: "no-materials-data",
        duration: 5000,
        action: {
          label: "Refresh",
          onClick: () => refreshCache()
        }
      });
    }
  }, [loading, materials, refreshCache]);

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
          refreshCache={refreshCache}
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
