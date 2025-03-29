
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { RadarDataPoint, Project } from "./types";

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
  );
};

export default CategoryPerformance;
