
/**
 * Sustainability API Service
 * Handles API interactions for sustainability services
 */
import { supabase } from "@/integrations/supabase/client";

// Re-export types from the new performance service
export type { 
  MaterialPerformanceData,
  SustainabilityTrendData,
  MaterialRecommendation
} from './materialPerformanceService';

// Re-export implementation from the new performance service
export { 
  trackMaterialPerformance,
  getMaterialTrends,
  getMaterialRecommendations
} from './materialPerformanceService';

/**
 * Gets sustainability compliance status for a project
 */
export async function checkSustainabilityCompliance(projectId: string): Promise<{
  ncc: { compliant: boolean; details?: any };
  nabers: { rating: number; compliant: boolean; details?: any };
}> {
  try {
    // Get the project details
    const { data: project, error } = await supabase
      .from('projects')
      .select('materials, energy, transport')
      .eq('id', projectId)
      .single();
      
    if (error) throw error;
    
    if (!project) {
      throw new Error('Project not found');
    }
    
    // Call the sustainability service functions
    const { fetchNccComplianceCheck, fetchNabersComplianceCheck } = await import(
      '@/hooks/sustainability/sustainabilityService'
    );
    
    // Run the compliance checks
    const nccCompliance = await fetchNccComplianceCheck(project.materials, { includeDetails: true });
    const nabersCompliance = await fetchNabersComplianceCheck(project.energy, { targetRating: 5 });
    
    return {
      ncc: nccCompliance,
      nabers: nabersCompliance
    };
  } catch (error) {
    console.error('Error checking sustainability compliance:', error);
    return {
      ncc: { compliant: false },
      nabers: { rating: 0, compliant: false }
    };
  }
}

/**
 * Gets sustainability trend data for a project over time
 */
export async function getProjectSustainabilityTrend(projectId: string): Promise<{
  trend: Array<{ date: string; score: number; carbonFootprint: number }>;
  improvement: number;
}> {
  try {
    // This would typically get real data from the database
    // For now, generate sample data
    const today = new Date();
    const trend = [];
    
    // Generate data for past 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Generate some realistic looking values with a general improvement trend
      const baseScore = 60 + (i * 0.5);
      const randomVariation = (Math.random() * 10) - 5; // -5 to +5
      
      const baseCarbonFootprint = 5000 - (i * 70);
      const carbonRandomVariation = (Math.random() * 500) - 250; // -250 to +250
      
      trend.push({
        date: date.toISOString().split('T')[0],
        score: Math.min(100, Math.max(0, baseScore + randomVariation)),
        carbonFootprint: Math.max(0, baseCarbonFootprint + carbonRandomVariation)
      });
    }
    
    // Calculate improvement percentage
    const firstPoint = trend[0];
    const lastPoint = trend[trend.length - 1];
    const improvement = firstPoint.carbonFootprint > 0 ? 
      ((firstPoint.carbonFootprint - lastPoint.carbonFootprint) / firstPoint.carbonFootprint) * 100 : 0;
    
    return {
      trend,
      improvement
    };
  } catch (error) {
    console.error('Error getting project sustainability trend:', error);
    return {
      trend: [],
      improvement: 0
    };
  }
}

/**
 * Gets sustainability issues for a project
 */
export async function getProjectSustainabilityIssues(projectId: string): Promise<Array<{
  id: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
  component: string;
  recommendation: string;
}>> {
  try {
    // This would typically get real data from the database
    // For now, generate sample issues
    return [
      {
        id: '1',
        severity: 'high',
        description: 'High-carbon concrete mix used in foundation',
        component: 'Materials',
        recommendation: 'Switch to low-carbon concrete alternative with fly ash or GGBS'
      },
      {
        id: '2',
        severity: 'medium',
        description: 'Long-distance transportation of steel components',
        component: 'Transportation',
        recommendation: 'Source steel from local suppliers to reduce transport emissions'
      },
      {
        id: '3',
        severity: 'low',
        description: 'Inadequate on-site renewable energy',
        component: 'Energy',
        recommendation: 'Install temporary solar panels for construction power needs'
      }
    ];
  } catch (error) {
    console.error('Error getting project sustainability issues:', error);
    return [];
  }
}

/**
 * Creates a sustainability report for a project
 */
export async function createSustainabilityReport(projectId: string): Promise<{
  reportUrl: string;
  reportId: string;
  generatedAt: string;
}> {
  try {
    // This would typically generate a real report and store it
    // For now, return a mock response
    return {
      reportUrl: '#',
      reportId: `report-${Date.now()}`,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating sustainability report:', error);
    throw error;
  }
}

/**
 * Updates a project's sustainability goals
 */
export async function updateProjectSustainabilityGoals(
  projectId: string, 
  goals: {
    targetRating: number;
    carbonReductionTarget: number;
    sustainabilityFeatures: string[];
  }
): Promise<void> {
  try {
    // This would typically update real data in the database
    console.log('Updating sustainability goals for project', projectId, goals);
  } catch (error) {
    console.error('Error updating project sustainability goals:', error);
    throw error;
  }
}
