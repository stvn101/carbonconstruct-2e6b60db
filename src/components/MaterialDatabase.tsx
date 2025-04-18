
import React from "react";
import { Database, Filter } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useRegion } from "@/contexts/RegionContext";
import RegionStats from "@/components/materials/RegionStats";
import MaterialFilters from "@/components/materials/MaterialFilters";
import MaterialTable from "@/components/materials/MaterialTable";
import { useMaterialFiltering } from "@/hooks/useMaterialFiltering";

const MaterialDatabase = () => {
  const { selectedRegion: globalRegion } = useRegion();
  const {
    // Filter states
    searchTerm,
    setSearchTerm,
    selectedRegion,
    setSelectedRegion,
    selectedAlternative,
    setSelectedAlternative,
    selectedTag,
    setSelectedTag,
    
    // Results and data
    filteredMaterials,
    materialsByRegion,
    allTags,
    allRegions,
    baseOptions,
    resetFilters,
    materialCount,
    totalMaterials
  } = useMaterialFiltering();

  return (
    <div className="container mx-auto px-4 py-8 content-top-spacing">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-carbon-100">
              <Database className="h-6 w-6 text-carbon-700" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {globalRegion === "National" 
              ? "Material Database" 
              : `${globalRegion} Material Database`}
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore our comprehensive database of construction materials with accurate carbon coefficients
            {globalRegion !== "National" && ` for ${globalRegion}`}
          </p>
          
          <RegionStats materialsByRegion={materialsByRegion} />
        </div>
        
        {/* Filters Card */}
        <Card className="mb-8 border-carbon-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Search and Filter
            </CardTitle>
            <CardDescription>
              Find specific materials or filter by region, alternatives and tags
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MaterialFilters 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedRegion={selectedRegion}
              setSelectedRegion={setSelectedRegion}
              selectedAlternative={selectedAlternative}
              setSelectedAlternative={setSelectedAlternative}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              allTags={allTags}
              allRegions={allRegions}
              baseOptions={baseOptions}
            />
          </CardContent>
        </Card>
        
        {/* Results Card */}
        <Card className="border-carbon-100">
          <CardHeader>
            <CardTitle>Construction Materials</CardTitle>
            <CardDescription>
              Carbon coefficients and alternatives for sustainable construction in Australia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MaterialTable 
              filteredMaterials={filteredMaterials} 
              resetFilters={resetFilters} 
            />
            
            <p className="text-sm text-muted-foreground mt-2">
              Showing {materialCount} of {totalMaterials} materials
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaterialDatabase;
