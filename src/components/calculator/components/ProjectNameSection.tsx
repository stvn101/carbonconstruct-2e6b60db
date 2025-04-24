
import React from 'react';
import ProjectNameCard from "../ProjectNameCard";

interface ProjectNameSectionProps {
  projectName: string;
  setProjectName: (name: string) => void;
  onSave: () => void;
  isSaving: boolean;
  demoMode: boolean;
}

const ProjectNameSection: React.FC<ProjectNameSectionProps> = ({
  projectName,
  setProjectName,
  onSave,
  isSaving,
  demoMode
}) => {
  return (
    <div className="mb-6">
      <ProjectNameCard
        projectName={projectName}
        onProjectNameChange={setProjectName}
        onSave={onSave}
        isSaving={isSaving}
        demoMode={demoMode}
      />
    </div>
  );
};

export default ProjectNameSection;
