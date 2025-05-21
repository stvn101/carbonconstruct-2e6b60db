
/**
 * Content component for the material database
 * Displays material data with filtering, sorting, and cache status
 */
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { ExtendedMaterialData } from '@/lib/materials/materialTypes';
import { CacheStats } from '@/hooks/materialCache/types';
import MaterialCacheStatus from './MaterialCacheStatus';
import MaterialsTable from './MaterialsTable';
import MaterialFilters from './MaterialFilters';

interface MaterialDatabaseContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedAlternative: string;
  setSelectedAlternative: (alternative: string) => void;
  selectedTag: string;
  setSelectedTag: (tag: string) => void;
  materials: ExtendedMaterialData[];
  filteredMaterials: ExtendedMaterialData[];
  loading: boolean;
  error: Error | null;
  refreshCache: () => Promise<void>;
  cacheStats: CacheStats;
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
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  // Handle manual refresh with loading state
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshCache();
    } catch (err) {
      console.error("Refresh failed:", err);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-semibold mb-6">Materials Database</h1>
      
      {/* Cache status indicator */}
      <div className="mb-4">
        <MaterialCacheStatus 
          cacheStats={cacheStats}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing || loading}
        />
      </div>
      
      {/* Error message */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>
            Error: {error.message}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Search and filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search materials..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 md:flex gap-2">
            <Select value={selectedAlternative} onValueChange={setSelectedAlternative}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by alternative" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">All Materials</SelectItem>
                <SelectItem value="alternatives">Show Alternatives</SelectItem>
                {baseOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name} Alt.
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedTag} onValueChange={setSelectedTag}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              onClick={resetFilters}
              className="h-10"
            >
              Reset
            </Button>
          </div>
        </div>
        
        {/* Additional filters */}
        <MaterialFilters 
          categoriesList={categoriesList} 
          materialsByRegion={materialsByRegion} 
        />
      </div>
      
      {/* Materials count */}
      <div className="mb-4 text-sm text-muted-foreground">
        Showing {filteredMaterials.length} of {materialCount} materials
      </div>
      
      {/* Materials table with loading state */}
      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      ) : (
        <MaterialsTable materials={filteredMaterials} />
      )}
    </div>
  );
};

export default MaterialDatabaseContent;
