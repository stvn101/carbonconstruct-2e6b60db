import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Search,
  SlidersHorizontal,
  Database,
  Info,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  BarChart3,
  HelpCircle,
  ArrowRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Material, MATERIAL_FACTORS } from "@/lib/carbonCalculations";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from "recharts";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface EnrichedMaterial {
  type: string;
  factor: number;
  category: string;
  alternativeToStandard: boolean;
  carbonReduction: number;
  sustainabilityScore: number;
  locallySourced: boolean;
  recyclability: "High" | "Medium" | "Low";
}

const EXTENDED_MATERIAL_DB: EnrichedMaterial[] = Object.entries(MATERIAL_FACTORS).map(([key, value]) => {
  const isAlt = key.toLowerCase().includes('recycled') || key.toLowerCase().includes('low-carbon');
  const standardName = isAlt ? key.replace(/recycled |low-carbon |sustainable /i, '') : key;
  
  return {
    type: key,
    factor: value.factor,
    category: getCategory(key),
    alternativeToStandard: isAlt,
    carbonReduction: isAlt ? Math.round(getReductionPercent(key, standardName)) : 0,
    sustainabilityScore: Math.round(getSustainabilityScore(key, value.factor)),
    locallySourced: Math.random() > 0.5,
    recyclability: getRecyclability(key) as "High" | "Medium" | "Low",
  };
});

function getCategory(materialType: string): string {
  const lowerType = materialType.toLowerCase();
  if (lowerType.includes('concrete')) return 'Concrete';
  if (lowerType.includes('steel') || lowerType.includes('metal')) return 'Metals';
  if (lowerType.includes('wood') || lowerType.includes('timber')) return 'Wood';
  if (lowerType.includes('glass')) return 'Glass';
  if (lowerType.includes('plastic')) return 'Plastics';
  if (lowerType.includes('insulation')) return 'Insulation';
  if (lowerType.includes('brick') || lowerType.includes('ceramic') || lowerType.includes('tile')) return 'Ceramics';
  return 'Other';
}

function getReductionPercent(altMaterial: string, standardMaterial: string): number {
  const altMaterialKey = altMaterial as Material;
  const standardMaterialKey = standardMaterial as Material;
  
  const altFactor = MATERIAL_FACTORS[altMaterialKey]?.factor || 0;
  const standardFactor = MATERIAL_FACTORS[standardMaterialKey]?.factor || altFactor;
  
  if (standardFactor === 0) return 0;
  return ((standardFactor - altFactor) / standardFactor) * 100;
}

function getSustainabilityScore(materialType: string, factor: number): number {
  const baseScore = 100 - (factor * 5);
  const lowerType = materialType.toLowerCase();
  let bonus = 0;
  if (lowerType.includes('recycled')) bonus += 20;
  if (lowerType.includes('sustainable')) bonus += 15;
  if (lowerType.includes('low-carbon')) bonus += 25;
  
  return Math.max(10, Math.min(100, baseScore + bonus));
}

function getRecyclability(materialType: string): string {
  const lowerType = materialType.toLowerCase();
  if (lowerType.includes('steel') || lowerType.includes('metal') || lowerType.includes('recycled')) return 'High';
  if (lowerType.includes('wood') || lowerType.includes('paper')) return 'High';
  if (lowerType.includes('concrete')) return 'Medium';
  if (lowerType.includes('plastic')) return 'Low';
  
  const random = Math.random();
  if (random < 0.33) return 'Low';
  if (random < 0.66) return 'Medium';
  return 'High';
}

const MaterialBrowser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAlternativesOnly, setShowAlternativesOnly] = useState(false);
  const [sortField, setSortField] = useState<keyof EnrichedMaterial>("factor");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [materialComparisonData, setMaterialComparisonData] = useState<any[]>([]);
  const isMobile = useIsMobile();

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
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search materials..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-1">Categories</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {allCategories.map(category => (
                              <div key={category} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`category-${category}`}
                                  checked={selectedCategories.includes(category)}
                                  onCheckedChange={(checked) => {
                                    setSelectedCategories(
                                      checked 
                                        ? [...selectedCategories, category]
                                        : selectedCategories.filter(c => c !== category)
                                    );
                                  }}
                                />
                                <label 
                                  htmlFor={`category-${category}`}
                                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {category}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="show-alternatives"
                            checked={showAlternativesOnly}
                            onCheckedChange={(checked) => {
                              setShowAlternativesOnly(!!checked);
                            }}
                          />
                          <label 
                            htmlFor="show-alternatives"
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Show sustainable alternatives only
                          </label>
                        </div>
                        <Button 
                          className="w-full"
                          variant="outline"
                          onClick={() => {
                            setSelectedCategories([]);
                            setShowAlternativesOnly(false);
                            setSearchTerm("");
                          }}
                        >
                          Reset Filters
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Material</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead className="cursor-pointer" onClick={() => handleSort("factor")}>
                        <div className="flex items-center">
                          Emission Factor
                          <SortIndicator 
                            active={sortField === "factor"} 
                            direction={sortDirection} 
                          />
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-3.5 w-3.5 ml-1 text-muted-foreground" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="w-60">Emissions per kg of material (kg CO₂e/kg)</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableHead>
                      <TableHead className="hidden md:table-cell cursor-pointer" onClick={() => handleSort("sustainabilityScore")}>
                        <div className="flex items-center">
                          Sustainability
                          <SortIndicator 
                            active={sortField === "sustainabilityScore"} 
                            direction={sortDirection} 
                          />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedMaterials.map((material) => (
                      <TableRow key={material.type}>
                        <TableCell>
                          <div>
                            {material.type}
                            {material.alternativeToStandard && (
                              <Badge className="ml-2 bg-green-600">Eco</Badge>
                            )}
                          </div>
                          <div className="md:hidden text-xs text-muted-foreground mt-1">
                            {material.category}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">{material.category}</TableCell>
                        <TableCell>
                          {material.factor} kg CO₂e/kg
                          {material.carbonReduction > 0 && (
                            <div className="text-xs text-green-600 font-medium mt-1">
                              {material.carbonReduction}% less CO₂
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                              <div 
                                className="bg-carbon-600 h-2.5 rounded-full" 
                                style={{ width: `${material.sustainabilityScore}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium">{material.sustainabilityScore}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <MaterialDetailsDialog material={material} />
                        </TableCell>
                      </TableRow>
                    ))}
                    {sortedMaterials.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <Database className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                          <p>No materials found matching your filters</p>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                Showing {sortedMaterials.length} of {EXTENDED_MATERIAL_DB.length} materials
              </p>
            </TabsContent>
            
            <TabsContent value="compare" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Category Comparison</CardTitle>
                  <CardDescription>
                    Compare average emission factors and sustainability scores across material categories
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Average Emission Factors</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={materialComparisonData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis label={{ value: 'kg CO₂e/kg', angle: -90, position: 'insideLeft' }} />
                            <RechartsTooltip />
                            <Bar dataKey="emissionFactor" name="Emission Factor" fill="#9b87f5" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        Lower values indicate less carbon impact per kg of material
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-medium mb-4">Average Sustainability Scores</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={materialComparisonData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 100]} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
                            <RechartsTooltip />
                            <Bar dataKey="sustainabilityScore" name="Sustainability Score" fill="#7E69AB" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        Higher scores indicate more sustainable materials
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 bg-carbon-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 mr-2 text-carbon-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium mb-1">Material Selection Tips</h4>
                        <p className="text-sm text-muted-foreground">
                          Materials with lower emission factors and higher sustainability scores are generally better for the environment. 
                          Consider these metrics alongside material performance, cost, and availability when making selection decisions.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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

interface SortIndicatorProps {
  active: boolean;
  direction: "asc" | "desc";
}

const SortIndicator = ({ active, direction }: SortIndicatorProps) => {
  if (!active) {
    return <ArrowUpDown className="ml-1 h-4 w-4" />;
  }
  
  return direction === "asc" 
    ? <ArrowUp className="ml-1 h-4 w-4" />
    : <ArrowDown className="ml-1 h-4 w-4" />;
};

interface MaterialDetailsDialogProps {
  material: EnrichedMaterial;
}

const MaterialDetailsDialog = ({ material }: MaterialDetailsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{material.type}</DialogTitle>
          <DialogDescription>
            Detailed information about this material
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Category</label>
              <p>{material.category}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Emission Factor</label>
              <p>{material.factor} kg CO₂e/kg</p>
            </div>
            <div>
              <label className="text-sm font-medium">Sustainability Score</label>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                  <div 
                    className="bg-carbon-600 h-2.5 rounded-full" 
                    style={{ width: `${material.sustainabilityScore}%` }}
                  ></div>
                </div>
                <span>{material.sustainabilityScore}/100</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Sustainable Alternative</label>
              <p>{material.alternativeToStandard ? 'Yes' : 'No'}</p>
            </div>
            {material.alternativeToStandard && (
              <div>
                <label className="text-sm font-medium">Carbon Reduction</label>
                <p className="text-green-600 font-medium">{material.carbonReduction}% less CO₂</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium">Recyclability</label>
              <Badge 
                variant="outline"
                className={
                  material.recyclability === 'High' 
                    ? 'bg-green-100 text-green-800 border-green-300' 
                    : material.recyclability === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                      : 'bg-red-100 text-red-800 border-red-300'
                }
              >
                {material.recyclability}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium">Locally Sourced Available</label>
              <p>{material.locallySourced ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-carbon-50 p-4 rounded-md mt-2">
          <h4 className="font-medium mb-1">Environmental Impact</h4>
          <p className="text-sm text-muted-foreground">
            {material.factor < 1 
              ? `This material has a relatively low environmental impact compared to others in its category.`
              : material.factor < 5
                ? `This material has a moderate environmental impact. Consider alternatives if available.`
                : `This material has a high environmental impact. Sustainable alternatives should be considered.`
            }
            {material.alternativeToStandard && 
              ` As a sustainable alternative, it offers significant carbon savings compared to conventional options.`
            }
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AlternativesComparisonSection = () => {
  const materialPairs = [] as {standard: EnrichedMaterial, alternative: EnrichedMaterial}[];
  
  EXTENDED_MATERIAL_DB.forEach(material => {
    if (material.alternativeToStandard) {
      const standardName = material.type.replace(/recycled |low-carbon |sustainable /i, '');
      const standard = EXTENDED_MATERIAL_DB.find(m => 
        m.type.toLowerCase() === standardName.toLowerCase() && !m.alternativeToStandard
      );
      
      if (standard) {
        materialPairs.push({
          standard,
          alternative: material
        });
      }
    }
  });

  const comparisonData = materialPairs.map(pair => ({
    name: pair.standard.type,
    standard: pair.standard.factor,
    alternative: pair.alternative.factor,
    reduction: Math.round(((pair.standard.factor - pair.alternative.factor) / pair.standard.factor) * 100)
  }));

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Sustainable Alternatives</CardTitle>
          <CardDescription>
            Compare standard materials with their more sustainable alternatives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-4">Emission Factor Comparison</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={comparisonData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis label={{ value: 'kg CO₂e/kg', angle: -90, position: 'insideLeft' }} />
                  <RechartsTooltip />
                  <Bar dataKey="standard" name="Standard Material" fill="#a3a3a3" />
                  <Bar dataKey="alternative" name="Sustainable Alternative" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <h3 className="text-lg font-medium mb-4">Direct Comparisons</h3>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Standard Material</TableHead>
                  <TableHead>Sustainable Alternative</TableHead>
                  <TableHead>Emission Reduction</TableHead>
                  <TableHead>Sustainability Improvement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materialPairs.map((pair, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{pair.standard.type}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {pair.alternative.type}
                        <Badge className="ml-2 bg-green-600">Eco</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ArrowDown className="h-4 w-4 mr-1 text-green-600" />
                        <span className="font-medium">{Math.round(pair.alternative.carbonReduction)}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 flex items-center gap-1">
                          <span className="text-xs">{pair.standard.sustainabilityScore}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gray-600 h-2 rounded-full" 
                              style={{ width: `${pair.standard.sustainabilityScore}%` }}
                            ></div>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 flex items-center gap-1">
                          <span className="text-xs">{pair.alternative.sustainabilityScore}</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-carbon-600 h-2 rounded-full" 
                              style={{ width: `${pair.alternative.sustainabilityScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-8 bg-carbon-50 p-4 rounded-lg">
            <h4 className="flex items-center font-medium mb-2">
              <BarChart3 className="h-5 w-5 mr-2 text-carbon-600" />
              Key Benefits of Sustainable Alternatives
            </h4>
            <ul className="space-y-2 pl-2">
              <li className="flex items-start">
                <div className="min-w-4 h-4 w-4 rounded-full bg-carbon-600 mt-1 mr-2"></div>
                <span>Lower carbon footprint - reduced embodied carbon emissions</span>
              </li>
              <li className="flex items-start">
                <div className="min-w-4 h-4 w-4 rounded-full bg-carbon-600 mt-1 mr-2"></div>
                <span>Compliance with evolving building codes and sustainability regulations</span>
              </li>
              <li className="flex items-start">
                <div className="min-w-4 h-4 w-4 rounded-full bg-carbon-600 mt-1 mr-2"></div>
                <span>Improved project sustainability ratings and certifications (LEED, BREEAM, etc.)</span>
              </li>
              <li className="flex items-start">
                <div className="min-w-4 h-4 w-4 rounded-full bg-carbon-600 mt-1 mr-2"></div>
                <span>Reduced environmental impact through recycled content or sustainable sourcing</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaterialBrowser;
