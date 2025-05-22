
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { ExtendedMaterialData } from "@/lib/materials/materialTypes";
import MaterialFilters from "./MaterialFilters";
import MaterialGrid from "./MaterialGrid";
import AdvancedMaterialSearch, { SearchParams } from "./AdvancedMaterialSearch";
import DatabaseHeader from "./components/DatabaseHeader";
import SearchBar from "./components/SearchBar";
import DatabaseErrorState from "./components/DatabaseErrorState";
import DatabaseStats from "./components/DatabaseStats";
import { useAdvancedMaterialSearch } from "@/hooks/useAdvancedMaterialSearch";

interface MaterialDatabaseContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedAlternative: string;
  setSelectedAlternative: (alternative: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  materials: ExtendedMaterialData[] | null;
  filteredMaterials: ExtendedMaterialData[];
  loading: boolean;
  error: Error | null;
  refreshCache: () => Promise<void>;
  cacheStats: { lastUpdated: Date | null; itemCount: number | null };
  categoriesList: string[];
  materialsByRegion: Record<string, number>;
  allTags: string[];
  baseOptions: Array<{ id: string; name: string }>;
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
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use our custom hook for advanced search
  const { 
    useAdvancedSearch, 
    advancedFilteredMaterials, 
    toggleAdvancedSearch, 
    handleAdvancedSearch, 
    resetAdvancedSearch 
  } = useAdvancedMaterialSearch({
    materials,
    onResetFilters: resetFilters
  });

  // Effect to check if we have enough materials
  useEffect(() => {
    if (materials && materials.length < 20 && !loading && !error) {
      // Show a warning if we have too few materials
      toast.warning(
        "Limited materials database detected. Some features may be restricted.", 
        { 
          id: "limited-materials-warning",
          duration: 8000,
          action: {
            label: "Refresh",
            onClick: () => handleRefresh()
          }
        }
      );
    }
  }, [materials, loading, error]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleResetFilters = () => {
    resetFilters();
    resetAdvancedSearch();
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshCache();
    } catch (error) {
      console.error("Failed to refresh materials:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Determine which materials to display
  const displayedMaterials = useAdvancedSearch && advancedFilteredMaterials.length > 0
    ? advancedFilteredMaterials
    : filteredMaterials;

  return (
    <div className="container mx-auto px-4 py-8">
      <DatabaseHeader 
        itemCount={cacheStats.itemCount}
        loading={loading}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        useAdvancedSearch={useAdvancedSearch}
        onToggleAdvancedSearch={toggleAdvancedSearch}
      />

      {useAdvancedSearch ? (
        <div className="mb-6">
          <AdvancedMaterialSearch
            onSearch={handleAdvancedSearch}
            categories={categoriesList}
            regions={Object.keys(materialsByRegion)}
            tags={allTags}
            materialCount={materials?.length || 0}
            onResetFilters={handleResetFilters}
          />
        </div>
      ) : (
        <div className="mb-6">
          <MaterialFilters 
            categoriesList={categoriesList} 
            materialsByRegion={materialsByRegion} 
          />
        </div>
      )}

      {error ? (
        <DatabaseErrorState error={error} onRefresh={handleRefresh} />
      ) : (
        <>
          <DatabaseStats
            displayedCount={displayedMaterials.length}
            totalCount={materials?.length || 0}
            lastUpdated={cacheStats.lastUpdated}
          />

          <MaterialGrid 
            materials={displayedMaterials}
            loading={loading || isRefreshing}
          />
        </>
      )}
    </div>
  );
};

export default MaterialDatabaseContent;
