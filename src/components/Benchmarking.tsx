
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import data and types
import { 
  INDUSTRY_BENCHMARKS, 
  SAMPLE_PROJECTS, 
  INDUSTRY_TRENDS, 
  IMPROVEMENT_RECOMMENDATIONS 
} from "./benchmarking/data";
import { ProjectType, ChartDataPoint, RadarDataPoint } from "./benchmarking/types";

// Import components
import ProjectTypeSelector from "./benchmarking/ProjectTypeSelector";
import PerformanceMetrics from "./benchmarking/PerformanceMetrics";
import ProjectComparison from "./benchmarking/ProjectComparison";
import HistoricalTrends from "./benchmarking/HistoricalTrends";
import CategoryPerformance from "./benchmarking/CategoryPerformance";
import ImprovementRecommendations from "./benchmarking/ImprovementRecommendations";

const Benchmarking = () => {
  const [projectType, setProjectType] = useState<ProjectType>("residential");
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
  
  const chartData: ChartDataPoint[] = selectedProjectData.map(project => ({
    name: project.name,
    emissions: project.emissions,
    isCurrent: project.isCurrent
  }));
  
  const radarData: RadarDataPoint[] = [
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
        
        <ProjectTypeSelector 
          projectType={projectType} 
          onProjectTypeChange={(value) => setProjectType(value)} 
        />
        
        <Card className="mb-8 border-carbon-200">
          <CardHeader>
            <CardTitle>Performance Against {benchmark.name} Benchmark</CardTitle>
            <CardDescription>
              How your project compares to industry standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <PerformanceMetrics 
                currentProject={currentProject} 
                benchmark={benchmark} 
              />
              
              <ProjectComparison 
                chartData={chartData} 
                benchmark={benchmark} 
                selectedProjects={selectedProjects} 
                onToggleProject={toggleProject}
                availableProjects={SAMPLE_PROJECTS}
              />
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
                <HistoricalTrends 
                  industryTrends={INDUSTRY_TRENDS} 
                  projectType={projectType}
                  currentProject={currentProject}
                />
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
                <CategoryPerformance 
                  radarData={radarData} 
                  currentProject={currentProject}
                />
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
            <ImprovementRecommendations recommendations={IMPROVEMENT_RECOMMENDATIONS} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Benchmarking;
