
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface PlanActionProps {
  cta: string;
  planId: string;
  processing: string | null;
  hadTrial: boolean;
  isPopular: boolean;
  onAction: (planId: string) => void;
}

const PlanAction = ({ cta, planId, processing, hadTrial, isPopular, onAction }: PlanActionProps) => {
  return (
    <>
      <Button 
        className="w-full" 
        variant={isPopular ? "default" : "outline"}
        onClick={() => onAction(planId)}
        disabled={!!processing}
      >
        {processing === planId ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          cta
        )}
      </Button>
      {isPopular && !hadTrial && (
        <p className="w-full text-xs text-center mt-2 text-green-600">
          Includes 3-day free trial
        </p>
      )}
    </>
  );
};

export default PlanAction;
