
import React from "react";
import { AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";

const ImprovementAreas: React.FC = () => {
  return (
    <div className="mt-6 bg-carbon-50 p-4 rounded-lg border border-carbon-100">
      <h3 className="font-medium mb-2 flex items-center">
        <AlertTriangle className="h-4 w-4 mr-2 text-carbon-600" />
        Key Areas for Improvement
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Based on your performance against industry benchmarks, these are the highest priority areas to focus on:
      </p>
      <ul className="space-y-2 text-sm">
        <ImprovementAreaItem 
          direction="up" 
          area="Materials Selection" 
          description="Switching to low-carbon alternatives could significantly improve your overall performance."
        />
        <ImprovementAreaItem 
          direction="up" 
          area="Energy Efficiency" 
          description="Optimizing equipment usage and implementing renewable energy sources would have substantial impact."
        />
        <ImprovementAreaItem 
          direction="down" 
          area="Transportation" 
          description="Your project is already performing well in this category compared to industry averages."
        />
      </ul>
    </div>
  );
};

interface ImprovementAreaItemProps {
  direction: "up" | "down";
  area: string;
  description: string;
}

const ImprovementAreaItem: React.FC<ImprovementAreaItemProps> = ({ direction, area, description }) => {
  return (
    <li className="flex items-start">
      <div className="mr-2 mt-0.5">
        {direction === "up" ? (
          <ArrowUp className="h-4 w-4 text-red-500" />
        ) : (
          <ArrowDown className="h-4 w-4 text-green-500" />
        )}
      </div>
      <span>
        <strong>{area}:</strong> {description}
      </span>
    </li>
  );
};

export default ImprovementAreas;
