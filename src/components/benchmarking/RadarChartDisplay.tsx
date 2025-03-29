
import React from "react";
import { 
  ResponsiveContainer,
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend
} from "recharts";
import { RadarDataPoint } from "./types";

interface RadarChartDisplayProps {
  radarData: RadarDataPoint[];
}

const RadarChartDisplay: React.FC<RadarChartDisplayProps> = ({ radarData }) => {
  return (
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
  );
};

export default RadarChartDisplay;
