
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalculationResult, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonExports";
import { useExportHandlers } from "@/hooks/useExportHandlers";
import ExportButton from "./ExportButton";

interface ExportOptionsProps {
  result: CalculationResult;
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
}

const ExportOptions = ({ 
  result,
  materials,
  transport,
  energy
}: ExportOptionsProps) => {
  const { isExporting, handleExportCSV, handleExportPDF } = useExportHandlers(
    result,
    materials,
    transport,
    energy
  );
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Results</CardTitle>
        <CardDescription>
          Save your carbon footprint calculation results
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4">
        <ExportButton
          onClick={handleExportCSV}
          disabled={isExporting}
          icon="file"
        >
          Export as CSV
        </ExportButton>
        <ExportButton
          onClick={handleExportPDF}
          disabled={isExporting}
          icon="download"
        >
          Export as PDF
        </ExportButton>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;
