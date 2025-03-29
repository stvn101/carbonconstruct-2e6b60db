
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowUp, ArrowDown } from "lucide-react";
import { ImprovementRecommendation } from "./types";

interface ImprovementRecommendationsProps {
  recommendations: ImprovementRecommendation[];
}

const ImprovementRecommendations: React.FC<ImprovementRecommendationsProps> = ({
  recommendations
}) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-green-500 hover:bg-green-600";
      case "medium": return "bg-yellow-500 hover:bg-yellow-600";
      case "low": return "bg-gray-500 hover:bg-gray-600";
      default: return "bg-carbon-500 hover:bg-carbon-600";
    }
  };
  
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low": return "bg-green-500 hover:bg-green-600";
      case "medium": return "bg-yellow-500 hover:bg-yellow-600";
      case "high": return "bg-red-500 hover:bg-red-600";
      default: return "bg-carbon-500 hover:bg-carbon-600";
    }
  };

  return (
    <>
      <Table>
        <TableCaption>
          Prioritized recommendations for reducing your project's carbon footprint
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Recommendation</TableHead>
            <TableHead>Potential Reduction</TableHead>
            <TableHead>Implementation</TableHead>
            <TableHead>Impact</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recommendations.map((rec) => (
            <TableRow key={rec.id}>
              <TableCell className="font-medium">{rec.category}</TableCell>
              <TableCell>{rec.recommendation}</TableCell>
              <TableCell>{rec.potentialReduction}</TableCell>
              <TableCell>
                <Badge className={getComplexityColor(rec.complexity)}>
                  {rec.complexity.charAt(0).toUpperCase() + rec.complexity.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getImpactColor(rec.impact)}>
                  {rec.impact.charAt(0).toUpperCase() + rec.impact.slice(1)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="mt-6 bg-carbon-50 p-4 rounded-lg border border-carbon-100">
        <h3 className="font-medium mb-2 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-carbon-600" />
          Key Areas for Improvement
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Based on your performance against industry benchmarks, these are the highest priority areas to focus on:
        </p>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <div className="mr-2 mt-0.5">
              <ArrowUp className="h-4 w-4 text-red-500" />
            </div>
            <span>
              <strong>Materials Selection:</strong> Switching to low-carbon alternatives could significantly improve your overall performance.
            </span>
          </li>
          <li className="flex items-start">
            <div className="mr-2 mt-0.5">
              <ArrowUp className="h-4 w-4 text-red-500" />
            </div>
            <span>
              <strong>Energy Efficiency:</strong> Optimizing equipment usage and implementing renewable energy sources would have substantial impact.
            </span>
          </li>
          <li className="flex items-start">
            <div className="mr-2 mt-0.5">
              <ArrowDown className="h-4 w-4 text-green-500" />
            </div>
            <span>
              <strong>Transportation:</strong> Your project is already performing well in this category compared to industry averages.
            </span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default ImprovementRecommendations;
