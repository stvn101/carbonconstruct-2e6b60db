
import { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Calculator, 
  FileText,
  FolderPlus,
  Grid3X3
} from "lucide-react";
import { useProjects, SavedProject } from "@/contexts/ProjectContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { DeleteProjectDialog } from "@/components/projects/DeleteProjectDialog";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { EmptyProjectsList } from "@/components/projects/EmptyProjectsList";

const UserProjects = () => {
  const { projects, deleteProject, exportProjectPDF, exportProjectCSV } = useProjects();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<SavedProject | null>(null);
  const isMobile = useIsMobile();

  // Get all unique tags
  const allTags = Array.from(new Set(projects.flatMap(p => p.tags || []))) as string[];

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

  console.log("Rendering UserProjects component", { projectsCount: projects.length });

  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-carbon-50 dark:bg-carbon-900"
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
      <main className="flex-grow pt-24 md:pt-28 px-4 pb-12">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Projects</h1>
              <p className="text-muted-foreground">Manage your carbon footprint calculations</p>
            </div>
            <div className="mt-4 md:mt-0 space-x-2">
              <Button 
                asChild
                variant="outline"
              >
                <Link to="/projects/browse">
                  <Grid3X3 className="h-4 w-4 mr-2" />
                  Browse All
                </Link>
              </Button>
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
                  <Calculator className="h-4 w-4 mr-2" />
                  New Calculation
                </Link>
              </Button>
            </div>
          </div>

          {/* Search and filter */}
          <ProjectFilters 
            allTags={allTags}
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
            searchQuery={search}
            onSearchChange={setSearch}
          />

          {/* Projects list */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects
                .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
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
            <EmptyProjectsList hasFilters={!!search || selectedTag !== null} />
          )}
        </div>
      </main>
      <Footer />

      {/* Delete confirmation dialog */}
      <DeleteProjectDialog
        project={projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </motion.div>
  );
};

export default UserProjects;
