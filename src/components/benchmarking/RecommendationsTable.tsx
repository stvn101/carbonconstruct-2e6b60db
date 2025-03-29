
import React from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ImprovementRecommendation } from "./types";

interface RecommendationsTableProps {
  recommendations: ImprovementRecommendation[];
}

const RecommendationsTable: React.FC<RecommendationsTableProps> = ({ recommendations }) => {
  return (
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
          <RecommendationRow key={rec.id} recommendation={rec} />
        ))}
      </TableBody>
    </Table>
  );
};

interface RecommendationRowProps {
  recommendation: ImprovementRecommendation;
}

const RecommendationRow: React.FC<RecommendationRowProps> = ({ recommendation: rec }) => {
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
    <TableRow>
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
  );
};

export default RecommendationsTable;
