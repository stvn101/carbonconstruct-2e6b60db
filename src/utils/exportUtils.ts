
import { SavedProject } from '@/types/project';

export async function exportProjectToPDF(project: SavedProject): Promise<void> {
  try {
    // In a real app, we would call an edge function to generate a PDF
    await new Promise(resolve => setTimeout(resolve, 1500));
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
