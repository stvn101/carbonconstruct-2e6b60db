
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  FileText, 
  Calendar, 
  Leaf,
  Plus,
  FolderPlus
} from "lucide-react";
import { SavedProject } from "@/contexts/ProjectContext";

interface ProjectsTabProps {
  projects: SavedProject[];
}

export const ProjectsTab = ({ projects }: ProjectsTabProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Projects</CardTitle>
          <CardDescription>
            Manage and view your recent carbon calculations
          </CardDescription>
        </div>
        <div className="flex space-x-2">
          <Button 
            asChild
            variant="outline"
          >
            <Link to="/projects/new">
              <FolderPlus className="h-4 w-4 mr-2" />
              New Project
            </Link>
          </Button>
          <Button 
            asChild
            className="bg-carbon-600 hover:bg-carbon-700 text-white"
          >
            <Link to="/projects">
              <FileText className="h-4 w-4 mr-2" />
              View All
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {projects.length > 0 ? (
          <div className="space-y-4">
            {projects
              .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
              .slice(0, 5)
              .map((project) => (
                <div 
                  key={project.id}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-lg border hover:bg-carbon-50 dark:hover:bg-carbon-800"
                >
                  <div className="flex items-center mb-2 sm:mb-0">
                    <div className="bg-carbon-100 dark:bg-carbon-800 p-2 rounded-md mr-3">
                      <Building2 className="h-5 w-5 text-carbon-600" />
                    </div>
                    <div>
                      <h3 className="font-medium">{project.name}</h3>
                      <div className="flex flex-wrap items-center text-xs text-muted-foreground gap-2 mt-1">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(project.updated_at).toLocaleDateString()}
                        </span>
                        {project.result && (
                          <span className="flex items-center">
                            <Leaf className="h-3 w-3 mr-1" />
                            {Math.round(project.result.totalEmissions)} kg CO₂e
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/projects/${project.id}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="font-medium mb-1">No projects yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by creating your first carbon calculation
            </p>
            <div className="flex justify-center gap-2">
              <Button 
                asChild
                variant="outline"
              >
                <Link to="/projects/new">
                  <FolderPlus className="h-4 w-4 mr-2" />
                  New Project
                </Link>
              </Button>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
};
