
import { Check, X } from "lucide-react";

interface PlanFeaturesProps {
  features: string[];
  notIncluded: string[];
}

const PlanFeatures = ({ features, notIncluded }: PlanFeaturesProps) => {
  return (
    <>
      <h3 className="font-medium mb-3">Includes:</h3>
      <ul className="space-y-2">
        {features.map((feature) => (
          <li key={feature} className="flex items-start">
            <Check className="h-5 w-5 text-carbon-500 mr-2 shrink-0" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      
      {notIncluded.length > 0 && (
        <>
          <h3 className="font-medium mb-3 mt-6">Not included:</h3>
          <ul className="space-y-2">
            {notIncluded.map((feature) => (
              <li key={feature} className="flex items-start">
                <X className="h-5 w-5 text-foreground/30 mr-2 shrink-0" />
                <span className="text-sm text-foreground/60">{feature}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default PlanFeatures;
