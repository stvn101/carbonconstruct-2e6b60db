
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

interface CalculatorAlertsProps {
  demoMode: boolean;
  authError: string | null;
  onAuthErrorClear: () => void;
  onSignIn: () => void;
}

const CalculatorAlerts = ({ 
  demoMode, 
  authError, 
  onAuthErrorClear, 
  onSignIn 
}: CalculatorAlertsProps) => {
  if (!demoMode && !authError) return null;
  
  return (
    <>
      {demoMode && (
        <Alert className="mb-6 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/30 dark:border-yellow-800">
          <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertTitle className="text-yellow-800 dark:text-yellow-300">Demo Mode</AlertTitle>
          <AlertDescription className="text-yellow-700 dark:text-yellow-400">
            You're using the calculator in demo mode. Your calculations won't be saved.
            <div className="mt-2 flex flex-wrap gap-2">
              <Button onClick={onSignIn} size="sm" className="bg-carbon-600 hover:bg-carbon-700 text-white">
                Sign In to Save
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
      
      {authError && (
        <Alert className="mb-6 bg-red-50 border-red-200 dark:bg-red-900/30 dark:border-red-800">
          <ExclamationTriangleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-800 dark:text-red-300">Authentication Required</AlertTitle>
          <AlertDescription className="text-red-700 dark:text-red-400">
            {authError}
            <div className="mt-2 flex flex-wrap gap-2">
              <Button onClick={onSignIn} size="sm" className="bg-carbon-600 hover:bg-carbon-700 text-white">
                Sign In
              </Button>
              <Button 
                onClick={onAuthErrorClear} 
                size="sm" 
                variant="outline" 
                className="border-red-200 dark:border-red-800"
              >
                Continue in Demo Mode
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default CalculatorAlerts;
