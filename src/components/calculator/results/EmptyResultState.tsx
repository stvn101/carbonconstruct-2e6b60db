
import { AlertCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface EmptyResultStateProps {
  onPrev: () => void;
  onCalculate: () => void;
}

const EmptyResultState = ({ onPrev, onCalculate }: EmptyResultStateProps) => {
  return (
    <div className="text-center p-8">
      <AlertCircle className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
      <h3 className="text-xl font-medium mb-2">No Results Found</h3>
      <p className="mb-6 text-muted-foreground">
        Your calculation didn't produce any emissions data. Please check your inputs and try again.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-2">
        <Button variant="outline" onClick={onPrev}>
          Check Inputs
        </Button>
        <Button 
          onClick={onCalculate} 
          className="bg-carbon-600 hover:bg-carbon-700 text-white"
        >
          Recalculate
        </Button>
      </div>
      
      <Alert className="mt-8 max-w-lg mx-auto bg-amber-50 border-amber-200">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          Make sure your materials, transport, and energy inputs have appropriate quantities and valid types.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default EmptyResultState;
