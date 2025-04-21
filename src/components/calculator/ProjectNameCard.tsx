
import { BookmarkCheck, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProjectNameCardProps {
  projectName: string;
  onProjectNameChange: (value: string) => void;
  onSave: () => void;
  isSaving?: boolean;
}

const ProjectNameCard = ({ 
  projectName, 
  onProjectNameChange, 
  onSave,
  isSaving = false
}: ProjectNameCardProps) => {
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
              onChange={(e) => onProjectNameChange(e.target.value)}
              className="w-full"
              placeholder="Enter project name"
              disabled={isSaving}
            />
          </div>
          <div className="w-full md:w-auto flex justify-end mt-2 md:mt-6">
            <Button 
              onClick={onSave}
              className="bg-carbon-600 hover:bg-carbon-700 text-white"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <BookmarkCheck className="h-4 w-4 mr-2" />
                  Save Project
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
