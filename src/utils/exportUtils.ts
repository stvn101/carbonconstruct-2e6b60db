
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SavedProject } from '@/types/project';

export async function exportProjectToPDF(project: SavedProject): Promise<void> {
  try {
    // Create a new PDF document
    const doc = new jsPDF();
    const { materials, transport, energy, result } = project;
    
    // Add project title
    doc.setFontSize(20);
    doc.text(`Project: ${project.name}`, 14, 22);
    
    // Add creation date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    
    // Add project description if available
    if (project.description) {
      doc.setFontSize(12);
      doc.text(`Description: ${project.description}`, 14, 40);
    }
    
    // Add total emissions
    doc.setFontSize(14);
    doc.setTextColor(0, 102, 51); // Dark green color
    const totalEmissions = project.total_emissions || 0;
    doc.text(`Total Emissions: ${totalEmissions.toFixed(2)} kg CO2e`, 14, 55);
    doc.setTextColor(0, 0, 0); // Reset to black
    
    // Add Materials table
    doc.setFontSize(12);
    doc.text('Materials', 14, 70);
    
    autoTable(doc, {
      startY: 75,
      head: [['Material Type', 'Quantity (kg)', 'Emissions (kg CO2e)']],
      body: materials.map(material => [
        material.type,
        material.quantity.toString(),
        (result?.breakdownByMaterial?.[material.type] || 0).toFixed(2)
      ]),
    });
    
    // Add Transport table - safely access finalY
    const transportY = (doc.lastAutoTable?.finalY || 120) + 15;
    doc.text('Transport', 14, transportY);
    
    autoTable(doc, {
      startY: transportY + 5,
      head: [['Transport Type', 'Distance (km)', 'Weight (kg)', 'Emissions (kg CO2e)']],
      body: transport.map(item => [
        item.type,
        item.distance.toString(),
        item.weight.toString(),
        (result?.breakdownByTransport?.[item.type] || 0).toFixed(2)
      ]),
    });
    
    // Add Energy table - safely access finalY
    const energyY = (doc.lastAutoTable?.finalY || 180) + 15;
    doc.text('Energy', 14, energyY);
    
    autoTable(doc, {
      startY: energyY + 5,
      head: [['Energy Type', 'Amount (kWh)', 'Emissions (kg CO2e)']],
      body: energy.map(item => [
        item.type,
        item.amount.toString(),
        (result?.breakdownByEnergy?.[item.type] || 0).toFixed(2)
      ]),
    });
    
    // Add summary footer - safely access finalY
    const summaryY = (doc.lastAutoTable?.finalY || 240) + 15;
    doc.text('Emissions Summary', 14, summaryY);
    
    autoTable(doc, {
      startY: summaryY + 5,
      head: [['Category', 'Total Emissions (kg CO2e)', 'Percentage']],
      body: [
        ['Materials', (result?.materialEmissions || 0).toFixed(2), `${((result?.materialEmissions || 0) / totalEmissions * 100).toFixed(1)}%`],
        ['Transport', (result?.transportEmissions || 0).toFixed(2), `${((result?.transportEmissions || 0) / totalEmissions * 100).toFixed(1)}%`],
        ['Energy', (result?.energyEmissions || 0).toFixed(2), `${((result?.energyEmissions || 0) / totalEmissions * 100).toFixed(1)}%`],
        ['Total', totalEmissions.toFixed(2), '100%']
      ],
    });
    
    // Add footer with CarbonConstruct branding
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text('CarbonConstruct - Building Greener, Measuring Smarter', 14, 290);
      doc.text(`Page ${i} of ${pageCount}`, 180, 290);
    }
    
    // Save the PDF
    const filename = `${project.name.replace(/\s+/g, '_')}_carbon_report.pdf`;
    doc.save(filename);
    
    return Promise.resolve();
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
}

export async function exportProjectToCSV(project: SavedProject): Promise<void> {
  try {
    // Simple CSV generation
    const { materials, transport, energy } = project;
    
    const createCSVContent = (data: any[], headers: string[]) => {
      const headerRow = headers.join(',');
      const dataRows = data.map(item => 
        headers.map(header => JSON.stringify(item[header] || '')).join(',')
      );
      return [headerRow, ...dataRows].join('\n');
    };
    
    const materialsCSV = createCSVContent(materials, ['type', 'quantity']);
    const transportCSV = createCSVContent(transport, ['type', 'distance', 'weight']);
    const energyCSV = createCSVContent(energy, ['type', 'amount']);
    
    const csvContent = `Materials\n${materialsCSV}\n\nTransport\n${transportCSV}\n\nEnergy\n${energyCSV}`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${project.name.replace(/\s+/g, '_')}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return Promise.resolve();
  } catch (error) {
    console.error('CSV export failed:', error);
    throw error;
  }
}
