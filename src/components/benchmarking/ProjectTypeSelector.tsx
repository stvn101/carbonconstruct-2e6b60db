
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectType } from "./types";

interface ProjectTypeSelectorProps {
  projectType: ProjectType;
  onProjectTypeChange: (value: ProjectType) => void;
}

const ProjectTypeSelector: React.FC<ProjectTypeSelectorProps> = ({ 
  projectType, 
  onProjectTypeChange 
}) => {
  return (
    <div className="max-w-md mx-auto mb-8">
      <label htmlFor="project-type" className="block text-sm font-medium mb-2">
        Select Project Type
      </label>
      <Select
        value={projectType}
        onValueChange={(value) => onProjectTypeChange(value as ProjectType)}
      >
        <SelectTrigger id="project-type">
          <SelectValue placeholder="Select project type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="residential">Residential</SelectItem>
          <SelectItem value="commercial">Commercial</SelectItem>
          <SelectItem value="industrial">Industrial</SelectItem>
          <SelectItem value="institutional">Institutional</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectTypeSelector;
