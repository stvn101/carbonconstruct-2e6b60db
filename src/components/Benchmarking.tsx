import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  ReferenceArea,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell
} from "recharts";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart3, AlertTriangle, ArrowUp, ArrowDown, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const INDUSTRY_BENCHMARKS = {
  residential: {
    name: "Residential",
    average: 320,
    low: 180,
    high: 450,
    unit: "kg CO2e/m²"
  },
  commercial: {
    name: "Commercial",
    average: 580,
    low: 350,
    high: 850,
    unit: "kg CO2e/m²"
  },
  industrial: {
    name: "Industrial",
    average: 720,
    low: 480,
    high: 1200,
    unit: "kg CO2e/m²"
  },
  institutional: {
    name: "Institutional",
    average: 500,
    low: 320,
    high: 720,
    unit: "kg CO2e/m²"
  }
};

const SAMPLE_PROJECTS = [
  {
    id: 1,
    name: "Riverside Apartments",
    type: "residential",
    location: "Portland, OR",
    emissions: 260,
    area: 15000,
    materialsScore: 72,
    transportScore: 85,
    energyScore: 68,
    wasteScore: 76,
    waterScore: 80
  },
  {
    id: 2,
    name: "Metro Office Tower",
    type: "commercial",
    location: "Seattle, WA",
    emissions: 490,
    area: 35000,
    materialsScore: 65,
    transportScore: 55,
    energyScore: 80,
    wasteScore: 70,
    waterScore: 60
  },
  {
    id: 3,
    name: "Green Valley Hospital",
    type: "institutional",
    location: "Denver, CO",
    emissions: 310,
    area: 42000,
    materialsScore: 85,
    transportScore: 60,
    energyScore: 90,
    wasteScore: 78,
    waterScore: 82
  },
  {
    id: 4,
    name: "Eastside Manufacturing",
    type: "industrial",
    location: "Detroit, MI",
    emissions: 680,
    area: 50000,
    materialsScore: 40,
    transportScore: 35,
    energyScore: 50,
    wasteScore: 45,
    waterScore: 38
  },
  {
    id: 5,
    name: "Current Project",
    type: "residential",
    location: "Your Location",
    emissions: 220,
    area: 12000,
    materialsScore: 78,
    transportScore: 73,
    energyScore: 82,
    wasteScore: 70,
    waterScore: 75,
    isCurrent: true
  }
];

const INDUSTRY_TRENDS = [
  { year: 2018, residential: 380, commercial: 650, industrial: 850, institutional: 570 },
  { year: 2019, residential: 360, commercial: 630, industrial: 820, institutional: 550 },
  { year: 2020, residential: 350, commercial: 610, industrial: 790, institutional: 530 },
  { year: 2021, residential: 335, commercial: 595, industrial: 760, institutional: 520 },
  { year: 2022, residential: 325, commercial: 585, industrial: 740, institutional: 510 },
  { year: 2023, residential: 320, commercial: 580, industrial: 720, institutional: 500 }
];

const IMPROVEMENT_RECOMMENDATIONS = [
  { 
    id: 1, 
    category: "Materials", 
    recommendation: "Switch to low-carbon concrete alternatives",
    impact: "high",
    potentialReduction: "15-20%",
    complexity: "medium"
  },
  { 
    id: 2, 
    category: "Transport", 
    recommendation: "Source materials locally (within 100 miles)",
    impact: "medium",
    potentialReduction: "8-12%",
    complexity: "low"
  },
  { 
    id: 3, 
    category: "Energy", 
    recommendation: "Implement on-site renewable energy generation",
    impact: "high",
    potentialReduction: "20-30%",
    complexity: "high"
  },
  { 
    id: 4, 
    category: "Materials", 
    recommendation: "Increase use of recycled and reclaimed materials",
    impact: "medium",
    potentialReduction: "10-15%",
    complexity: "low"
  },
  { 
    id: 5, 
    category: "Energy", 
    recommendation: "Improve equipment efficiency and reduce idle time",
    impact: "medium",
    potentialReduction: "5-10%",
    complexity: "low"
  }
];

const Benchmarking = () => {
  const [projectType, setProjectType] = useState<keyof typeof INDUSTRY_BENCHMARKS>("residential");
  const [selectedProjects, setSelectedProjects] = useState<number[]>([1, 2, 5]); // Default selected projects
  
  const currentProject = SAMPLE_PROJECTS.find(p => p.isCurrent) || SAMPLE_PROJECTS[SAMPLE_PROJECTS.length - 1];
  
  const selectedProjectData = SAMPLE_PROJECTS.filter(project => 
    selectedProjects.includes(project.id)
  );
  
  const toggleProject = (projectId: number) => {
    if (selectedProjects.includes(projectId)) {
      if (selectedProjects.length > 1) {
        setSelectedProjects(selectedProjects.filter(id => id !== projectId));
      }
    } else {
      setSelectedProjects([...selectedProjects, projectId]);
    }
  };
  
  const chartData = selectedProjectData.map(project => ({
    name: project.name,
    emissions: project.emissions,
    isCurrent: project.isCurrent
  }));
  
  const radarData = [
    {
      subject: "Materials",
      "Current Project": currentProject.materialsScore,
      "Industry Average": 60
    },
    {
      subject: "Transport",
      "Current Project": currentProject.transportScore,
      "Industry Average": 55
    },
    {
      subject: "Energy",
      "Current Project": currentProject.energyScore,
      "Industry Average": 65
    },
    {
      subject: "Waste",
      "Current Project": currentProject.wasteScore,
      "Industry Average": 60
    },
    {
      subject: "Water",
      "Current Project": currentProject.waterScore,
      "Industry Average": 70
    }
  ];
  
  const benchmark = INDUSTRY_BENCHMARKS[projectType];
  
  const performancePercent = ((benchmark.average - currentProject.emissions) / benchmark.average) * 100;
  const isPerformanceGood = performancePercent > 0;
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-green-500 hover:bg-green-600";
      case "medium": return "bg-yellow-500 hover:bg-yellow-600";
      case "low": return "bg-gray-500 hover:bg-gray-600";
      default: return "bg-carbon-500 hover:bg-carbon-600";
    }
  };
  
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low": return "bg-green-500 hover:bg-green-600";
      case "medium": return "bg-yellow-500 hover:bg-yellow-600";
      case "high": return "bg-red-500 hover:bg-red-600";
      default: return "bg-carbon-500 hover:bg-carbon-600";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-carbon-100">
              <BarChart3 className="h-6 w-6 text-carbon-700" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Benchmarking</h1>
          <p className="text-lg text-muted-foreground">
            Compare your project's performance against industry standards and identify areas for improvement
          </p>
        </div>
        
        <div className="max-w-md mx-auto mb-8">
          <label htmlFor="project-type" className="block text-sm font-medium mb-2">
            Select Project Type
          </label>
          <Select
            value={projectType}
            onValueChange={(value) => setProjectType(value as keyof typeof INDUSTRY_BENCHMARKS)}
          >
            <SelectTrigger id="project-type">
              <SelectValue placeholder="Select project type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="residential">Residential</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="industrial">Industrial</SelectItem>
              <SelectItem value="institutional">Institutional</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Card className="mb-8 border-carbon-200">
          <CardHeader>
            <CardTitle>Performance Against {benchmark.name} Benchmark</CardTitle>
            <CardDescription>
              How your project compares to industry standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="p-6 border rounded-lg bg-carbon-50 mb-4">
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-medium mb-1">Your Performance</h3>
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold mr-2">
                        {currentProject.emissions}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {benchmark.unit}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Industry Low</span>
                      <span className="font-medium">{benchmark.low} {benchmark.unit}</span>
                    </div>
                    <div className="relative h-2 bg-gray-200 rounded-full">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
                      <div 
                        className="absolute top-0 bottom-0 w-1 bg-white border border-gray-400 rounded-full"
                        style={{ 
                          left: `${Math.max(0, Math.min(100, (currentProject.emissions - benchmark.low) / (benchmark.high - benchmark.low) * 100))}%`,
                          transform: 'translateX(-50%)'
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span>Best</span>
                      <span>Average</span>
                      <span>Worst</span>
                    </div>
                  </div>
                  
                  <Alert className={
                    isPerformanceGood
                      ? "mt-4 border-green-500 bg-green-50 text-green-800"
                      : "mt-4 border-red-500 bg-red-50 text-red-800"
                  }>
                    <div className="flex items-center gap-2">
                      {isPerformanceGood ? (
                        <ArrowDown className="h-4 w-4" />
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                      <AlertTitle className="font-medium">
                        {isPerformanceGood 
                          ? `${Math.abs(Math.round(performancePercent))}% Below Industry Average` 
                          : `${Math.abs(Math.round(performancePercent))}% Above Industry Average`
                        }
                      </AlertTitle>
                    </div>
                    <AlertDescription className="mt-2 text-sm">
                      {isPerformanceGood 
                        ? "Your project is performing better than the industry average. Continue these sustainable practices."
                        : "Your project has a higher carbon footprint than the industry average. Review recommendations for improvement."
                      }
                    </AlertDescription>
                  </Alert>
                </div>
                
                <h3 className="font-medium mb-3">Industry Benchmark Details</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Industry Average</TableCell>
                      <TableCell className="text-right">{benchmark.average} {benchmark.unit}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Best Practice (Low)</TableCell>
                      <TableCell className="text-right">{benchmark.low} {benchmark.unit}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">High Emissions</TableCell>
                      <TableCell className="text-right">{benchmark.high} {benchmark.unit}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Your Performance</TableCell>
                      <TableCell className="text-right font-bold">{currentProject.emissions} {benchmark.unit}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Difference from Average</TableCell>
                      <TableCell className={`text-right font-bold ${isPerformanceGood ? "text-green-600" : "text-red-600"}`}>
                        {isPerformanceGood ? "-" : "+"}{Math.abs(currentProject.emissions - benchmark.average)} {benchmark.unit}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Project Comparison</h3>
                <div className="h-72 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} tickFormatter={(value) => value.split(' ')[0]} />
                      <YAxis 
                        label={{ value: benchmark.unit, angle: -90, position: 'insideLeft' }}
                        domain={[0, Math.max(benchmark.high * 1.1, Math.max(...chartData.map(d => d.emissions)) * 1.1)]}
                      />
                      <Tooltip formatter={(value) => [`${value} ${benchmark.unit}`, "Emissions"]} />
                      <Legend />
                      <ReferenceLine y={benchmark.average} stroke="#888" strokeDasharray="3 3" label="Industry Avg" />
                      <ReferenceLine y={benchmark.low} stroke="#22c55e" strokeDasharray="3 3" label="Best Practice" />
                      <Bar 
                        dataKey="emissions" 
                        name="Carbon Emissions"
                        fill="#a3a3a3"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.isCurrent ? "#9b87f5" : "#a3a3a3"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="border rounded-lg p-3 bg-gray-50">
                  <h4 className="text-sm font-medium mb-2">Toggle Projects for Comparison</h4>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_PROJECTS.filter(p => !p.isCurrent).map((project) => (
                      <Button
                        key={project.id}
                        size="sm"
                        variant={selectedProjects.includes(project.id) ? "default" : "outline"}
                        onClick={() => toggleProject(project.id)}
                        className="text-xs"
                      >
                        {project.name.split(' ')[0]}
                      </Button>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Note: "Current Project" is always included
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="trends" className="mb-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="trends">Historical Trends</TabsTrigger>
            <TabsTrigger value="categories">Performance by Category</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Industry Trends (2018-2023)</CardTitle>
                <CardDescription>
                  Historical carbon emissions by project type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={INDUSTRY_TRENDS}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis label={{ value: 'kg CO2e/m²', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`${value} kg CO2e/m²`, null]} />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="residential" 
                        name="Residential" 
                        stroke="#9b87f5" 
                        strokeWidth={projectType === "residential" ? 3 : 1}
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="commercial" 
                        name="Commercial" 
                        stroke="#7E69AB" 
                        strokeWidth={projectType === "commercial" ? 3 : 1}
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="industrial" 
                        name="Industrial" 
                        stroke="#6E59A5" 
                        strokeWidth={projectType === "industrial" ? 3 : 1}
                        activeDot={{ r: 8 }} 
                      />
                      <Line 
                        type="monotone" 
                        dataKey="institutional" 
                        name="Institutional" 
                        stroke="#D6BCFA" 
                        strokeWidth={projectType === "institutional" ? 3 : 1}
                        activeDot={{ r: 8 }} 
                      />
                      <ReferenceArea 
                        y1={0} 
                        y2={currentProject.emissions} 
                        strokeOpacity={0.3} 
                        fill="#9b87f5" 
                        fillOpacity={0.1} 
                      />
                      <ReferenceLine 
                        y={currentProject.emissions} 
                        stroke="#9b87f5" 
                        strokeDasharray="3 3"
                        label="Your Project" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <Alert className="mt-6 bg-carbon-50 border-carbon-200">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Industry Trend Analysis</AlertTitle>
                  <AlertDescription>
                    The industry has shown a consistent downward trend in carbon emissions across all project types, 
                    with an average reduction of 3-5% annually. This is driven by improved materials, 
                    construction methods, and increased focus on sustainability in the construction industry.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
                <CardDescription>
                  Detailed breakdown of your project's sustainability scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar
                          name="Current Project"
                          dataKey="Current Project"
                          stroke="#9b87f5"
                          fill="#9b87f5"
                          fillOpacity={0.6}
                        />
                        <Radar
                          name="Industry Average"
                          dataKey="Industry Average"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.3}
                        />
                        <Legend />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-3">Category Analysis</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Category</TableHead>
                          <TableHead>Score</TableHead>
                          <TableHead>Avg</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Materials</TableCell>
                          <TableCell>{currentProject.materialsScore}</TableCell>
                          <TableCell>60</TableCell>
                          <TableCell>
                            <Badge className={currentProject.materialsScore >= 60 ? "bg-green-500" : "bg-red-500"}>
                              {currentProject.materialsScore >= 60 ? "Good" : "Needs Work"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Transport</TableCell>
                          <TableCell>{currentProject.transportScore}</TableCell>
                          <TableCell>55</TableCell>
                          <TableCell>
                            <Badge className={currentProject.transportScore >= 55 ? "bg-green-500" : "bg-red-500"}>
                              {currentProject.transportScore >= 55 ? "Good" : "Needs Work"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Energy</TableCell>
                          <TableCell>{currentProject.energyScore}</TableCell>
                          <TableCell>65</TableCell>
                          <TableCell>
                            <Badge className={currentProject.energyScore >= 65 ? "bg-green-500" : "bg-red-500"}>
                              {currentProject.energyScore >= 65 ? "Good" : "Needs Work"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Waste</TableCell>
                          <TableCell>{currentProject.wasteScore}</TableCell>
                          <TableCell>60</TableCell>
                          <TableCell>
                            <Badge className={currentProject.wasteScore >= 60 ? "bg-green-500" : "bg-red-500"}>
                              {currentProject.wasteScore >= 60 ? "Good" : "Needs Work"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Water</TableCell>
                          <TableCell>{currentProject.waterScore}</TableCell>
                          <TableCell>70</TableCell>
                          <TableCell>
                            <Badge className={currentProject.waterScore >= 70 ? "bg-green-500" : "bg-red-500"}>
                              {currentProject.waterScore >= 70 ? "Good" : "Needs Work"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Card>
          <CardHeader>
            <CardTitle>Improvement Recommendations</CardTitle>
            <CardDescription>
              Suggestions to improve your project's sustainability performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>
                Prioritized recommendations for reducing your project's carbon footprint
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Recommendation</TableHead>
                  <TableHead>Potential Reduction</TableHead>
                  <TableHead>Implementation</TableHead>
                  <TableHead>Impact</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {IMPROVEMENT_RECOMMENDATIONS.map((rec) => (
                  <TableRow key={rec.id}>
                    <TableCell className="font-medium">{rec.category}</TableCell>
                    <TableCell>{rec.recommendation}</TableCell>
                    <TableCell>{rec.potentialReduction}</TableCell>
                    <TableCell>
                      <Badge className={getComplexityColor(rec.complexity)}>
                        {rec.complexity.charAt(0).toUpperCase() + rec.complexity.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getImpactColor(rec.impact)}>
                        {rec.impact.charAt(0).toUpperCase() + rec.impact.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <div className="mt-6 bg-carbon-50 p-4 rounded-lg border border-carbon-100">
              <h3 className="font-medium mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2 text-carbon-600" />
                Key Areas for Improvement
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Based on your performance against industry benchmarks, these are the highest priority areas to focus on:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <ArrowUp className="h-4 w-4 text-red-500" />
                  </div>
                  <span>
                    <strong>Materials Selection:</strong> Switching to low-carbon alternatives could significantly improve your overall performance.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <ArrowUp className="h-4 w-4 text-red-500" />
                  </div>
                  <span>
                    <strong>Energy Efficiency:</strong> Optimizing equipment usage and implementing renewable energy sources would have substantial impact.
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="mr-2 mt-0.5">
                    <ArrowDown className="h-4 w-4 text-green-500" />
                  </div>
                  <span>
                    <strong>Transportation:</strong> Your project is already performing well in this category compared to industry averages.
                  </span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Benchmarking;
