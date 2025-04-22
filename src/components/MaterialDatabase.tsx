
import React from "react";
import { BookOpen, Filter } from "lucide-react";
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
import { useMaterialData } from "@/hooks/useMaterialData";
import { ExtendedMaterialData } from "@/lib/materials/materialTypes";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";

const MaterialDatabase = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRegion, setSelectedRegion] = React.useState<string>("all");
  const [selectedAlternative, setSelectedAlternative] = React.useState<string>("none");
  const [selectedTag, setSelectedTag] = React.useState<string>("all");
  const { selectedRegion: globalRegion } = useRegion();
  
  React.useEffect(() => {
    if (selectedRegion === "all") {
      setSelectedRegion("Australia");
    }
  }, []);
  
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

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRegion("Australia");
    setSelectedAlternative("none");
    setSelectedTag("all");
  };

  // Transform materials for the table component
  const materialTableData = filteredMaterials;

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Materials Database | CarbonConstruct</title>
        <meta 
          name="description" 
          content="Browse sustainable building materials and their carbon footprint data."
        />
      </Helmet>
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 content-top-spacing">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-carbon-100">
                <BookOpen className="h-6 w-6 text-carbon-700" />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              Material Database
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our comprehensive database of construction materials with accurate carbon coefficients for Australia
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
                filteredMaterials={materialTableData} 
                resetFilters={resetFilters} 
              />
              
              <p className="text-sm text-muted-foreground mt-2">
                Showing {materialCount} of {materialCount} materials
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default MaterialDatabase;
