
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SavedProject } from "@/contexts/ProjectContext";

interface DeleteProjectDialogProps {
  project: SavedProject | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteProjectDialog = ({ project, onClose, onConfirm }: DeleteProjectDialogProps) => {
  if (!project) return null;
  
  return (
    <Dialog open={!!project} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{project.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
