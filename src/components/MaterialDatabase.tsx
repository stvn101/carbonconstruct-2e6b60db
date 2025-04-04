import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Database, Filter } from "lucide-react";
import { MATERIAL_FACTORS } from "@/lib/carbonCalculations";
import RegionStats from "@/components/materials/RegionStats";
import MaterialFilters from "@/components/materials/MaterialFilters";
import MaterialTable from "@/components/materials/MaterialTable";

interface ExtendedMaterialData {
  name: string;
  factor: number;
  unit: string;
  region?: string;
  alternativeTo?: string;
  notes?: string;
  tags?: string[];
}

const EXTENDED_MATERIALS: Record<string, ExtendedMaterialData> = {
  ...MATERIAL_FACTORS as Record<string, ExtendedMaterialData>,
  recycledSteel: {
    name: "Recycled Steel",
    factor: 0.63, // kg CO2e per kg (significantly lower than virgin steel)
    unit: "kg",
    region: "Global, Australia",
    alternativeTo: "steel",
    notes: "Using recycled steel can reduce emissions by up to 60% compared to virgin steel.",
    tags: ["recycled", "metal", "structural"]
  },
  bamboo: {
    name: "Bamboo",
    factor: 0.18, // kg CO2e per kg
    unit: "kg",
    region: "Asia, Australia",
    alternativeTo: "timber",
    notes: "Fast-growing, renewable material with excellent carbon sequestration properties.",
    tags: ["renewable", "sustainable", "fast-growing"]
  },
  hempcrete: {
    name: "Hempcrete",
    factor: 0.035, // kg CO2e per kg
    unit: "kg",
    region: "Europe, North America, Australia",
    alternativeTo: "concrete",
    notes: "Carbon-negative building material that actually sequesters carbon during its lifetime.",
    tags: ["carbon-negative", "insulation", "walls"]
  },
  strawBale: {
    name: "Straw Bale",
    factor: 0.01, // kg CO2e per kg
    unit: "kg",
    region: "Global, Australia",
    alternativeTo: "insulation",
    notes: "Excellent thermal properties and very low carbon footprint. Used in sustainable Australian homes.",
    tags: ["insulation", "natural", "passive"]
  },
  reclaimedBrick: {
    name: "Reclaimed Brick",
    factor: 0.06, // kg CO2e per kg
    unit: "kg",
    region: "Global, Australia",
    alternativeTo: "brick",
    notes: "Reusing existing bricks eliminates the carbon emissions from manufacturing new ones.",
    tags: ["recycled", "historic", "walls"]
  },
  myceliumInsulation: {
    name: "Mycelium Insulation",
    factor: 0.05, // kg CO2e per kg
    unit: "kg",
    region: "North America, Europe, Australia",
    alternativeTo: "insulation",
    notes: "Grown from mushroom roots, biodegradable and compostable at end of life.",
    tags: ["biodegradable", "natural", "insulation"]
  },
  massTimber: {
    name: "Mass Timber (CLT)",
    factor: 0.35, // kg CO2e per kg
    unit: "kg",
    region: "Global, Australia",
    alternativeTo: "steel",
    notes: "Engineered wood product that can replace steel and concrete in structural applications.",
    tags: ["engineered", "structural", "sustainable"]
  },
  grasscrete: {
    name: "Grasscrete",
    factor: 0.085, // kg CO2e per kg
    unit: "kg",
    region: "Global, Australia",
    alternativeTo: "concrete",
    notes: "Permeable pavement system that allows vegetation to grow through, reducing urban heat island effect.",
    tags: ["permeable", "pavement", "green"]
  },
  bluesteelRebar: {
    name: "BlueSteel Rebar (Australian)",
    factor: 0.95, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "steel",
    notes: "Lower carbon Australian reinforcement steel produced using clean energy sources.",
    tags: ["australian", "steel", "structural"]
  },
  recycledConcrete: {
    name: "Recycled Concrete Aggregate (AUS)",
    factor: 0.043, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "concrete",
    notes: "Made from crushed construction waste, reducing landfill and lowering carbon footprint.",
    tags: ["australian", "recycled", "concrete"]
  },
  ausTimber: {
    name: "Australian Hardwood",
    factor: 0.35, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "timber",
    notes: "Sustainably sourced from Australian forests with strong carbon storage properties.",
    tags: ["australian", "sustainable", "hardwood"]
  },
  ausBrick: {
    name: "Australian Clay Brick",
    factor: 0.22, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "brick",
    notes: "Locally produced bricks with lower transport emissions and improved thermal properties.",
    tags: ["australian", "thermal", "durable"]
  },
  greenConcrete: {
    name: "Green Concrete (Geopolymer)",
    factor: 0.062, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "concrete",
    notes: "Australian-developed geopolymer concrete using industrial waste materials instead of Portland cement.",
    tags: ["australian", "low-carbon", "innovative"]
  },
  bambooCladding: {
    name: "Bamboo Cladding",
    factor: 0.15, // kg CO2e per kg
    unit: "kg",
    region: "Australia, Asia",
    alternativeTo: "timber",
    notes: "Rapidly renewable cladding material grown in Australia with excellent durability.",
    tags: ["australian", "cladding", "renewable"]
  },
  rammed: {
    name: "Rammed Earth",
    factor: 0.025, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "concrete",
    notes: "Traditional Australian earth building technique with very low embodied carbon.",
    tags: ["australian", "natural", "walls"]
  },
  hempcretePanels: {
    name: "Hempcrete Panels (AUS)",
    factor: 0.03, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "insulation",
    notes: "Australian-made prefabricated panels for quick installation and carbon sequestration.",
    tags: ["australian", "prefab", "insulation"]
  },
  pvcPipe: {
    name: "PVC Pipes (AUS)",
    factor: 0.24, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "",
    notes: "Common Australian plumbing material with moderate carbon footprint.",
    tags: ["australian", "plumbing", "pipes"]
  },
  pprPipe: {
    name: "PP-R Pipes (AUS)",
    factor: 0.18, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "pvcPipe",
    notes: "Lower carbon alternative to PVC piping systems used in Australian plumbing.",
    tags: ["australian", "plumbing", "pipes"]
  },
  copperPipe: {
    name: "Copper Pipes (AUS)",
    factor: 2.1, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "",
    notes: "Premium Australian plumbing material with higher carbon footprint but excellent durability.",
    tags: ["australian", "plumbing", "pipes", "durable"]
  },
  recycledCopperPipe: {
    name: "Recycled Copper Pipes (AUS)",
    factor: 0.87, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "copperPipe",
    notes: "Recycled copper pipes that significantly reduce embodied carbon compared to virgin copper.",
    tags: ["australian", "plumbing", "pipes", "recycled"]
  },
  hdpePipe: {
    name: "HDPE Pipes (AUS)",
    factor: 0.22, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "pvcPipe",
    notes: "Durable polyethylene pipes often used for Australian water supply systems.",
    tags: ["australian", "plumbing", "pipes", "durable"]
  },
  glasswoolInsulation: {
    name: "Glass Wool Insulation (AUS)",
    factor: 0.58, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "",
    notes: "Common thermal insulation in Australian homes, often containing recycled glass.",
    tags: ["australian", "insulation", "thermal"]
  },
  rockwoolInsulation: {
    name: "Rockwool Insulation (AUS)",
    factor: 0.63, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "glasswoolInsulation",
    notes: "Fire-resistant mineral wool insulation manufactured in Australia.",
    tags: ["australian", "insulation", "fire-resistant"]
  },
  polyesterInsulation: {
    name: "Polyester Insulation (AUS)",
    factor: 0.91, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "glasswoolInsulation",
    notes: "Non-allergenic insulation option made from recycled plastic bottles in Australia.",
    tags: ["australian", "insulation", "recycled"]
  },
  sheepWoolInsulation: {
    name: "Sheep Wool Insulation (AUS)",
    factor: 0.22, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "glasswoolInsulation",
    notes: "Natural insulation from Australian sheep farms with excellent moisture management properties.",
    tags: ["australian", "insulation", "natural", "renewable"]
  },
  cellulose: {
    name: "Cellulose Insulation (AUS)",
    factor: 0.12, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "glasswoolInsulation",
    notes: "Made from recycled paper treated with fire retardants, common in sustainable Australian buildings.",
    tags: ["australian", "insulation", "recycled"]
  },
  expandedCorkInsulation: {
    name: "Expanded Cork Insulation (AUS)",
    factor: 0.19, // kg CO2e per kg
    unit: "kg",
    region: "Australia",
    alternativeTo: "glasswoolInsulation",
    notes: "Natural, renewable cork insulation with excellent acoustic properties for Australian homes.",
    tags: ["australian", "insulation", "natural", "acoustic"]
  }
};

const REGIONS = [
  "Global",
  "Australia",
  "North America",
  "Europe",
  "Asia",
  "South America",
  "Africa"
];

const MaterialDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedAlternative, setSelectedAlternative] = useState<string>("none");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  
  const baseOptions = Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
    id: key,
    name: value.name
  }));
  
  const allTags = Array.from(
    new Set(
      Object.values(EXTENDED_MATERIALS)
        .flatMap(material => material.tags || [])
    )
  ).sort();

  const filteredMaterials = Object.entries(EXTENDED_MATERIALS).filter(([key, material]) => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || 
      (material.region && material.region.includes(selectedRegion));
    const matchesAlternative = selectedAlternative === "none" || 
      material.alternativeTo === selectedAlternative;
    const matchesTag = selectedTag === "all" ||
      (material.tags && material.tags.includes(selectedTag));
    
    return matchesSearch && matchesRegion && matchesAlternative && matchesTag;
  });
  
  const materialsByRegion: Record<string, number> = {};
  Object.values(EXTENDED_MATERIALS).forEach(material => {
    if (material.region) {
      const regions = material.region.split(", ");
      regions.forEach(region => {
        materialsByRegion[region] = (materialsByRegion[region] || 0) + 1;
      });
    }
  });

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedRegion("all");
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
          <h1 className="text-3xl font-bold mb-2">Australian Material Database</h1>
          <p className="text-lg text-muted-foreground">
            Explore our comprehensive database of construction materials with accurate carbon coefficients
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
              allRegions={REGIONS}
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
              Showing {filteredMaterials.length} of {Object.keys(EXTENDED_MATERIALS).length} materials
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaterialDatabase;
