
import { BookmarkCheck, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";

interface ProjectNameCardProps {
  projectName: string;
  onProjectNameChange: (value: string) => void;
  onSave: () => void;
  isSaving?: boolean;
  demoMode?: boolean;
}

const ProjectNameCard = ({ 
  projectName, 
  onProjectNameChange, 
  onSave,
  isSaving = false,
  demoMode = false
}: ProjectNameCardProps) => {
  const [nameError, setNameError] = useState<string | null>(null);
  const { user } = useAuth();

  // Sanitize input and validate project name
  const handleNameChange = (value: string) => {
    // Replace special characters that could cause issues
    // Allow alphanumeric characters, spaces, hyphens, underscores and common punctuation
    const sanitizedValue = value.replace(/[^\w\s.,\-()&]/g, '');
    
    if (sanitizedValue.trim() === '') {
      setNameError('Project name cannot be empty');
    } else if (sanitizedValue.length > 50) {
      setNameError('Project name must be less than 50 characters');
    } else {
      setNameError(null);
    }
    
    onProjectNameChange(sanitizedValue);
  };

  // Validate initial project name
  useEffect(() => {
    if (projectName.trim() === '') {
      setNameError('Project name cannot be empty');
    } else if (projectName.length > 50) {
      setNameError('Project name must be less than 50 characters');
    } else {
      setNameError(null);
    }
  }, [projectName]);

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex-grow w-full md:w-auto">
            <Label htmlFor="project-name" className="text-sm font-medium mb-1 block">
              Project Name
            </Label>
            <Input
              id="project-name"
              value={projectName}
              onChange={(e) => handleNameChange(e.target.value)}
              className={`w-full ${nameError ? 'border-destructive' : ''}`}
              placeholder="Enter project name"
              disabled={isSaving}
              aria-invalid={!!nameError}
              aria-describedby={nameError ? "project-name-error" : undefined}
            />
            {nameError && (
              <p id="project-name-error" className="mt-1 text-xs text-destructive">
                {nameError}
              </p>
            )}
          </div>
          <div className="w-full md:w-auto flex justify-end mt-2 md:mt-6">
            <Button 
              onClick={onSave}
              className={`
                text-white
                ${demoMode && !user ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-carbon-600 hover:bg-carbon-700'}
              `}
              disabled={isSaving || !!nameError}
              title={demoMode && !user ? "Sign in to save projects" : undefined}
              aria-label={demoMode && !user ? "Sign in to save projects" : "Save project"}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                  {demoMode && !user ? "Sign In to Save" : "Save Project"}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectNameCard;
