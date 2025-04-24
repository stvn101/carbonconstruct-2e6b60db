
import { useState } from "react";
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
          <ProjectsHeader />

          <ProjectFilters 
            allTags={allTags}
            selectedTag={selectedTag}
            onTagChange={setSelectedTag}
            searchQuery={search}
            onSearchChange={setSearch}
          />

          <ErrorBoundary feature="Projects List" ignoreErrors={true}>
            {filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects
                  .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
                  .map((project) => (
                    <ProjectCard 
                      key={project.id} 
                      project={project}
                      onDelete={() => setProjectToDelete(project)}
                      onExportPDF={() => exportProjectPDF(project)}
                      onExportCSV={() => exportProjectCSV(project)}
                    />
                  ))}
              </div>
            ) : (
              <EmptyProjectsList hasFilters={!!search || selectedTag !== null} />
            )}
          </ErrorBoundary>
        </div>
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
