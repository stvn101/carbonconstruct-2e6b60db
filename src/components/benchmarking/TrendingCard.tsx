
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YearlyTrend, ProjectType, Project, RadarDataPoint } from "./types";
import HistoricalTrends from "./HistoricalTrends";
import CategoryPerformance from "./CategoryPerformance";

interface TrendingCardProps {
  industryTrends: YearlyTrend[];
  projectType: ProjectType;
  currentProject: Project;
  radarData: RadarDataPoint[];
}

const TrendingCard: React.FC<TrendingCardProps> = ({
  industryTrends,
  projectType,
  currentProject,
  radarData
}) => {
  return (
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
              industryTrends={industryTrends} 
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
  );
};

export default TrendingCard;
