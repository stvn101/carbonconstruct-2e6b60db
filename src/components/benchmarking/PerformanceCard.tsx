
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { BenchmarkData, Project, ChartDataPoint } from "./types";
import PerformanceMetrics from "./PerformanceMetrics";
import ProjectComparison from "./ProjectComparison";

interface PerformanceCardProps {
  currentProject: Project;
  benchmark: BenchmarkData;
  chartData: ChartDataPoint[];
  selectedProjects: number[];
  onToggleProject: (projectId: number) => void;
  availableProjects: Project[];
}

const PerformanceCard: React.FC<PerformanceCardProps> = ({
  currentProject,
  benchmark,
  chartData,
  selectedProjects,
  onToggleProject,
  availableProjects
}) => {
  return (
    <Card className="mb-8 border-carbon-200">
      <CardHeader>
        <CardTitle>Performance Against {benchmark.name} Benchmark</CardTitle>
        <CardDescription>
          How your project compares to industry standards
        </CardDescription>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <PerformanceMetrics 
          currentProject={currentProject} 
          benchmark={benchmark} 
        />
        <ProjectComparison 
          chartData={chartData} 
          benchmark={benchmark} 
          selectedProjects={selectedProjects} 
          onToggleProject={onToggleProject}
          availableProjects={availableProjects}
        />
      </CardContent>
    </Card>
  );
};

export default PerformanceCard;
