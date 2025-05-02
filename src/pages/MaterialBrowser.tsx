
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createExtendedMaterialDB, EnrichedMaterial } from "@/utils/materialUtils";
import MaterialsBrowseTab from "@/components/materials/browser/MaterialsBrowseTab";
import MaterialsCompareTab from "@/components/materials/browser/MaterialsCompareTab";
import AlternativesComparisonSection from "@/components/materials/browser/AlternativesComparisonSection";
import { useIsMobile } from "@/hooks/use-mobile";

const MaterialBrowser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAlternativesOnly, setShowAlternativesOnly] = useState(false);
  const [sortField, setSortField] = useState<keyof EnrichedMaterial>("factor");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [materialComparisonData, setMaterialComparisonData] = useState<any[]>([]);
  const isMobile = useIsMobile();

  const EXTENDED_MATERIAL_DB = createExtendedMaterialDB();
  const allCategories = Array.from(new Set(EXTENDED_MATERIAL_DB.map(m => m.category)));

  const filteredMaterials = EXTENDED_MATERIAL_DB.filter(material => {
    const matchesSearch = searchTerm === "" || 
      material.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.includes(material.category);
    
    const matchesAlternatives = !showAlternativesOnly || material.alternativeToStandard;
    
    return matchesSearch && matchesCategory && matchesAlternatives;
  });

  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    const fieldA = a[sortField];
    const fieldB = b[sortField];
    if (fieldA < fieldB) return sortDirection === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof EnrichedMaterial) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  useEffect(() => {
    const categorizedData: Record<string, { count: number, totalFactor: number, totalScore: number }> = {};
    
    EXTENDED_MATERIAL_DB.forEach(material => {
      if (!categorizedData[material.category]) {
        categorizedData[material.category] = { count: 0, totalFactor: 0, totalScore: 0 };
      }
      
      categorizedData[material.category].count += 1;
      categorizedData[material.category].totalFactor += material.factor;
      categorizedData[material.category].totalScore += material.sustainabilityScore;
    });
    
    const chartData = Object.entries(categorizedData).map(([category, data]) => ({
      name: category,
      emissionFactor: +(data.totalFactor / data.count).toFixed(2),
      sustainabilityScore: +(data.totalScore / data.count).toFixed(0)
    }));
    
    setMaterialComparisonData(chartData);
  }, []);

  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Material Database | CarbonConstruct</title>
        <meta 
          name="description" 
          content="Browse and compare construction materials and their carbon footprint data."
        />
      </Helmet>
      <Navbar />
      <main className="flex-grow py-10 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Material Database</h1>
              <p className="text-muted-foreground">
                Browse and compare construction materials and their carbon footprints
              </p>
            </div>
          </div>

          <Tabs defaultValue="browse" className="mb-6">
            <TabsList>
              <TabsTrigger value="browse" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                Browse Materials
              </TabsTrigger>
              <TabsTrigger value="compare" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                Compare Categories
              </TabsTrigger>
              <TabsTrigger value="alternatives" className="data-[state=active]:bg-carbon-500 data-[state=active]:text-white">
                Sustainable Alternatives
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="browse" className="mt-6">
              <MaterialsBrowseTab 
                allCategories={allCategories}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                showAlternativesOnly={showAlternativesOnly}
                setShowAlternativesOnly={setShowAlternativesOnly}
                sortedMaterials={sortedMaterials}
                sortField={sortField}
                sortDirection={sortDirection}
                handleSort={handleSort}
                totalMaterialCount={EXTENDED_MATERIAL_DB.length}
              />
            </TabsContent>
            
            <TabsContent value="compare" className="mt-6">
              <MaterialsCompareTab materialComparisonData={materialComparisonData} />
            </TabsContent>
            
            <TabsContent value="alternatives" className="mt-6">
              <AlternativesComparisonSection />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </motion.div>
  );
};

export default MaterialBrowser;
