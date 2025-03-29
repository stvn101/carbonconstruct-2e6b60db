
import React from "react";
import { RadarDataPoint, Project } from "./types";
import RadarChartDisplay from "./RadarChartDisplay";
import CategoryScoresTable from "./CategoryScoresTable";

interface CategoryPerformanceProps {
  radarData: RadarDataPoint[];
  currentProject: Project;
}

const CategoryPerformance: React.FC<CategoryPerformanceProps> = ({
  radarData,
  currentProject
}) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <RadarChartDisplay radarData={radarData} />
      <CategoryScoresTable currentProject={currentProject} />
    </div>
  );
};

export default CategoryPerformance;
