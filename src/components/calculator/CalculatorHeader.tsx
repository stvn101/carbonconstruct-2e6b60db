
import React from "react";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface CalculatorHeaderProps {
  isPremiumUser?: boolean;
}

const CalculatorHeader = ({ isPremiumUser = false }: CalculatorHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <h1 className="text-2xl font-bold text-foreground" id="calculator-heading">Carbon Calculator</h1>
          {isPremiumUser && (
            <Badge className="bg-carbon-500 text-xs">
              <Star className="h-3 w-3 mr-1" aria-hidden="true" />
              <span>Premium</span>
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          Calculate the carbon footprint for your construction project.
          {isPremiumUser 
            ? " Access all premium features and unlimited calculations." 
            : " Sign up for a premium account to unlock advanced features."}
        </p>
      </div>
      
      {!isPremiumUser && (
        <div className="mt-4 md:mt-0">
          <Link 
            to="/help" 
            className="text-carbon-600 hover:text-carbon-800 dark:text-carbon-300 dark:hover:text-carbon-100 flex items-center gap-1 text-sm"
            aria-label="Learn how to use the calculator"
          >
            <GraduationCap className="h-4 w-4" aria-hidden="true" />
            <span>Learn how to use the calculator</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CalculatorHeader;
