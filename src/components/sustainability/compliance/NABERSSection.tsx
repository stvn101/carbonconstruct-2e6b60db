
import React from "react";
import { CheckCircle, XCircle, Star, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NABERSSectionProps {
  nabersData: {
    compliant: boolean;
    score: number;
    details?: any;
    error?: string;
  } | null;
}

const NABERSSection: React.FC<NABERSSectionProps> = ({ nabersData }) => {
  if (!nabersData) return null;
  
  if (nabersData.error) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium">NABERS</h3>
          <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Error
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{nabersData.error}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">NABERS Rating</h3>
        <div className="flex items-center">
          {nabersData.compliant ? (
            <Badge className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Compliant
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
              <XCircle className="h-3 w-3 mr-1" />
              Non-Compliant
            </Badge>
          )}
        </div>
      </div>
      
      <div className="p-3 border rounded-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center">
            <span className="text-sm font-medium mr-2">Star Rating:</span>
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-5 w-5 ${
                    i < nabersData.score 
                      ? "text-amber-400 fill-amber-400" 
                      : "text-gray-300 dark:text-gray-600"
                  }`} 
                />
              ))}
            </div>
          </div>
          <span className="text-sm font-medium">{nabersData.score}-Star</span>
        </div>
        
        {nabersData.details && (
          <div className="mt-3 pt-3 border-t text-xs">
            <div className="text-xs text-muted-foreground mb-2">
              {nabersData.compliant 
                ? "Your project meets the NABERS 4-star minimum requirement"
                : "Your project needs to achieve at least a 4-star rating to be compliant"}
            </div>
            
            {nabersData.details.requirements && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Current requirements */}
                {nabersData.details.requirements.current && 
                 nabersData.details.requirements.current.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-1">Met Requirements</h5>
                    <ul className="space-y-1 pl-5">
                      {nabersData.details.requirements.current.map((req: string, idx: number) => (
                        <li key={idx} className="list-disc">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Missing requirements */}
                {nabersData.details.requirements.missing && 
                 nabersData.details.requirements.missing.length > 0 && (
                  <div>
                    <h5 className="font-medium mb-1">Missing Requirements</h5>
                    <ul className="space-y-1 pl-5">
                      {nabersData.details.requirements.missing.map((req: string, idx: number) => (
                        <li key={idx} className="list-disc">{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NABERSSection;
