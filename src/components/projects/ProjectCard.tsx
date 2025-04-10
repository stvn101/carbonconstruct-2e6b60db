
import { Link } from "react-router-dom";
import { SavedProject } from "@/contexts/ProjectContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Building2,
  Calendar,
  Edit,
  FileText,
  Download,
  Trash2,
  MoreHorizontal,
} from "lucide-react";

interface ProjectCardProps {
  project: SavedProject;
  onExportPDF: () => void;
  onExportCSV: () => void;
  onDelete: () => void;
}

export const ProjectCard = ({ project, onExportPDF, onExportCSV, onDelete }: ProjectCardProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <Link 
            to={`/projects/${project.id}`}
            className="font-medium text-lg hover:text-carbon-600 transition-colors line-clamp-1"
          >
            {project.name}
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to={`/projects/${project.id}`} className="flex items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  <span>View & Edit</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportPDF}>
                <FileText className="mr-2 h-4 w-4" />
                <span>Export as PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                <span>Export as CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-600">
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-3 flex-grow">
          {project.description || "No description provided."}
        </p>

        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4 mr-1.5" />
          <span>
            {new Date(project.updatedAt).toLocaleDateString()}
          </span>
        </div>

        {project.result && (
          <div className="bg-carbon-50 p-2 rounded-md flex justify-between items-center mb-3">
            <span className="text-sm">Total Emissions:</span>
            <span className="font-medium">{Math.round(project.result.totalEmissions)} kg CO₂e</span>
          </div>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {project.tags.map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
