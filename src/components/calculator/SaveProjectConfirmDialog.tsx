
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
import { Loader2, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNetworkStatus } from "@/hooks/useNetworkStatus";

interface SaveProjectConfirmDialogProps {
  isOpen: boolean;
  projectName: string;
  isSaving: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isOverwrite: boolean;
  error?: string | null;
}

const SaveProjectConfirmDialog = ({
  isOpen,
  projectName,
  isSaving,
  onConfirm,
  onCancel,
  isOverwrite,
  error = null,
}: SaveProjectConfirmDialogProps) => {
  const { isOnline } = useNetworkStatus();
  const [saveTimeout, setSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [showSavingTooLong, setShowSavingTooLong] = useState(false);

  // Set a timeout to show a warning if saving takes too long
  useEffect(() => {
    if (isOpen && isSaving && !saveTimeout) {
      const timeout = setTimeout(() => {
        setShowSavingTooLong(true);
      }, 5000); // Show after 5 seconds of saving
      
      setSaveTimeout(timeout);
    }
    
    // Clear the timeout when the dialog closes or saving completes
    if (!isOpen || !isSaving) {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
        setSaveTimeout(null);
      }
      setShowSavingTooLong(false);
    }
    
    return () => {
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }
    };
  }, [isOpen, isSaving, saveTimeout]);

  // Pre-load navigation destination
  useEffect(() => {
    if (isOpen) {
      // Prefetch the projects page to improve navigation speed
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/projects';
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [isOpen]);

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialogContent 
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-6"
      >
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
        
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-md mt-2 mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
              <span className="text-red-700 dark:text-red-300 text-sm">
                {error}
              </span>
            </div>
          </div>
        )}
        
        {!isOnline && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-md mt-2 mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-700 dark:text-amber-300 text-sm">
                You appear to be offline. Please check your internet connection before saving.
              </span>
            </div>
          </div>
        )}
        
        {showSavingTooLong && isSaving && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 rounded-md mt-2 mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-700 dark:text-amber-300 text-sm">
                Saving is taking longer than expected. This could be due to a slow network connection.
              </span>
            </div>
          </div>
        )}
        
        <AlertDialogFooter>
          <AlertDialogCancel 
            onClick={onCancel} 
            disabled={isSaving}
            className="bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            disabled={isSaving || !isOnline}
            className="bg-carbon-600 hover:bg-carbon-700 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isOverwrite ? "Updating..." : "Saving..."}
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
