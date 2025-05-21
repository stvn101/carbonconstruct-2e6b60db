
/**
 * Sustainability Issues Services
 * Handles tracking and management of sustainability issues and recommendations
 */

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
