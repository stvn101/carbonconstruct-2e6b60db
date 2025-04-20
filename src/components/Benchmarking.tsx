
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { INDUSTRY_BENCHMARKS, SAMPLE_PROJECTS, INDUSTRY_TRENDS, IMPROVEMENT_RECOMMENDATIONS } from "./benchmarking/data";
import { ProjectType, ChartDataPoint, RadarDataPoint } from "./benchmarking/types";
import ProjectTypeSelector from "./benchmarking/ProjectTypeSelector";
import BenchmarkingLayout from "./benchmarking/BenchmarkingLayout";
import PerformanceCard from "./benchmarking/PerformanceCard";
import TrendingCard from "./benchmarking/TrendingCard";
import ImprovementRecommendations from "./benchmarking/ImprovementRecommendations";

const Benchmarking = () => {
  const [projectType, setProjectType] = useState<ProjectType>("residential");
  const [selectedProjects, setSelectedProjects] = useState<number[]>([1, 2, 5]);
  
  const currentProject = SAMPLE_PROJECTS.find(p => p.isCurrent) || SAMPLE_PROJECTS[SAMPLE_PROJECTS.length - 1];
  const selectedProjectData = SAMPLE_PROJECTS.filter(project => selectedProjects.includes(project.id));
  
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
    <BenchmarkingLayout>
      <ProjectTypeSelector 
        projectType={projectType} 
        onProjectTypeChange={(value) => setProjectType(value)} 
      />
      
      <PerformanceCard
        currentProject={currentProject}
        benchmark={benchmark}
        chartData={chartData}
        selectedProjects={selectedProjects}
        onToggleProject={toggleProject}
        availableProjects={SAMPLE_PROJECTS}
      />
      
      <TrendingCard
        industryTrends={INDUSTRY_TRENDS}
        projectType={projectType}
        currentProject={currentProject}
        radarData={radarData}
      />
      
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
    </BenchmarkingLayout>
  );
};

export default Benchmarking;
