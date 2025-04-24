
import React, { useState, useMemo } from 'react';
import { Link } from "react-router-dom";
import { SavedProject } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Calendar, Leaf, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProjectsListProps {
  projects: SavedProject[];
  title?: string;
  showSearch?: boolean;
}

const ProjectsList: React.FC<ProjectsListProps> = ({ 
  projects, 
  title = "Your Projects",
  showSearch = true 
}) => {
  const [search, setSearch] = useState("");
  
  // Memoize filtered projects to prevent unnecessary re-renders
  const filteredProjects = useMemo(() => {
    if (search === "") return projects;
    
    const searchLower = search.toLowerCase();
    return projects.filter(project => 
      project.name.toLowerCase().includes(searchLower) ||
      (project.description || "").toLowerCase().includes(searchLower)
    );
  }, [projects, search]);

  // Memoize sorted projects to prevent unnecessary re-renders
  const sortedProjects = useMemo(() => {
    return [...filteredProjects].sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  }, [filteredProjects]);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {showSearch && (
          <div className="relative mt-2">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </CardHeader>
      <CardContent>
        {sortedProjects.length > 0 ? (
          <div className="space-y-2">
            {sortedProjects.map((project) => (
              <Link 
                to={`/projects/${project.id}`} 
                key={project.id}
                className="block"
              >
                <div className="p-3 border rounded-lg hover:bg-carbon-50 dark:hover:bg-carbon-800 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-carbon-100 dark:bg-carbon-800 p-1.5 rounded-md mr-3">
                        <Building2 className="h-4 w-4 text-carbon-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{project.name}</h3>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {new Date(project.updated_at).toLocaleDateString()}
                          </span>
                          {project.result && (
                            <span className="ml-2 flex items-center">
                              <Leaf className="h-3 w-3 mx-1" />
                              {Math.round(project.result.totalEmissions)} kg CO₂e
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {project.tags && project.tags.length > 0 && (
                      <div className="hidden md:flex space-x-1">
                        {project.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                        {project.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{project.tags.length - 2}</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No projects found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectsList;
