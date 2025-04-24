
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { CalculationResult, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonCalculations";
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    
    try {
      // Create a new PDF document
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(18);
      doc.text("Carbon Footprint Calculation Results", 14, 20);
      
      // Add date
      doc.setFontSize(10);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
      
      // Add total emissions
      doc.setFontSize(14);
      doc.text(`Total Carbon Footprint: ${result.totalEmissions.toFixed(2)} kg CO2e`, 14, 40);
      
      // Add breakdown summaries
      doc.setFontSize(12);
      doc.text(`Materials: ${result.materialEmissions.toFixed(2)} kg CO2e (${(result.materialEmissions / result.totalEmissions * 100).toFixed(1)}%)`, 20, 55);
      doc.text(`Transport: ${result.transportEmissions.toFixed(2)} kg CO2e (${(result.transportEmissions / result.totalEmissions * 100).toFixed(1)}%)`, 20, 65);
      doc.text(`Energy: ${result.energyEmissions.toFixed(2)} kg CO2e (${(result.energyEmissions / result.totalEmissions * 100).toFixed(1)}%)`, 20, 75);
      
      // Materials table
      doc.setFontSize(14);
      doc.text("Materials Breakdown", 14, 90);
      
      autoTable(doc, {
        startY: 95,
        head: [['Material', 'Quantity (kg)', 'Emissions (kg CO2e)']],
        body: materials.map(material => [
          material.type, 
          material.quantity.toString(), 
          (result.breakdownByMaterial[material.type] || 0).toFixed(2)
        ]),
      });
      
      // Transport table
      let currentY = doc.lastAutoTable?.finalY || 130;
      
      doc.setFontSize(14);
      doc.text("Transport Breakdown", 14, currentY + 15);
      
      autoTable(doc, {
        startY: currentY + 20,
        head: [['Transport Type', 'Distance (km)', 'Weight (kg)', 'Emissions (kg CO2e)']],
        body: transport.map(item => [
          item.type, 
          item.distance.toString(), 
          item.weight.toString(), 
          (result.breakdownByTransport[item.type] || 0).toFixed(2)
        ]),
      });
      
      // Energy table
      currentY = doc.lastAutoTable?.finalY || 180;
      
      doc.setFontSize(14);
      doc.text("Energy Breakdown", 14, currentY + 15);
      
      autoTable(doc, {
        startY: currentY + 20,
        head: [['Energy Type', 'Amount (kWh)', 'Emissions (kg CO2e)']],
        body: energy.map(item => [
          item.type, 
          item.amount.toString(), 
          (result.breakdownByEnergy[item.type] || 0).toFixed(2)
        ]),
      });
      
      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text('CarbonConstruct - Building Greener, Measuring Smarter', 14, 290);
        doc.text(`Page ${i} of ${pageCount}`, 180, 290);
      }
      
      // Save PDF
      doc.save("carbon_footprint_results.pdf");
      
      toast({
        title: "Export Successful",
        description: "Your carbon footprint results have been exported as PDF.",
        duration: 3000,
      });
    } catch (error) {
      console.error("PDF export error:", error);
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
