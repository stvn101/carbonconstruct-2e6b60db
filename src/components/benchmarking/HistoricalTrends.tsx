
import React from "react";
import { 
  ResponsiveContainer,
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine,
  ReferenceArea
} from "recharts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { YearlyTrend, ProjectType, Project } from "./types";

interface HistoricalTrendsProps {
  industryTrends: YearlyTrend[];
  projectType: ProjectType;
  currentProject: Project;
}

const HistoricalTrends: React.FC<HistoricalTrendsProps> = ({
  industryTrends,
  projectType,
  currentProject
}) => {
  return (
    <>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={industryTrends}>
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
    </>
  );
};

export default HistoricalTrends;
