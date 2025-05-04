
import React from "react";
import { motion } from "framer-motion";
import { useRegion } from "@/contexts/RegionContext";
import { useMaterialCache } from "@/hooks/useMaterialCache";
import { useMaterialData } from "@/hooks/useMaterialData";
import ErrorBoundaryWrapper from "@/components/error/ErrorBoundaryWrapper";
import MaterialDatabaseContent from "./database/MaterialDatabaseContent";

const MaterialDatabaseContainer: React.FC = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedAlternative, setSelectedAlternative] = React.useState<string>("none");
  const [selectedTag, setSelectedTag] = React.useState<string>("all");
  const { selectedRegion } = useRegion();
  
  // Use the material cache hook for efficient data loading
  const { materials, loading, error, refreshCache, cacheStats } = useMaterialCache();
  
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
    );
  }, [materials]);

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
