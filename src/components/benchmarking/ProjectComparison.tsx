
import React from "react";
import { 
  ResponsiveContainer,
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine,
  Cell 
} from "recharts";
import { Button } from "@/components/ui/button";
import { BenchmarkData, Project, ChartDataPoint } from "./types";

interface ProjectComparisonProps {
  chartData: ChartDataPoint[];
  benchmark: BenchmarkData;
  selectedProjects: number[];
  onToggleProject: (projectId: number) => void;
  availableProjects: Project[];
}

const ProjectComparison: React.FC<ProjectComparisonProps> = ({ 
  chartData, 
  benchmark, 
  selectedProjects, 
  onToggleProject,
  availableProjects
}) => {
  return (
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
          {availableProjects.filter(p => !p.isCurrent).map((project) => (
            <Button
              key={project.id}
              size="sm"
              variant={selectedProjects.includes(project.id) ? "default" : "outline"}
              onClick={() => onToggleProject(project.id)}
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
  );
};

export default ProjectComparison;
