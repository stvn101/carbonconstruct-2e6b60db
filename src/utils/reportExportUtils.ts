import { CalculationInput, CalculationResult } from "@/lib/carbonExports";
import { MaterialAnalysisResult } from "supabase/functions/get-sustainability-suggestions/Material";
import { toast } from "sonner";

interface SustainabilityReportData {
  calculationInput?: CalculationInput;
  calculationResult: CalculationResult;
  sustainabilityReport?: any;
  materialAnalysis?: MaterialAnalysisResult | null;
  complianceData?: any;
  suggestions?: string[];
  filename?: string;
}

// Helper function to export data as CSV
export const exportSustainabilityCSV = async (data: SustainabilityReportData) => {
  try {
    const { 
      calculationResult, 
      materialAnalysis, 
      suggestions,
      filename = "sustainability-data.csv"
    } = data;
    
    // Create CSV headers
    const headers = ["Category,Name,Value,Unit"];
    
    // Add emissions data
    const emissionsRows = [
      `Emissions,Total,${calculationResult.totalEmissions.toFixed(2)},kg CO2e`,
      `Emissions,Materials,${calculationResult.materialEmissions.toFixed(2)},kg CO2e`,
      `Emissions,Transport,${calculationResult.transportEmissions.toFixed(2)},kg CO2e`,
      `Emissions,Energy,${calculationResult.energyEmissions.toFixed(2)},kg CO2e`,
    ];
    
    // Add sustainability metrics
    const sustainabilityRows = [
      `Metrics,Sustainability Score,${materialAnalysis?.sustainabilityScore || 'N/A'},/100`,
      `Metrics,Sustainable Material Percentage,${materialAnalysis?.sustainabilityPercentage?.toFixed(1) || 'N/A'},%`
    ];
    
    // Add high impact materials
    const materialRows = materialAnalysis?.highImpactMaterials?.map(material => 
      `Material,${material.name},${material.carbonFootprint.toFixed(2)},kg CO2e/kg`
    ) || [];
    
    // Add recommendations
    const recommendationRows = suggestions?.map((suggestion, index) => 
      `Recommendation,${index + 1},${suggestion.replace(/,/g, ';')},`
    ) || [];
    
    // Combine all rows
    const csvContent = [
      ...headers, 
      ...emissionsRows, 
      ...sustainabilityRows, 
      ...materialRows, 
      ...recommendationRows
    ].join("\n");
    
    // Create download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Export Successful", {
      description: "Your sustainability data has been exported as CSV.",
      duration: 3000,
    });
    
    return true;
  } catch (error) {
    console.error("Failed to export CSV:", error);
    toast.error("Export Failed", {
      description: "Unable to export data as CSV. Please try again later.",
      duration: 3000,
    });
    return false;
  }
};

// Helper function to export data as PDF
export const exportSustainabilityReport = async (data: SustainabilityReportData) => {
  try {
    const { 
      calculationInput, 
      calculationResult, 
      sustainabilityReport, 
      materialAnalysis,
      complianceData,
      suggestions = [],
      filename = "sustainability-report.pdf"
    } = data;
    
    // Dynamically import jspdf and jspdf-autotable
    const { default: jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');
    
    // Create PDF document
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(60, 152, 71); // Green color
    doc.text("Sustainability Report", 105, 20, { align: "center" });
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 27, { align: "center" });
    
    // Add summary
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Project Summary", 14, 40);
    
    // Summary table
    autoTable(doc, {
      startY: 45,
      head: [['Metric', 'Value']],
      body: [
        ['Total Emissions', `${calculationResult.totalEmissions.toFixed(2)} kg CO2e`],
        ['Material Emissions', `${calculationResult.materialEmissions.toFixed(2)} kg CO2e`],
        ['Transport Emissions', `${calculationResult.transportEmissions.toFixed(2)} kg CO2e`],
        ['Energy Emissions', `${calculationResult.energyEmissions.toFixed(2)} kg CO2e`],
        ['Sustainability Score', materialAnalysis?.sustainabilityScore ? `${materialAnalysis.sustainabilityScore}/100` : 'N/A'],
        ['Sustainable Materials', materialAnalysis?.sustainabilityPercentage ? `${materialAnalysis.sustainabilityPercentage.toFixed(1)}%` : 'N/A']
      ],
      theme: 'striped',
      headStyles: { fillColor: [62, 152, 71], textColor: [255, 255, 255] }
    });
    
    // Add materials section if available
    if (materialAnalysis?.highImpactMaterials && materialAnalysis.highImpactMaterials.length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY || 120;
      
      doc.setFontSize(16);
      doc.text("High Impact Materials", 14, finalY + 15);
      
      autoTable(doc, {
        startY: finalY + 20,
        head: [['Material', 'Quantity', 'Carbon Footprint', 'Total Impact']],
        body: materialAnalysis.highImpactMaterials.map(material => [
          material.name,
          `${material.quantity || 0} ${material.unit || 'kg'}`,
          `${material.carbonFootprint.toFixed(2)} kg CO2e/${material.unit || 'kg'}`,
          `${((material.quantity || 0) * material.carbonFootprint).toFixed(2)} kg CO2e`
        ]),
        theme: 'striped',
        headStyles: { fillColor: [62, 152, 71], textColor: [255, 255, 255] }
      });
    }
    
    // Add recommendations section
    if (suggestions.length > 0) {
      const finalY = (doc as any).lastAutoTable.finalY || 160;
      
      doc.setFontSize(16);
      doc.text("Recommendations", 14, finalY + 15);
      
      autoTable(doc, {
        startY: finalY + 20,
        head: [['Sustainability Recommendations']],
        body: suggestions.map(suggestion => [suggestion]),
        theme: 'striped',
        headStyles: { fillColor: [62, 152, 71], textColor: [255, 255, 255] }
      });
    }
    
    // Add compliance section if available
    if (complianceData) {
      // Add new page if needed
      if (((doc as any).lastAutoTable.finalY || 180) > 230) {
        doc.addPage();
      } else {
        const finalY = (doc as any).lastAutoTable.finalY || 190;
        doc.setFontSize(16);
        doc.text("Compliance Status", 14, finalY + 15);
      }
      
      const complianceY = ((doc as any).lastAutoTable.finalY || 180) > 230 ? 20 : ((doc as any).lastAutoTable.finalY || 180) + 20;
      
      // NCC Compliance
      const nccStatus = complianceData.ncc?.compliant ? 'Compliant' : 'Non-Compliant';
      const nabersRating = complianceData.nabers?.rating || 'N/A';
      
      autoTable(doc, {
        startY: complianceY,
        head: [['Standard', 'Status', 'Details']],
        body: [
          ['NCC 2025', nccStatus, complianceData.ncc?.details ? JSON.stringify(complianceData.ncc.details).slice(0, 40) + '...' : 'No details available'],
          ['NABERS', `${nabersRating} Stars`, complianceData.nabers?.details ? JSON.stringify(complianceData.nabers.details).slice(0, 40) + '...' : 'No details available']
        ],
        theme: 'striped',
        headStyles: { fillColor: [62, 152, 71], textColor: [255, 255, 255] }
      });
    }
    
    // Add footer to all pages
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('CarbonConstruct Sustainability Report • Compliant with NCC 2025 and NABERS standards', 105, 285, { align: 'center' });
      doc.text(`Page ${i} of ${pageCount}`, 195, 285, { align: 'right' });
    }
    
    // Save PDF
    doc.save(filename);
    
    toast.success("Export Successful", {
      description: "Your sustainability report has been exported as PDF.",
      duration: 3000,
    });
    
    return true;
  } catch (error) {
    console.error("Failed to export PDF:", error);
    toast.error("Export Failed", {
      description: "Unable to export report as PDF. Please try again later.",
      duration: 3000,
    });
    return false;
  }
};
