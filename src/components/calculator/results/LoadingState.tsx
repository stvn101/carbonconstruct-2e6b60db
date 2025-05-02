
import { Loader } from "lucide-react";

const LoadingState = () => {
  return (
    <div className="text-center py-12">
      <Loader className="h-8 w-8 animate-spin mx-auto mb-4 text-carbon-600" />
      <h3 className="text-xl font-medium mb-2">Calculating Results</h3>
      <p className="text-muted-foreground">
        Processing your materials, transport, and energy data...
      </p>
    </div>
  );
};

export default LoadingState;
