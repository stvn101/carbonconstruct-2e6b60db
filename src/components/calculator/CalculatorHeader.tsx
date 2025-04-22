
import { Calculator } from "lucide-react";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const CalculatorHeader = () => {
  return (
    <CardHeader className="pb-2 md:pb-6">
      <div className="flex items-center gap-2 md:gap-3">
        <Calculator className="h-5 w-5 md:h-6 md:w-6 text-carbon-600 dark:text-carbon-400" />
        <CardTitle className="text-lg md:text-2xl text-foreground">Project Carbon Calculator</CardTitle>
      </div>
      <CardDescription className="text-xs md:text-sm mt-1 text-muted-foreground">
        Enter the details of your construction project to calculate its carbon footprint.
      </CardDescription>
    </CardHeader>
  );
};

export default CalculatorHeader;
