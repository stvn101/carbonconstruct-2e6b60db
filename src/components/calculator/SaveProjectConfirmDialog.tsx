
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

interface SaveProjectConfirmDialogProps {
  isOpen: boolean;
  projectName: string;
  isSaving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isOverwrite: boolean;
}

const SaveProjectConfirmDialog = ({
  isOpen,
  projectName,
  isSaving,
  onConfirm,
  onCancel,
  isOverwrite,
}: SaveProjectConfirmDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent className="bg-background text-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isOverwrite ? "Update Existing Project?" : "Save Project"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isOverwrite ? (
              <>
                A project with the name <strong className="font-semibold text-carbon-700 dark:text-carbon-300">{projectName}</strong> already exists. Are you sure you want to update it with your current calculation?
              </>
            ) : (
              <>
                Save <strong className="font-semibold text-carbon-700 dark:text-carbon-300">{projectName}</strong> to your projects dashboard?
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel} disabled={isSaving}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isSaving}
            className="bg-carbon-600 hover:bg-carbon-700 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              isOverwrite ? "Update Project" : "Save Project"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SaveProjectConfirmDialog;
