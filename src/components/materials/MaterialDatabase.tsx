
import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Database, Filter } from "lucide-react";
import RegionStats from "@/components/materials/RegionStats";
import MaterialFilters from "@/components/materials/MaterialFilters";
import MaterialTable from "@/components/materials/MaterialTable";
import { useRegion } from "@/contexts/RegionContext";
import { useMaterialData } from "@/hooks/useMaterialData";

const MaterialDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedAlternative, setSelectedAlternative] = useState<string>("none");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const { selectedRegion: globalRegion } = useRegion();
  
  const {
    filteredMaterials,
    materialsByRegion,
    allTags,
    allRegions,
    baseOptions,
    materialCount
  } = useMaterialData({
    searchTerm,
    selectedRegion,
    selectedAlternative,
    selectedTag
  });
  
  // Set the default filter to the global region
  useEffect(() => {
    if (globalRegion !== "Global") {
      setSelectedRegion(globalRegion);
    }
  }, [globalRegion]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRegion(globalRegion !== "Global" ? globalRegion : "all");
    setSelectedAlternative("none");
    setSelectedTag("all");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-carbon-100">
              <Database className="h-6 w-6 text-carbon-700" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">
            {globalRegion === "Global" 
              ? "Material Database" 
              : `${globalRegion} Material Database`}
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore our comprehensive database of construction materials with accurate carbon coefficients
            {globalRegion !== "Global" && ` for ${globalRegion}`}
          </p>
          
          <RegionStats materialsByRegion={materialsByRegion} />
        </div>
        
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
              Showing {filteredMaterials.length} of {materialCount} materials
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaterialDatabase;
