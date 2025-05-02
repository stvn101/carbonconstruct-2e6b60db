
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProjectNameInputProps {
  projectName: string;
  setProjectName: (name: string) => void;
  disabled?: boolean;
  demoMode?: boolean;
}

const ProjectNameInput: React.FC<ProjectNameInputProps> = ({
  projectName,
  setProjectName,
  disabled = false,
  demoMode = false
}) => {
  return (
    <div className="mb-4">
      <Label 
        htmlFor="project-name" 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Project Name {demoMode && <span className="text-amber-600">(Demo Mode)</span>}
      </Label>
      <Input
        id="project-name"
        type="text"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        disabled={disabled}
        placeholder="Enter project name"
        className="w-full"
      />
    </div>
  );
};

export default ProjectNameInput;
