
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Filter, Search, Info } from "lucide-react";
import { MATERIAL_FACTORS } from "@/lib/carbonCalculations";

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
    region: "Global",
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
  // Australian-specific materials
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
  
  // Extract all unique tags
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
  
  // Count materials by region for the stats display
  const materialsByRegion: Record<string, number> = {};
  Object.values(EXTENDED_MATERIALS).forEach(material => {
    if (material.region) {
      const regions = material.region.split(", ");
      regions.forEach(region => {
        materialsByRegion[region] = (materialsByRegion[region] || 0) + 1;
      });
    }
  });

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
          
          {/* Region stats display */}
          <div className="flex flex-wrap justify-center mt-4 gap-2">
            {Object.entries(materialsByRegion).map(([region, count]) => (
              <Badge 
                key={region} 
                variant="outline"
                className={`px-3 py-1 ${region === 'Australia' ? 'bg-carbon-100' : ''}`}
              >
                {region}: {count} materials
              </Badge>
            ))}
          </div>
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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <label htmlFor="search" className="text-sm font-medium">
                  Search Materials
                </label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    type="text" 
                    placeholder="Search by name..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="region" className="text-sm font-medium">
                  Filter by Region
                </label>
                <Select
                  value={selectedRegion}
                  onValueChange={setSelectedRegion}
                >
                  <SelectTrigger id="region">
                    <SelectValue placeholder="All Regions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    {REGIONS.map((region) => (
                      <SelectItem key={region} value={region}>
                        {region}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="alternative" className="text-sm font-medium">
                  Show Alternatives For
                </label>
                <Select
                  value={selectedAlternative}
                  onValueChange={setSelectedAlternative}
                >
                  <SelectTrigger id="alternative">
                    <SelectValue placeholder="All Materials" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">All Materials</SelectItem>
                    {baseOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="tag" className="text-sm font-medium">
                  Filter by Tag
                </label>
                <Select
                  value={selectedTag}
                  onValueChange={setSelectedTag}
                >
                  <SelectTrigger id="tag">
                    <SelectValue placeholder="All Tags" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tags</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        {tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
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
            <Table>
              <TableCaption>
                Comprehensive database of construction materials and their carbon footprints.
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Material</TableHead>
                  <TableHead className="text-right">Carbon Factor (kg CO2e/{"{unit}"})</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Alternative For</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map(([key, material]) => (
                  <TableRow key={key} className={material.region?.includes("Australia") ? "bg-carbon-50" : ""}>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell className="text-right">
                      {material.factor} ({material.unit})
                    </TableCell>
                    <TableCell>
                      {material.region || "Global"}
                    </TableCell>
                    <TableCell>
                      {material.alternativeTo ? 
                        MATERIAL_FACTORS[material.alternativeTo as keyof typeof MATERIAL_FACTORS]?.name : 
                        ""}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {material.tags?.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={material.notes}>
                      {material.notes || ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredMaterials.length === 0 && (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No materials found matching your search criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedRegion("all");
                    setSelectedAlternative("none");
                    setSelectedTag("all");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MaterialDatabase;
