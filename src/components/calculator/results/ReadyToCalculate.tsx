
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReadyToCalculateProps {
  hasValidInputs: boolean;
  onCalculate: () => void;
  onPrev: () => void;
}

const ReadyToCalculate = ({ hasValidInputs, onCalculate, onPrev }: ReadyToCalculateProps) => {
  return (
    <div className="text-center p-8">
      <h3 className="text-xl font-medium mb-4">Ready to Calculate Results</h3>
      <p className="mb-6 text-muted-foreground">
        Click the button below to calculate the carbon footprint of your project based on the materials, 
        transport, and energy inputs you've provided.
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-2">
        <Button variant="outline" onClick={onPrev}>
          Previous Step
        </Button>
        <Button 
          onClick={onCalculate} 
          className="bg-carbon-600 hover:bg-carbon-700 text-white"
          disabled={!hasValidInputs}
        >
          Calculate Now
        </Button>
      </div>
      
      {!hasValidInputs && (
        <Alert className="mt-6 max-w-md mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            You need to add at least one material, transport, or energy input with values greater than zero.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ReadyToCalculate;
