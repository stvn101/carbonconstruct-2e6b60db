
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ComplianceSectionProps } from "./types";

const ComplianceSection: React.FC<ComplianceSectionProps> = ({
  title,
  description,
  children,
  icon,
  compliant,
  badgeText
}) => {
  const getBadgeVariant = (isCompliant?: boolean) => {
    if (typeof isCompliant !== 'boolean') return 'secondary';
    return isCompliant ? 'success' : 'destructive';
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center text-lg">
            {icon && <span className="mr-2">{icon}</span>}
            {title}
          </CardTitle>
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        {badgeText && (
          <Badge variant={getBadgeVariant(compliant)}>
            {badgeText}
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default ComplianceSection;
