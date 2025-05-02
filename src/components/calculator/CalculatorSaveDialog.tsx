
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface CalculatorSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving: boolean;
  isExisting: boolean;
}

const CalculatorSaveDialog: React.FC<CalculatorSaveDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isSaving,
  isExisting
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isExisting ? 'Update Existing Project?' : 'Save Project'}
          </DialogTitle>
          <DialogDescription>
            {isExisting 
              ? 'This will overwrite the existing project with the same name.'
              : 'Save your current calculation as a project.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isSaving}
            className="bg-carbon-600 hover:bg-carbon-700 text-white"
          >
            {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isExisting ? 'Update' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CalculatorSaveDialog;
