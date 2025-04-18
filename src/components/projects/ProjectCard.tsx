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
  Star,
} from "lucide-react";
import { useAuth } from '@/contexts/auth';

interface ProjectCardProps {
  project: SavedProject;
  onExportPDF: () => void;
  onExportCSV: () => void;
  onDelete: () => void;
}

export const ProjectCard = ({ project, onExportPDF, onExportCSV, onDelete }: ProjectCardProps) => {
  const { profile } = useAuth();
  const isPremiumUser = profile?.subscription_tier === 'premium';
  const isPremiumFeature = project.premium_only || false;
  
  // Determine if this project should be accessible
  const isAccessible = !isPremiumFeature || (isPremiumFeature && isPremiumUser);
  
  return (
    <Card className={`h-full ${isPremiumFeature && !isPremiumUser ? 'opacity-70 pointer-events-none' : ''}`}>
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 max-w-[70%]">
            {isPremiumFeature && (
              <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
            )}
            <Link 
              to={isAccessible ? `/projects/${project.id}` : "#"}
              className="font-medium text-lg hover:text-carbon-600 transition-colors line-clamp-1 text-left"
              onClick={e => {
                if (!isAccessible) {
                  e.preventDefault();
                  alert("This is a premium project feature. Please upgrade to access.");
                }
              }}
            >
              {project.name}
            </Link>
          </div>
          
          {isAccessible && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-background">
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
          )}
        </div>

        <p className="text-muted-foreground text-sm line-clamp-2 mb-3 flex-grow text-left">
          {project.description || "No description provided."}
        </p>

        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Calendar className="h-4 w-4 mr-1.5 flex-shrink-0" />
          <span>
            {new Date(project.updated_at).toLocaleDateString()}
          </span>
        </div>

        {project.result && (
          <div className="bg-carbon-50 dark:bg-carbon-800 p-2 rounded-md flex justify-between items-center mb-3">
            <span className="text-sm">Total Emissions:</span>
            <span className="font-medium">{Math.round(project.result.totalEmissions)} kg CO₂e</span>
          </div>
        )}

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-2">
            {project.tags.slice(0, 3).map(tag => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs"
              >
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
        
        {isPremiumFeature && !isPremiumUser && (
          <div className="mt-3 bg-yellow-50 dark:bg-yellow-900/30 p-2 rounded text-xs text-yellow-800 dark:text-yellow-200 text-center">
            Premium feature - Upgrade to access
          </div>
        )}
      </CardContent>
    </Card>
  );
};
