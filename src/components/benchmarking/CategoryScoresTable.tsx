
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Project } from "./types";

interface CategoryScoresTableProps {
  currentProject: Project;
}

const CategoryScoresTable: React.FC<CategoryScoresTableProps> = ({ currentProject }) => {
  return (
    <div>
      <h3 className="font-medium mb-3">Category Analysis</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Score</TableHead>
            <TableHead>Avg</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <CategoryScoreRow 
            category="Materials" 
            score={currentProject.materialsScore} 
            average={60} 
          />
          <CategoryScoreRow 
            category="Transport" 
            score={currentProject.transportScore} 
            average={55} 
          />
          <CategoryScoreRow 
            category="Energy" 
            score={currentProject.energyScore} 
            average={65} 
          />
          <CategoryScoreRow 
            category="Waste" 
            score={currentProject.wasteScore} 
            average={60} 
          />
          <CategoryScoreRow 
            category="Water" 
            score={currentProject.waterScore} 
            average={70} 
          />
        </TableBody>
      </Table>
    </div>
  );
};

interface CategoryScoreRowProps {
  category: string;
  score: number;
  average: number;
}

const CategoryScoreRow: React.FC<CategoryScoreRowProps> = ({ category, score, average }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{category}</TableCell>
      <TableCell>{score}</TableCell>
      <TableCell>{average}</TableCell>
      <TableCell>
        <Badge className={score >= average ? "bg-green-500" : "bg-red-500"}>
          {score >= average ? "Good" : "Needs Work"}
        </Badge>
      </TableCell>
    </TableRow>
  );
};

export default CategoryScoresTable;
