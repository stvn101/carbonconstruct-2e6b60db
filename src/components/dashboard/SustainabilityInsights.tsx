
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  FileText, 
  Plus, 
  Leaf,
  Truck,
  Zap
} from "lucide-react";
import { SavedProject } from "@/contexts/ProjectContext";

interface SustainabilityInsightsProps {
  recentProjects: SavedProject[];
}

export const SustainabilityInsights = ({ recentProjects }: SustainabilityInsightsProps) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Recent Projects</CardTitle>
          <CardDescription>
            Your most recent carbon calculations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentProjects.length > 0 ? (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div 
                  key={project.id}
                  className="flex justify-between items-center p-3 rounded-lg border hover:bg-carbon-50 dark:hover:bg-carbon-800"
                >
                  <div className="flex items-center">
                    <div className="bg-carbon-100 dark:bg-carbon-800 p-2 rounded-md mr-3">
                      <Building2 className="h-5 w-5 text-carbon-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        Updated: {new Date(project.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link to={`/project/${project.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="font-medium mb-1">No projects yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start by creating your first carbon calculation
              </p>
              <Button 
                asChild
                className="bg-carbon-600 hover:bg-carbon-700 text-white"
              >
                <Link to="/calculator">
                  <Plus className="h-4 w-4 mr-2" />
                  New Calculation
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
                
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle className="text-lg">Sustainability Insights</CardTitle>
          <CardDescription>
            Key opportunities for carbon reduction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-lg border bg-carbon-50 dark:bg-carbon-800">
              <div className="bg-green-100 dark:bg-green-900 p-2 rounded-full">
                <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-medium text-green-700 dark:text-green-400">Material Substitution</h3>
                <p className="text-sm text-carbon-600 dark:text-carbon-300">
                  Replacing traditional concrete with geopolymer alternatives could reduce your emissions by up to 30%
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-full">
                <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-blue-700 dark:text-blue-400">Transport Optimization</h3>
                <p className="text-sm text-carbon-600 dark:text-carbon-300">
                  Sourcing materials locally could reduce transportation emissions by up to 15%
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg border">
              <div className="bg-orange-100 dark:bg-orange-900 p-2 rounded-full">
                <Zap className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <h3 className="font-medium text-orange-700 dark:text-orange-400">Energy Management</h3>
                <p className="text-sm text-carbon-600 dark:text-carbon-300">
                  Switching to renewable energy sources on-site could reduce energy emissions by up to 40%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
