
export interface BenchmarkData {
  name: string;
  average: number;
  low: number;
  high: number;
  unit: string;
}

export interface Project {
  id: number;
  name: string;
  type: string;
  location: string;
  emissions: number;
  area: number;
  materialsScore: number;
  transportScore: number;
  energyScore: number;
  wasteScore: number;
  waterScore: number;
  isCurrent?: boolean;
}

export interface ChartDataPoint {
  name: string;
  emissions: number;
  isCurrent?: boolean;
}

export interface RadarDataPoint {
  subject: string;
  "Current Project": number;
  "Industry Average": number;
}

export interface YearlyTrend {
  year: number;
  residential: number;
  commercial: number;
  industrial: number;
  institutional: number;
}

export interface ImprovementRecommendation {
  id: number;
  category: string;
  recommendation: string;
  impact: "high" | "medium" | "low";
  potentialReduction: string;
  complexity: "high" | "medium" | "low";
}

export type ProjectType = "residential" | "commercial" | "industrial" | "institutional";
