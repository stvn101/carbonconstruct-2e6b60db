
import React, { createContext, useContext } from 'react';
import { useAuth } from '@/contexts/auth';
import { ProjectContextType } from '@/types/project';
import { useProjectProvider } from './project/useProjectProvider';
import { ProjectsProvider } from './project/useProjectsLoader';
import { useProjectRealtime } from './project/useProjectRealtime';
import { useProjectInitialization } from './project/useProjectInitialization';
import { CalculatorProvider } from '@/contexts/calculator/CalculatorContext';

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};

export { type SavedProject } from '@/types/project';

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const {
    contextValue,
    setProjects,
    setIsLoading,
    setFetchError,
  } = useProjectProvider();

  // Set up realtime subscriptions
  const { subscribeToProjects } = useProjectRealtime(user?.id, setProjects);
  
  // Initialize data function that will be passed to the initialization hook
  const initializeData = async () => {
    // This function is kept empty since the actual data loading is handled by
    // the useProjectProvider hook which already initializes the projects data
    console.log("Project data initialization complete");
  };
  
  // Use our initialization hook
  const { projectChannel } = useProjectInitialization({
    user,
    setProjects,
    setIsLoading,
    setFetchError,
    subscribeToProjects,
    initializeData
  });

  // Ensure we have a CalculatorProvider to wrap the ProjectsProvider
  const wrappedProvider = (
    <CalculatorProvider>
      {ProjectsProvider({ children }).Provider({ children })}
    </CalculatorProvider>
  );
  
  return (
    <ProjectContext.Provider value={contextValue}>
      {children}
    </ProjectContext.Provider>
  );
};
