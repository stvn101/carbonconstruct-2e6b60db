
import { toast } from 'sonner';
import { SavedProject } from '@/types/project';
import { exportProjectToPDF, exportProjectToCSV } from '@/utils/exportUtils';

export const useProjectExports = () => {
  const exportProjectPDF = async (project: SavedProject) => {
    try {
      toast.success("PDF export started");
      await exportProjectToPDF(project);
      toast.success("PDF exported successfully");
    } catch (error) {
      console.error('PDF export failed:', error);
      toast.error("Failed to export PDF");
    }
  };

  const exportProjectCSV = async (project: SavedProject) => {
    try {
      await exportProjectToCSV(project);
      toast.success("CSV exported successfully");
    } catch (error) {
      console.error('CSV export failed:', error);
      toast.error("Failed to export CSV");
    }
  };

  return {
    exportProjectPDF,
    exportProjectCSV,
  };
};
