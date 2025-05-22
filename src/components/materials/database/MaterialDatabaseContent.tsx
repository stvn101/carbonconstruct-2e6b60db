
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, RefreshCw, AlertTriangle, Database } from "lucide-react";
import MaterialFilters from "./MaterialFilters";
import MaterialGrid from "./MaterialGrid";
import { ExtendedMaterialData } from "@/lib/materials/materialTypes";
import { formatDate } from "@/lib/formatters";
import AdvancedMaterialSearch, { SearchParams } from "./AdvancedMaterialSearch";
import { toast } from "sonner";

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
  const [useAdvancedSearch, setUseAdvancedSearch] = useState(false);
  const [advancedFilteredMaterials, setAdvancedFilteredMaterials] = useState<ExtendedMaterialData[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const handleAdvancedSearch = (searchParams: SearchParams) => {
    if (!materials) return;
    
    // Apply advanced search filters
    const filteredMaterials = materials.filter(material => {
      // Apply text search
      const matchesTerm = !searchParams.term || 
        material.name?.toLowerCase().includes(searchParams.term.toLowerCase()) ||
        material.description?.toLowerCase().includes(searchParams.term.toLowerCase()) ||
        material.category?.toLowerCase().includes(searchParams.term.toLowerCase());
      
      // Apply category filter
      const matchesCategory = searchParams.categories.length === 0 || 
        (material.category && searchParams.categories.includes(material.category));
      
      // Apply region filter
      const matchesRegion = searchParams.regions.length === 0 || 
        (material.region && searchParams.regions.includes(material.region));
      
      // Apply tag filter
      const matchesTags = searchParams.tags.length === 0 || 
        (material.tags && material.tags.some(tag => searchParams.tags.includes(tag)));
      
      // Apply carbon range filter
      const carbonFootprint = material.carbon_footprint_kgco2e_kg || 0;
      const matchesCarbon = carbonFootprint >= searchParams.carbonRange[0] && 
                           carbonFootprint <= searchParams.carbonRange[1];
      
      // Apply sustainability score filter
      const sustainabilityScore = material.sustainabilityScore || 0;
      const matchesSustainability = sustainabilityScore >= searchParams.sustainabilityScore[0] && 
                                   sustainabilityScore <= searchParams.sustainabilityScore[1];
      
      // Apply recyclability filter
      const matchesRecyclability = searchParams.recyclability.length === 0 || 
        (material.recyclability && searchParams.recyclability.includes(material.recyclability));
      
      // Apply alternatives filter
      const matchesAlternatives = !searchParams.showOnlyAlternatives || 
        (material.alternativeTo && material.alternativeTo.length > 0);
      
      return matchesTerm && matchesCategory && matchesRegion && matchesTags && 
             matchesCarbon && matchesSustainability && matchesRecyclability &&
             matchesAlternatives;
    });
    
    setAdvancedFilteredMaterials(filteredMaterials);
  };

  const handleResetFilters = () => {
    resetFilters();
    setAdvancedFilteredMaterials([]);
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

  const displayedMaterials = useAdvancedSearch && advancedFilteredMaterials.length > 0
    ? advancedFilteredMaterials
    : filteredMaterials;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Database className="h-6 w-6 mr-2 text-carbon-600" />
            Materials Database
          </h1>
          <p className="text-muted-foreground mt-1">
            Explore our database of sustainable construction materials
          </p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center">
          <Badge variant="outline" className="mr-4">
            {cacheStats.itemCount || 0} materials
          </Badge>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={loading || isRefreshing}
            className="flex items-center"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${(loading || isRefreshing) ? 'animate-spin' : ''}`} />
            {loading || isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Search and Advanced Search Toggle */}
      <div className="mb-6 flex items-center justify-between">
        {!useAdvancedSearch && (
          <div className="relative flex-1 mr-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>
        )}
        <Button 
          variant={useAdvancedSearch ? "default" : "outline"} 
          onClick={() => setUseAdvancedSearch(!useAdvancedSearch)}
        >
          {useAdvancedSearch ? "Simple Search" : "Advanced Search"}
        </Button>
      </div>

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
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center text-red-500 mb-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-medium">Error loading materials</h3>
            </div>
            <p className="text-muted-foreground">{error.message}</p>
            <p className="text-sm text-muted-foreground mt-2">
              This might be due to database access restrictions or connectivity issues.
            </p>
            <Button variant="outline" className="mt-4" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            Showing {displayedMaterials.length} of {materials?.length || 0} materials. 
            {cacheStats.lastUpdated && (
              <span> Last updated: {formatDate(cacheStats.lastUpdated)}</span>
            )}
          </p>

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
