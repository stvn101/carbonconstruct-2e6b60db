
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ComplianceSectionProps } from "./types";

const ComplianceSection: React.FC<ComplianceSectionProps> = ({ 
  title, 
  compliant, 
  badgeText, 
  children 
}) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">{title}</h3>
        <Badge className={compliant ? "bg-green-500" : "bg-red-500"}>
          {badgeText}
        </Badge>
      </div>
      {children}
    </div>
  );
};

export default ComplianceSection;
