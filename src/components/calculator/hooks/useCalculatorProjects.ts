
import { useState } from 'react';
import { SavedProject } from '@/types/project';

export interface UseCalculatorProjectsProps {
  projectName: string;
}

export function useCalculatorProjects({ projectName }: UseCalculatorProjectsProps) {
  // Try to get projects context if available
  let saveProject: ((project: any) => Promise<SavedProject>) | undefined;
  let projects: SavedProject[] = [];
  let hasProjectsContext = true;
  const [projectContextError, setProjectContextError] = useState<Error | null>(null);

  try {
    // Try to dynamically import to avoid context errors if not in provider
    const { useProjects } = require('@/contexts/ProjectContext');
    const projectsContext = useProjects();
    saveProject = projectsContext.saveProject;
    projects = projectsContext.projects || [];
  } catch (error) {
    console.warn('ProjectContext not available, running in standalone calculator mode:', error);
    hasProjectsContext = false;
    setProjectContextError(error instanceof Error ? error : new Error('ProjectContext not available'));
  }

  const isExistingProject = hasProjectsContext && projects.length > 0 && !!projects.find(
    p => p.name.toLowerCase() === projectName.toLowerCase()
  );

  return {
    saveProject,
    projects,
    hasProjectsContext,
    isExistingProject,
    projectContextError
  };
}
