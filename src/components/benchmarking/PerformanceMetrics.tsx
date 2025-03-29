
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp } from "lucide-react";
import { BenchmarkData, Project } from "./types";

interface PerformanceMetricsProps {
  currentProject: Project;
  benchmark: BenchmarkData;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ 
  currentProject, 
  benchmark 
}) => {
  const performancePercent = ((benchmark.average - currentProject.emissions) / benchmark.average) * 100;
  const isPerformanceGood = performancePercent > 0;

  return (
    <div>
      <div className="p-6 border rounded-lg bg-carbon-50 mb-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-medium mb-1">Your Performance</h3>
          <div className="flex items-center justify-center">
            <span className="text-4xl font-bold mr-2">
              {currentProject.emissions}
            </span>
            <span className="text-sm text-muted-foreground">
              {benchmark.unit}
            </span>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Industry Low</span>
            <span className="font-medium">{benchmark.low} {benchmark.unit}</span>
          </div>
          <div className="relative h-2 bg-gray-200 rounded-full">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white border border-gray-400 rounded-full"
              style={{ 
                left: `${Math.max(0, Math.min(100, (currentProject.emissions - benchmark.low) / (benchmark.high - benchmark.low) * 100))}%`,
                transform: 'translateX(-50%)'
              }}
            ></div>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span>Best</span>
            <span>Average</span>
            <span>Worst</span>
          </div>
        </div>
        
        <Alert className={
          isPerformanceGood
            ? "mt-4 border-green-500 bg-green-50 text-green-800"
            : "mt-4 border-red-500 bg-red-50 text-red-800"
        }>
          <div className="flex items-center gap-2">
            {isPerformanceGood ? (
              <ArrowDown className="h-4 w-4" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
            <AlertTitle className="font-medium">
              {isPerformanceGood 
                ? `${Math.abs(Math.round(performancePercent))}% Below Industry Average` 
                : `${Math.abs(Math.round(performancePercent))}% Above Industry Average`
              }
            </AlertTitle>
          </div>
          <AlertDescription className="mt-2 text-sm">
            {isPerformanceGood 
              ? "Your project is performing better than the industry average. Continue these sustainable practices."
              : "Your project has a higher carbon footprint than the industry average. Review recommendations for improvement."
            }
          </AlertDescription>
        </Alert>
      </div>
      
      <h3 className="font-medium mb-3">Industry Benchmark Details</h3>
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">Industry Average</TableCell>
            <TableCell className="text-right">{benchmark.average} {benchmark.unit}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Best Practice (Low)</TableCell>
            <TableCell className="text-right">{benchmark.low} {benchmark.unit}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">High Emissions</TableCell>
            <TableCell className="text-right">{benchmark.high} {benchmark.unit}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Your Performance</TableCell>
            <TableCell className="text-right font-bold">{currentProject.emissions} {benchmark.unit}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">Difference from Average</TableCell>
            <TableCell className={`text-right font-bold ${isPerformanceGood ? "text-green-600" : "text-red-600"}`}>
              {isPerformanceGood ? "-" : "+"}{Math.abs(currentProject.emissions - benchmark.average)} {benchmark.unit}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default PerformanceMetrics;
