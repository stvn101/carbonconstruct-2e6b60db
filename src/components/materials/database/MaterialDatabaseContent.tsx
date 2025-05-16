
import React from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import DatabaseHeader from '../DatabaseHeader';
import DatabaseFilterCard from '../DatabaseFilterCard';
import DatabaseResultsCard from '../DatabaseResultsCard';
import MaterialLoadingState from './MaterialLoadingState';
import MaterialErrorState from './MaterialErrorState';

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
  // Track whether a refresh is in progress
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  // Handle refresh with loading state
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshCache();
    } finally {
      setIsRefreshing(false);
    }
  };

  // If there's an error, show the error state
  if (error && (!materials || materials.length === 0)) {
    return (
      <MaterialErrorState 
        error={error} 
        onRetry={handleRefresh} 
        isRefreshing={isRefreshing}
      />
    );
  }

  // If loading without any cached materials, show loading state
  if (loading && (!materials || materials.length === 0)) {
    return <MaterialLoadingState />;
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      {/* Database header with title and statistics */}
      <DatabaseHeader 
        globalRegion="Australia"
        materialsByRegion={materialsByRegion}
        cacheInfo={cacheStats}
      />
      
      {/* Refresh data button */}
      <div className="flex justify-center mb-8">
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing || loading}
          variant="outline"
          size="sm"
          className="text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 mr-2 ${(isRefreshing || loading) ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
      
      {/* Filter card */}
      <DatabaseFilterCard 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedAlternative={selectedAlternative}
        setSelectedAlternative={setSelectedAlternative}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
        allTags={allTags}
        baseOptions={baseOptions}
        categories={categoriesList}
        loading={loading && materials.length === 0}
      />
      
      {/* Results card */}
      <DatabaseResultsCard 
        filteredMaterials={filteredMaterials}
        resetFilters={resetFilters}
        materialCount={materialCount}
        totalCount={materials?.length || 0}
        loading={loading}
      />
    </div>
  );
};

export default MaterialDatabaseContent;
