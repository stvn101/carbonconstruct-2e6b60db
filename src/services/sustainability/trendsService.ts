
/**
 * Sustainability Trends Services
 * Provides trend data and analytics for sustainability metrics
 */

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
