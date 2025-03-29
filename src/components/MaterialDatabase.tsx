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
import { Database, Filter, Search } from "lucide-react";
import { MATERIAL_FACTORS } from "@/lib/carbonCalculations";

interface ExtendedMaterialData {
  name: string;
  factor: number;
  unit: string;
  region?: string;
  alternativeTo?: string;
  notes?: string;
}

const EXTENDED_MATERIALS: Record<string, ExtendedMaterialData> = {
  ...MATERIAL_FACTORS as Record<string, ExtendedMaterialData>,
  recycledSteel: {
    name: "Recycled Steel",
    factor: 0.63, // kg CO2e per kg (significantly lower than virgin steel)
    unit: "kg",
    region: "Global",
    alternativeTo: "steel",
    notes: "Using recycled steel can reduce emissions by up to 60% compared to virgin steel."
  },
  bamboo: {
    name: "Bamboo",
    factor: 0.18, // kg CO2e per kg
    unit: "kg",
    region: "Asia, South America",
    alternativeTo: "timber",
    notes: "Fast-growing, renewable material with excellent carbon sequestration properties."
  },
  hempcrete: {
    name: "Hempcrete",
    factor: 0.035, // kg CO2e per kg
    unit: "kg",
    region: "Europe, North America",
    alternativeTo: "concrete",
    notes: "Carbon-negative building material that actually sequesters carbon during its lifetime."
  },
  strawBale: {
    name: "Straw Bale",
    factor: 0.01, // kg CO2e per kg
    unit: "kg",
    region: "Global",
    alternativeTo: "insulation",
    notes: "Excellent thermal properties and very low carbon footprint."
  },
  reclaimedBrick: {
    name: "Reclaimed Brick",
    factor: 0.06, // kg CO2e per kg
    unit: "kg",
    region: "Global",
    alternativeTo: "brick",
    notes: "Reusing existing bricks eliminates the carbon emissions from manufacturing new ones."
  },
  myceliumInsulation: {
    name: "Mycelium Insulation",
    factor: 0.05, // kg CO2e per kg
    unit: "kg",
    region: "North America, Europe",
    alternativeTo: "insulation",
    notes: "Grown from mushroom roots, biodegradable and compostable at end of life."
  },
  massTimber: {
    name: "Mass Timber (CLT)",
    factor: 0.35, // kg CO2e per kg
    unit: "kg",
    region: "Global",
    alternativeTo: "steel",
    notes: "Engineered wood product that can replace steel and concrete in structural applications."
  },
  grasscrete: {
    name: "Grasscrete",
    factor: 0.085, // kg CO2e per kg
    unit: "kg",
    region: "Global",
    alternativeTo: "concrete",
    notes: "Permeable pavement system that allows vegetation to grow through, reducing urban heat island effect."
  }
};

const REGIONS = [
  "Global",
  "North America",
  "Europe",
  "Asia",
  "South America",
  "Africa",
  "Australia"
];

const MaterialDatabase = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedAlternative, setSelectedAlternative] = useState<string>("");
  
  const baseOptions = Object.entries(MATERIAL_FACTORS).map(([key, value]) => ({
    id: key,
    name: value.name
  }));

  const filteredMaterials = Object.entries(EXTENDED_MATERIALS).filter(([key, material]) => {
    const matchesSearch = material.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === "all" || 
      (material.region && material.region.includes(selectedRegion));
    const matchesAlternative = !selectedAlternative || 
      material.alternativeTo === selectedAlternative;
    
    return matchesSearch && matchesRegion && matchesAlternative;
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
          <h1 className="text-3xl font-bold mb-2">Material Database</h1>
          <p className="text-lg text-muted-foreground">
            Explore our comprehensive database of construction materials with accurate carbon coefficients
          </p>
        </div>
        
        <Card className="mb-8 border-carbon-100">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="h-5 w-5 mr-2" />
              Search and Filter
            </CardTitle>
            <CardDescription>
              Find specific materials or filter by region and alternatives
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
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
                    <SelectItem value="">All Materials</SelectItem>
                    {baseOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
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
              Carbon coefficients and alternatives for sustainable construction
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
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.map(([key, material]) => (
                  <TableRow key={key} className={material.alternativeTo ? "bg-carbon-50" : ""}>
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
                    setSelectedAlternative("");
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
