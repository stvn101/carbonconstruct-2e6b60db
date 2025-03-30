
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { CalculationResult, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonCalculations";
import { useToast } from "@/components/ui/use-toast";

interface ExportOptionsProps {
  result: CalculationResult;
  materials: MaterialInput[];
  transport: TransportInput[];
  energy: EnergyInput[];
}

const ExportOptions = ({ result, materials, transport, energy }: ExportOptionsProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  
  const handleExportCSV = () => {
    setIsExporting(true);
    
    try {
      // Create CSV content
      const headers = [
        "Category,Type,Quantity,Unit,Emissions (kg CO2e)"
      ];
      
      // Add materials to CSV
      const materialRows = materials.map(material => {
        const materialName = material.type;
        const quantity = material.quantity;
        const unit = "kg";
        const emissions = result.breakdownByMaterial[material.type] || 0;
        return `Material,${materialName},${quantity},${unit},${emissions.toFixed(2)}`;
      });
      
      // Add transport to CSV
      const transportRows = transport.map(item => {
        const transportName = item.type;
        const distance = item.distance;
        const weight = item.weight;
        const emissions = result.breakdownByTransport[item.type] || 0;
        return `Transport,${transportName},${distance},km,${emissions.toFixed(2)}`;
      });
      
      // Add energy to CSV
      const energyRows = energy.map(item => {
        const energyName = item.type;
        const amount = item.amount;
        const unit = "kWh";
        const emissions = result.breakdownByEnergy[item.type] || 0;
        return `Energy,${energyName},${amount},${unit},${emissions.toFixed(2)}`;
      });
      
      // Add totals to CSV
      const totalRows = [
        `Total,Material Emissions,,kg CO2e,${result.materialEmissions.toFixed(2)}`,
        `Total,Transport Emissions,,kg CO2e,${result.transportEmissions.toFixed(2)}`,
        `Total,Energy Emissions,,kg CO2e,${result.energyEmissions.toFixed(2)}`,
        `Total,All Emissions,,kg CO2e,${result.totalEmissions.toFixed(2)}`
      ];
      
      // Combine all rows
      const csvContent = [
        ...headers,
        ...materialRows,
        ...transportRows,
        ...energyRows,
        ...totalRows
      ].join("\n");
      
      // Create and download the CSV file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'carbon_footprint_results.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Your carbon footprint results have been exported as CSV.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "There was an error exporting your results. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  const handleExportPDF = () => {
    setIsExporting(true);
    
    // For now, simulate PDF export with a toast notification
    // In a real app, you'd use a library like jsPDF to generate a PDF
    setTimeout(() => {
      toast({
        title: "PDF Export",
        description: "PDF export functionality will be implemented in the next version.",
        duration: 3000,
      });
      setIsExporting(false);
    }, 1000);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Results</CardTitle>
        <CardDescription>
          Save your carbon footprint calculation results
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleExportCSV}
          className="flex-1 bg-carbon-700 hover:bg-carbon-800 text-white flex items-center gap-2"
          disabled={isExporting}
        >
          <FileText className="h-4 w-4" />
          Export as CSV
        </Button>
        <Button
          onClick={handleExportPDF}
          className="flex-1 bg-carbon-600 hover:bg-carbon-700 text-white flex items-center gap-2"
          disabled={isExporting}
        >
          <Download className="h-4 w-4" />
          Export as PDF
        </Button>
      </CardContent>
    </Card>
  );
};

export default ExportOptions;
