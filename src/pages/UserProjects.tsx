
import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calculator, 
  FileText, 
  Search, 
  Calendar, 
  Tag, 
  MoreHorizontal,
  Download,
  Trash2,
  Edit,
} from "lucide-react";
import { useProjects, SavedProject } from "@/contexts/ProjectContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

const UserProjects = () => {
  const { projects, deleteProject, exportProjectPDF, exportProjectCSV } = useProjects();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<SavedProject | null>(null);
  const isMobile = useIsMobile();

  // Get all unique tags
  const allTags = Array.from(new Set(projects.flatMap(p => p.tags || [])));

  // Filter projects based on search and selected tag
  const filteredProjects = projects.filter(project => {
    const matchesSearch = search === "" || 
      project.name.toLowerCase().includes(search.toLowerCase()) || 
      (project.description || "").toLowerCase().includes(search.toLowerCase());
    
    const matchesTag = selectedTag === null || 
      (project.tags || []).includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Helmet>
        <title>Projects | CarbonConstruct</title>
        <meta 
          name="description" 
          content="View and manage all your carbon footprint calculation projects."
        />
      </Helmet>
      <Navbar />
      <main className="flex-grow py-12 px-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Projects</h1>
              <p className="text-muted-foreground">Manage your carbon footprint calculations</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                asChild
                className="bg-carbon-600 hover:bg-carbon-700 text-white"
              >
                <Link to="/calculator">
                  <Calculator className="h-4 w-4 mr-2" />
                  New Calculation
                </Link>
              </Button>
            </div>
          </div>

          {/* Search and filter */}
          <div className="mb-6 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge 
                variant={selectedTag === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTag(null)}
              >
                All
              </Badge>
              {allTags.map(tag => (
                <Badge 
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Projects list */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects
                .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                .map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project}
                    onExportPDF={() => exportProjectPDF(project)}
                    onExportCSV={() => exportProjectCSV(project)}
                    onDelete={() => setProjectToDelete(project)}
                  />
                ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <h2 className="text-xl font-medium mb-1">No projects found</h2>
              <p className="text-muted-foreground mb-4">
                {search || selectedTag 
                  ? "Try adjusting your search or filters" 
                  : "Start by creating your first carbon calculation"}
              </p>
              <Button 
                asChild
                className="bg-carbon-600 hover:bg-carbon-700 text-white"
              >
                <Link to="/calculator">
                  <Calculator className="h-4 w-4 mr-2" />
                  New Calculation
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Delete confirmation dialog */}
      <Dialog open={!!projectToDelete} onOpenChange={() => setProjectToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{projectToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProjectToDelete(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

interface ProjectCardProps {
  project: SavedProject;
  onExportPDF: () => void;
  onExportCSV: () => void;
  onDelete: () => void;
}

const ProjectCard = ({ project, onExportPDF, onExportCSV, onDelete }: ProjectCardProps) => {
  return (
    <Card className="h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-start mb-4">
          <Link 
            to={`/project/${project.id}`}
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
                <Link to={`/project/${project.id}`} className="flex items-center">
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

export default UserProjects;
