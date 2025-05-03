
import { useState } from "react";
import { toast } from "sonner";
import { CalculationResult, MaterialInput, TransportInput, EnergyInput } from "@/lib/carbonExports";

export const useExportHandlers = (
  result: CalculationResult,
  materials: MaterialInput[],
  transport: TransportInput[],
  energy: EnergyInput[]
) => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const headers = ["Category,Type,Quantity,Unit,Emissions (kg CO2e)"];
      
      const materialRows = materials.map(material => {
        const emissions = result.breakdownByMaterial[material.type] || 0;
        return `Material,${material.type},${material.quantity},kg,${emissions.toFixed(2)}`;
      });
      
      const transportRows = transport.map(item => {
        const emissions = result.breakdownByTransport[item.type] || 0;
        return `Transport,${item.type},${item.distance},km,${emissions.toFixed(2)}`;
      });
      
      const energyRows = energy.map(item => {
        const emissions = result.breakdownByEnergy[item.type] || 0;
        return `Energy,${item.type},${item.amount},kWh,${emissions.toFixed(2)}`;
      });
      
      const totalRows = [
        `Total,Material Emissions,,kg CO2e,${result.materialEmissions.toFixed(2)}`,
        `Total,Transport Emissions,,kg CO2e,${result.transportEmissions.toFixed(2)}`,
        `Total,Energy Emissions,,kg CO2e,${result.energyEmissions.toFixed(2)}`,
        `Total,All Emissions,,kg CO2e,${result.totalEmissions.toFixed(2)}`
      ];
      
      const csvContent = [...headers, ...materialRows, ...transportRows, ...energyRows, ...totalRows].join("\n");
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'carbon_footprint_results.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Export Successful", {
        description: "Your carbon footprint results have been exported as CSV.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Export Failed", {
        description: "There was an error exporting your results. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { exportProjectToPDF } = await import('@/utils/exportUtils');
      await exportProjectToPDF({
        id: 'temp',
        name: 'Carbon Footprint Results',
        user_id: 'temp',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        materials,
        transport,
        energy,
        result,
        status: 'completed',
        tags: [],
        total_emissions: result.totalEmissions,
        premium_only: false
      });
      
      toast.success("Export Successful", {
        description: "Your carbon footprint results have been exported as PDF.",
        duration: 3000,
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Export Failed", {
        description: "There was an error exporting your results. Please try again.",
        duration: 3000,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    handleExportCSV,
    handleExportPDF
  };
};
