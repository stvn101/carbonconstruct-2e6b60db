
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Calendar, RefreshCw } from "lucide-react";
import { SavedProject } from "@/contexts/ProjectContext";

interface DashboardStatsProps {
  projectsCount: number;
  recentProjects: SavedProject[];
}

export const DashboardStats = ({ projectsCount, recentProjects }: DashboardStatsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Total Projects</CardDescription>
          <CardTitle className="text-3xl">{projectsCount}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-muted-foreground flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
            <span className="text-green-500 font-medium">+2</span>
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>
                
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Average Emissions</CardDescription>
          <CardTitle className="text-3xl">243 <span className="text-lg">kg CO₂e</span></CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-muted-foreground flex items-center">
            <ArrowUpRight className="h-3 w-3 mr-1 text-green-500 rotate-180" />
            <span className="text-green-500 font-medium">-5%</span>
            <span className="ml-1">reduction from baseline</span>
          </div>
        </CardContent>
      </Card>
                
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Latest Calculation</CardDescription>
          <CardTitle className="text-xl truncate">
            {recentProjects[0]?.name || "No projects yet"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-muted-foreground flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            {recentProjects[0] 
              ? new Date(recentProjects[0].updated_at).toLocaleDateString() 
              : "N/A"}
          </div>
        </CardContent>
      </Card>
                
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Optimization Potential</CardDescription>
          <CardTitle className="text-3xl">18.5%</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-muted-foreground flex items-center">
            <RefreshCw className="h-3 w-3 mr-1 text-blue-500" />
            <span>Based on latest AI analysis</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
