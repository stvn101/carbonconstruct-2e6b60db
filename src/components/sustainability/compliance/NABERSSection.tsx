
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, Info } from "lucide-react";
import ComplianceDetails from "./ComplianceDetails";
import ComplianceTip from "./ComplianceTip";
import ComplianceSection from "./ComplianceSection";
import { ComplianceData } from "../types";

interface NABERSSectionProps {
  nabersData: ComplianceData | null;
}

const NABERSSection: React.FC<NABERSSectionProps> = ({ nabersData }) => {
  const hasNabersData = nabersData && !nabersData.error;
  
  const getBadgeColor = (rating?: number) => {
    if (!rating) return "";
    return rating >= 5 ? "bg-green-500" : 
           rating >= 4 ? "bg-green-400" :
           rating >= 3 ? "bg-yellow-500" :
           "bg-red-500";
  };

  const getNabersContent = () => {
    if (!hasNabersData) return null;
    
    return (
      <div>
        <Alert 
          variant={nabersData.rating && nabersData.rating >= 4 ? "default" : "warning"} 
          className={nabersData.rating && nabersData.rating >= 4 ? "bg-green-50 text-green-800 border-green-200" : ""}
        >
          {nabersData.rating && nabersData.rating >= 4 ? (
            <Shield className="h-4 w-4 text-green-600" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertTitle>NABERS {nabersData.rating} Star Rating</AlertTitle>
          <AlertDescription className={nabersData.rating && nabersData.rating >= 4 ? "text-green-700" : ""}>
            {nabersData.rating && nabersData.rating >= 4 
              ? `Excellent! Your project achieves a ${nabersData.rating} star NABERS rating.`
              : `Your project currently achieves a ${nabersData.rating} star NABERS rating. Consider improvements to achieve 5 stars.`
            }
            <ComplianceDetails details={nabersData.details} />
          </AlertDescription>
        </Alert>
        
        <ComplianceTip>
          {nabersData.rating && nabersData.rating < 5 
            ? "Consider integrating renewable energy sources to improve your NABERS rating. The 2025 criteria emphasize on-site renewable generation."
            : "Maintain your excellent NABERS rating by regularly monitoring energy usage and continuing sustainable practices."
          }
        </ComplianceTip>
      </div>
    );
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">NABERS Rating</h3>
        {hasNabersData ? (
          <Badge className={getBadgeColor(nabersData.rating)}>
            {nabersData.rating} Stars
          </Badge>
        ) : (
          <Badge variant="outline">No Data</Badge>
        )}
      </div>
      
      {hasNabersData ? (
        getNabersContent()
      ) : (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            No NABERS rating data available.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default NABERSSection;
