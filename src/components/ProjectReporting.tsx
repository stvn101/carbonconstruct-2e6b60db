
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  PieChart, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Sample project data
const SAMPLE_PROJECTS = [
  {
    id: 1,
    name: "Office Tower Renovation",
    location: "Downtown Metro",
    date: "2023-12-15",
    score: 78,
    totalEmissions: 345.2,
    materialEmissions: 200.5,
    transportEmissions: 85.7,
    energyEmissions: 59.0,
    regulatoryStatus: "compliant",
    targetReduction: 15,
    actualReduction: 12
  },
  {
    id: 2,
    name: "Residential Complex Phase 1",
    location: "Riverside Heights",
    date: "2023-10-05",
    score: 65,
    totalEmissions: 520.8,
    materialEmissions: 320.3,
    transportEmissions: 120.5,
    energyEmissions: 80.0,
    regulatoryStatus: "warning",
    targetReduction: 20,
    actualReduction: 8
  },
  {
    id: 3,
    name: "Community Center",
    location: "Oak Valley",
    date: "2023-08-22",
    score: 92,
    totalEmissions: 180.6,
    materialEmissions: 90.2,
    transportEmissions: 45.4,
    energyEmissions: 45.0,
    regulatoryStatus: "compliant",
    targetReduction: 30,
    actualReduction: 35
  },
  {
    id: 4,
    name: "Industrial Warehouse",
    location: "Harbor District",
    date: "2023-06-10",
    score: 45,
    totalEmissions: 820.3,
    materialEmissions: 450.1,
    transportEmissions: 290.2,
    energyEmissions: 80.0,
    regulatoryStatus: "non-compliant",
    targetReduction: 25,
    actualReduction: 5
  }
];

// Sample regulatory requirements
const REGULATORY_REQUIREMENTS = [
  {
    name: "Carbon Emission Limit",
    threshold: "500 kg CO2e",
    status: "compliant",
    details: "Total project emissions must be below 500 kg CO2e per square meter"
  },
  {
    name: "Material Sourcing",
    threshold: "70% local",
    status: "warning",
    details: "At least 70% of materials must be sourced locally to reduce transport emissions"
  },
  {
    name: "Renewable Energy Usage",
    threshold: "30% minimum",
    status: "non-compliant",
    details: "At least 30% of energy used must come from renewable sources"
  },
  {
    name: "Waste Reduction",
    threshold: "80% recycled",
    status: "compliant",
    details: "At least 80% of construction waste must be recycled or reused"
  }
];

const ProjectReporting = () => {
  const [selectedProject, setSelectedProject] = useState(SAMPLE_PROJECTS[0]);
  
  // Simulating a PDF export
  const handleExportPDF = () => {
    alert("Report export functionality would generate a PDF here.");
    // In a real application, this would generate a PDF using a library like jsPDF or similar
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "compliant":
        return <Badge className="bg-green-500 hover:bg-green-600">Compliant</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Warning</Badge>;
      case "non-compliant":
        return <Badge className="bg-red-500 hover:bg-red-600">Non-Compliant</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Function to get sustainability score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-carbon-100">
              <FileText className="h-6 w-6 text-carbon-700" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Project Reporting</h1>
          <p className="text-lg text-muted-foreground">
            Comprehensive carbon footprint reports and compliance tracking for your projects
          </p>
        </div>
        
        {/* Project Selection */}
        <div className="grid gap-6 md:grid-cols-4 mb-6">
          {SAMPLE_PROJECTS.map((project) => (
            <Card 
              key={project.id} 
              className={`cursor-pointer transition-all hover:border-carbon-400 ${
                selectedProject.id === project.id ? "border-carbon-500 shadow-md" : ""
              }`}
              onClick={() => setSelectedProject(project)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{project.name}</CardTitle>
                <CardDescription className="text-xs">
                  {project.location} · {new Date(project.date).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="text-sm font-medium">Score:</div>
                  <div className={`text-xl font-bold ${getScoreColor(project.score)}`}>
                    {project.score}
                  </div>
                </div>
                <Progress 
                  value={project.score} 
                  className="h-2 mt-1" 
                  indicatorClassName={
                    project.score >= 80 ? "bg-green-500" : 
                    project.score >= 60 ? "bg-yellow-500" : 
                    "bg-red-500"
                  }
                />
                <div className="mt-2 flex justify-between text-xs">
                  <span>Status:</span>
                  <StatusBadge status={project.regulatoryStatus} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Detailed Report */}
        <Tabs defaultValue="summary">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="emissions">Emissions</TabsTrigger>
              <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
              <TabsTrigger value="targets">Targets</TabsTrigger>
            </TabsList>
            <Button onClick={handleExportPDF} className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
          </div>
          
          {/* Summary Tab */}
          <TabsContent value="summary">
            <Card>
              <CardHeader>
                <CardTitle>Project Summary: {selectedProject.name}</CardTitle>
                <CardDescription>
                  Overall sustainability performance and key metrics
                </CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Sustainability Score</h3>
                  <div className="flex flex-col items-center justify-center p-6 border rounded-lg bg-carbon-50">
                    <div className={`text-5xl font-bold ${getScoreColor(selectedProject.score)}`}>
                      {selectedProject.score}
                    </div>
                    <Progress 
                      value={selectedProject.score} 
                      className="h-2 mt-3 w-full max-w-xs" 
                      indicatorClassName={
                        selectedProject.score >= 80 ? "bg-green-500" : 
                        selectedProject.score >= 60 ? "bg-yellow-500" : 
                        "bg-red-500"
                      }
                    />
                    <div className="mt-3 text-sm text-muted-foreground text-center">
                      {selectedProject.score >= 80 && "Excellent sustainability performance"}
                      {selectedProject.score >= 60 && selectedProject.score < 80 && "Good sustainability performance with room for improvement"}
                      {selectedProject.score < 60 && "Poor sustainability performance - significant improvements needed"}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Metrics</h3>
                  <ul className="space-y-3">
                    <li className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Total Carbon Emissions:</span>
                      <span className="font-bold">{selectedProject.totalEmissions.toFixed(1)} kg CO2e</span>
                    </li>
                    <li className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Regulatory Status:</span>
                      <StatusBadge status={selectedProject.regulatoryStatus} />
                    </li>
                    <li className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Emission Reduction Target:</span>
                      <span className="font-bold">{selectedProject.targetReduction}%</span>
                    </li>
                    <li className="flex justify-between items-center p-3 border rounded-lg">
                      <span className="font-medium">Actual Reduction Achieved:</span>
                      <span className={`font-bold ${
                        selectedProject.actualReduction >= selectedProject.targetReduction 
                        ? "text-green-600" 
                        : "text-red-600"
                      }`}>
                        {selectedProject.actualReduction}%
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(selectedProject.date).toLocaleDateString()} | 
                  Project Location: {selectedProject.location}
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Emissions Tab */}
          <TabsContent value="emissions">
            <Card>
              <CardHeader>
                <CardTitle>Emissions Breakdown: {selectedProject.name}</CardTitle>
                <CardDescription>
                  Detailed analysis of carbon emissions by category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      <PieChart className="h-5 w-5 inline-block mr-2" />
                      Emissions Distribution
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Materials ({Math.round(selectedProject.materialEmissions/selectedProject.totalEmissions*100)}%)</span>
                          <span className="text-sm">{selectedProject.materialEmissions.toFixed(1)} kg CO2e</span>
                        </div>
                        <Progress value={selectedProject.materialEmissions/selectedProject.totalEmissions*100} className="h-2" indicatorClassName="bg-carbon-500" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Transport ({Math.round(selectedProject.transportEmissions/selectedProject.totalEmissions*100)}%)</span>
                          <span className="text-sm">{selectedProject.transportEmissions.toFixed(1)} kg CO2e</span>
                        </div>
                        <Progress value={selectedProject.transportEmissions/selectedProject.totalEmissions*100} className="h-2" indicatorClassName="bg-carbon-400" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Energy ({Math.round(selectedProject.energyEmissions/selectedProject.totalEmissions*100)}%)</span>
                          <span className="text-sm">{selectedProject.energyEmissions.toFixed(1)} kg CO2e</span>
                        </div>
                        <Progress value={selectedProject.energyEmissions/selectedProject.totalEmissions*100} className="h-2" indicatorClassName="bg-carbon-300" />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      <BarChart3 className="h-5 w-5 inline-block mr-2" />
                      Performance Analysis
                    </h3>
                    <div className="p-4 border rounded-lg">
                      <div className="mb-4">
                        <div className="text-sm font-medium mb-1">Total Emissions</div>
                        <div className="flex items-center">
                          <div className="text-2xl font-bold mr-2">
                            {selectedProject.totalEmissions.toFixed(1)} kg CO2e
                          </div>
                          {selectedProject.totalEmissions < 500 ? (
                            <Badge className="bg-green-500">Below Average</Badge>
                          ) : (
                            <Badge className="bg-red-500">Above Average</Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="p-2 bg-carbon-50 rounded border flex justify-between">
                          <span>Industry Average:</span>
                          <span className="font-medium">500 kg CO2e</span>
                        </div>
                        <div className="p-2 bg-carbon-50 rounded border flex justify-between">
                          <span>Your Performance:</span>
                          <span className={`font-medium ${
                            selectedProject.totalEmissions < 500 
                            ? "text-green-600" 
                            : "text-red-600"
                          }`}>
                            {selectedProject.totalEmissions < 500 
                              ? `${Math.round((1 - selectedProject.totalEmissions/500) * 100)}% better` 
                              : `${Math.round((selectedProject.totalEmissions/500 - 1) * 100)}% worse`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Regulatory Tab */}
          <TabsContent value="regulatory">
            <Card>
              <CardHeader>
                <CardTitle>Regulatory Compliance: {selectedProject.name}</CardTitle>
                <CardDescription>
                  Status of compliance with environmental regulations and standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className={
                  selectedProject.regulatoryStatus === "compliant" 
                    ? "border-green-500 bg-green-50 text-green-800 mb-6" 
                    : selectedProject.regulatoryStatus === "warning"
                      ? "border-yellow-500 bg-yellow-50 text-yellow-800 mb-6"
                      : "border-red-500 bg-red-50 text-red-800 mb-6"
                }>
                  <div className="flex items-center gap-2">
                    {selectedProject.regulatoryStatus === "compliant" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : selectedProject.regulatoryStatus === "warning" ? (
                      <AlertTriangle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    <AlertTitle className="font-medium">
                      {selectedProject.regulatoryStatus === "compliant" 
                        ? "Project is Fully Compliant" 
                        : selectedProject.regulatoryStatus === "warning"
                          ? "Project has Compliance Warnings"
                          : "Project is Non-Compliant"
                      }
                    </AlertTitle>
                  </div>
                  <AlertDescription className="mt-2 text-sm">
                    {selectedProject.regulatoryStatus === "compliant" 
                      ? "This project meets all regulatory requirements for carbon emissions and sustainability standards." 
                      : selectedProject.regulatoryStatus === "warning"
                        ? "This project has some issues that need to be addressed to achieve full compliance."
                        : "This project does not meet minimum regulatory requirements. Immediate action is needed."
                    }
                  </AlertDescription>
                </Alert>
                
                <Table>
                  <TableCaption>Regulatory requirements and compliance status</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Requirement</TableHead>
                      <TableHead>Threshold</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {REGULATORY_REQUIREMENTS.map((req, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{req.name}</TableCell>
                        <TableCell>{req.threshold}</TableCell>
                        <TableCell>
                          <StatusBadge status={req.status} />
                        </TableCell>
                        <TableCell>{req.details}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Targets Tab */}
          <TabsContent value="targets">
            <Card>
              <CardHeader>
                <CardTitle>Emission Reduction Targets: {selectedProject.name}</CardTitle>
                <CardDescription>
                  Progress towards carbon reduction goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Target vs. Actual Reduction</h3>
                    <div className="p-6 border rounded-lg relative">
                      <div className="text-center mb-6">
                        <div className="text-sm text-muted-foreground mb-1">Reduction Target</div>
                        <div className="text-4xl font-bold text-carbon-600">{selectedProject.targetReduction}%</div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Target</span>
                            <span className="text-sm">{selectedProject.targetReduction}%</span>
                          </div>
                          <Progress value={selectedProject.targetReduction} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Actual</span>
                            <span className="text-sm">{selectedProject.actualReduction}%</span>
                          </div>
                          <Progress 
                            value={selectedProject.actualReduction} 
                            className="h-2" 
                            indicatorClassName={
                              selectedProject.actualReduction >= selectedProject.targetReduction 
                              ? "bg-green-500" 
                              : "bg-red-500"
                            } 
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Success Rate:</span>
                          <span className={`font-bold ${
                            selectedProject.actualReduction >= selectedProject.targetReduction 
                            ? "text-green-600" 
                            : "text-red-600"
                          }`}>
                            {Math.round((selectedProject.actualReduction / selectedProject.targetReduction) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Impact Analysis</h3>
                    <Alert className="mb-4 bg-carbon-50 border-carbon-200">
                      <Info className="h-4 w-4" />
                      <AlertTitle>Carbon Reduction Impact</AlertTitle>
                      <AlertDescription>
                        {selectedProject.actualReduction / 100 * (selectedProject.totalEmissions / (1 - selectedProject.actualReduction / 100)).toFixed(1)} kg CO2e emissions prevented
                      </AlertDescription>
                    </Alert>
                    
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <span>Original Baseline:</span>
                        <span className="font-medium">
                          {(selectedProject.totalEmissions / (1 - selectedProject.actualReduction / 100)).toFixed(1)} kg CO2e
                        </span>
                      </div>
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <span>Current Emissions:</span>
                        <span className="font-medium">{selectedProject.totalEmissions.toFixed(1)} kg CO2e</span>
                      </div>
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <span>Target Emissions:</span>
                        <span className="font-medium">
                          {((selectedProject.totalEmissions / (1 - selectedProject.actualReduction / 100)) * (1 - selectedProject.targetReduction / 100)).toFixed(1)} kg CO2e
                        </span>
                      </div>
                      <div className="p-3 border rounded-lg flex justify-between items-center bg-carbon-50">
                        <span className="font-medium">Remaining Reduction Needed:</span>
                        <span className={`font-bold ${
                          selectedProject.actualReduction >= selectedProject.targetReduction 
                          ? "text-green-600" 
                          : "text-red-600"
                        }`}>
                          {selectedProject.actualReduction >= selectedProject.targetReduction 
                            ? "Target Achieved!" 
                            : `${(selectedProject.targetReduction - selectedProject.actualReduction).toFixed(1)}%`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Targets based on industry standards and project-specific goals
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProjectReporting;
