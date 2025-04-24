
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProjects, SavedProject } from "@/contexts/ProjectContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { DeleteProjectDialog } from "@/components/projects/DeleteProjectDialog";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { EmptyProjectsList } from "@/components/projects/EmptyProjectsList";
import ProjectsHeader from "@/components/projects/ProjectsHeader";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// Number of projects to show per page
const PROJECTS_PER_PAGE = 9;

const UserProjects = () => {
  const { projects, deleteProject, exportProjectPDF, exportProjectCSV, isLoading, fetchError } = useProjects();
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<SavedProject | null>(null);
  const isMobile = useIsMobile();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [displayedProjects, setDisplayedProjects] = useState<SavedProject[]>([]);
  const [hasMorePages, setHasMorePages] = useState(false);

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

  // Update displayed projects when filters or page changes
  useEffect(() => {
    // Reset to first page when filters change
    if (search !== "" || selectedTag !== null) {
      setCurrentPage(1);
    }
    
    // Sort by updated_at date (newest first)
    const sortedProjects = [...filteredProjects]
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    
    // Calculate pagination
    const startIndex = 0;
    const endIndex = currentPage * PROJECTS_PER_PAGE;
    
    setDisplayedProjects(sortedProjects.slice(startIndex, endIndex));
    setHasMorePages(endIndex < sortedProjects.length);
  }, [filteredProjects, currentPage, search, selectedTag]);

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleDeleteConfirm = () => {
    if (projectToDelete) {
      deleteProject(projectToDelete.id);
      setProjectToDelete(null);
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-carbon-50 dark:bg-carbon-900 overflow-x-hidden"
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
      <main className="flex-grow pt-24 md:pt-28 px-4 pb-12 overflow-y-auto">
        <ScrollArea className="h-full w-full">
          <div className="container mx-auto">
            <ProjectsHeader />

            <ProjectFilters 
              allTags={allTags}
              selectedTag={selectedTag}
              onTagChange={setSelectedTag}
              searchQuery={search}
              onSearchChange={setSearch}
            />

            <ErrorBoundary feature="Projects List" ignoreErrors={true}>
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-carbon-600" />
                  <span className="ml-3 text-lg">Loading your projects...</span>
                </div>
              ) : fetchError ? (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 my-4 text-center">
                  <p className="text-red-700 dark:text-red-300 mb-3">
                    {fetchError.message || "There was an error loading your projects."}
                  </p>
                  <Button 
                    variant="outline"
                    className="border-red-300 text-red-700 hover:bg-red-100"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              ) : displayedProjects.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayedProjects.map((project) => (
                      <ProjectCard 
                        key={project.id} 
                        project={project}
                        onDelete={() => setProjectToDelete(project)}
                        onExportPDF={() => exportProjectPDF(project)}
                        onExportCSV={() => exportProjectCSV(project)}
                      />
                    ))}
                  </div>
                  
                  {hasMorePages && (
                    <div className="flex justify-center mt-8">
                      <Button 
                        onClick={handleLoadMore}
                        variant="outline"
                        className="border-carbon-300 dark:border-carbon-700"
                      >
                        Load More Projects
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <EmptyProjectsList hasFilters={!!search || selectedTag !== null} />
              )}
            </ErrorBoundary>
          </div>
        </ScrollArea>
      </main>
      <Footer />

      <DeleteProjectDialog
        project={projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleDeleteConfirm}
      />
    </motion.div>
  );
};

export default UserProjects;
