
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
      <DialogContent className="bg-background text-foreground border-border">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Are you sure you want to delete "{project.name}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-border">
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
